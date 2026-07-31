using ERP.Identity.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Npgsql;
using Notifications.Application.Interfaces;
using Notifications.Domain.Constants;
using Notifications.Domain.Entities;
using Notifications.Infrastructure.Options;
using Notifications.Infrastructure.Persistence.Data;
using Opportunities.Domain.Entities;
using Opportunities.Infrastructure.Persistence.Data;
using Leads.Infrastructure.Persistence.Data;

namespace Notifications.Infrastructure.Services
{
    public class NotificationProcessingService : INotificationProcessingService
    {
        private static readonly TimeSpan ProcessingLockTimeout = TimeSpan.FromMinutes(30);
        private readonly NotificationsDbContext _notificationsDbContext;
        private readonly OpportunitiesDbContext _opportunitiesDbContext;
        private readonly LeadsDbContext _leadsDbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly INotificationProcessorStatusStore _statusStore;
        private readonly IOptions<NotificationProcessorOptions> _options;
        private readonly ILogger<NotificationProcessingService> _logger;

        public NotificationProcessingService(
            NotificationsDbContext notificationsDbContext,
            OpportunitiesDbContext opportunitiesDbContext,
            LeadsDbContext leadsDbContext,
            UserManager<ApplicationUser> userManager,
            IEmailSender emailSender,
            INotificationProcessorStatusStore statusStore,
            IOptions<NotificationProcessorOptions> options,
            ILogger<NotificationProcessingService> logger)
        {
            _notificationsDbContext = notificationsDbContext;
            _opportunitiesDbContext = opportunitiesDbContext;
            _leadsDbContext = leadsDbContext;
            _userManager = userManager;
            _emailSender = emailSender;
            _statusStore = statusStore;
            _options = options;
            _logger = logger;
        }

        public async Task ProcessDueNotificationsAsync(string trigger, CancellationToken cancellationToken)
        {
            if (!_options.Value.Enabled)
            {
                _statusStore.MarkCompleted(trigger, true, "Notification processor is disabled.");
                _logger.LogInformation("Notification processing skipped because the processor is disabled. Trigger: {Trigger}.", trigger);
                return;
            }

            _statusStore.MarkStarted(trigger);
            _logger.LogInformation("Notification processing started. Trigger: {Trigger}.", trigger);

            try
            {
                var candidateCount = 0;
                var timeZone = ResolveBusinessTimeZone(_options.Value.BusinessTimeZone);
                var today = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone).Date;

                var configurations = await _notificationsDbContext.NotificationConfigurations
                    .Include(x => x.ReminderIntervals)
                    .Where(x => x.IsActive && x.IsEnabled)
                    .ToListAsync(cancellationToken);

                foreach (var configuration in configurations)
                {
                    var candidates = await GetCandidatesAsync(configuration.EventType, timeZone, cancellationToken);
                    foreach (var candidate in candidates)
                    {
                        candidateCount++;
                        var reminderKey = GetReminderKey(configuration, candidate.SourceDueDate, today);
                        if (reminderKey == null)
                        {
                            continue;
                        }

                        if (await IsResolvedAsync(candidate, cancellationToken))
                        {
                            continue;
                        }

                        await DeliverAsync(configuration, candidate, reminderKey, cancellationToken);
                    }
                }

                var message = $"Notification processing completed. Enabled events: {configurations.Count}. Candidates checked: {candidateCount}.";
                _statusStore.MarkCompleted(trigger, true, message);
                _logger.LogInformation("{Message} Trigger: {Trigger}.", message, trigger);
            }
            catch (Exception ex)
            {
                var message = $"Notification processing failed: {ex.Message}";
                _statusStore.MarkCompleted(trigger, false, message);
                _logger.LogError(ex, "Notification processing failed. Trigger: {Trigger}.", trigger);
                throw;
            }
        }

        private async Task<IReadOnlyList<NotificationCandidate>> GetCandidatesAsync(string eventType, TimeZoneInfo timeZone, CancellationToken cancellationToken)
        {
            return eventType switch
            {
                NotificationEventTypes.AgreementExpiry => await GetCommercialCandidatesAsync(eventType, x => x.AgreementExpiryDate, timeZone, cancellationToken),
                NotificationEventTypes.AmcRenewal => await GetCommercialCandidatesAsync(eventType, x => x.AmcRenewalDate, timeZone, cancellationToken),
                NotificationEventTypes.AmcExpiry => await GetCommercialCandidatesAsync(eventType, x => x.AmcExpiryDate, timeZone, cancellationToken),
                NotificationEventTypes.SubscriptionBilling => await GetCommercialCandidatesAsync(eventType, x => x.NextSubscriptionBillingDate, timeZone, cancellationToken),
                NotificationEventTypes.LeadFollowUp => await GetLeadFollowUpCandidatesAsync(timeZone, cancellationToken),
                NotificationEventTypes.OpportunityFollowUp => await GetOpportunityFollowUpCandidatesAsync(timeZone, cancellationToken),
                _ => []
            };
        }

        private async Task<IReadOnlyList<NotificationCandidate>> GetCommercialCandidatesAsync(
            string eventType,
            Func<OpportunityCommercialBreakdown, DateTime?> dateSelector,
            TimeZoneInfo timeZone,
            CancellationToken cancellationToken)
        {
            var breakdowns = await _opportunitiesDbContext.OpportunityCommercialBreakdowns
                .Include(x => x.Opportunity)
                .Where(x => x.IsActive && x.Opportunity != null && x.Opportunity.Status == "Won")
                .ToListAsync(cancellationToken);

            var clientIds = breakdowns
                .Where(x => x.Opportunity != null)
                .Select(x => x.Opportunity!.ClientId)
                .Distinct()
                .ToList();

            var clientNames = await _opportunitiesDbContext.CrmClients
                .Where(x => clientIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Name, cancellationToken);

            var ownerIds = breakdowns
                .Where(x => x.Opportunity != null)
                .Select(x => x.Opportunity!.OwnerUserId)
                .Distinct()
                .ToList();

            var ownerNames = await GetUserNamesAsync(ownerIds, cancellationToken);

            var candidates = new List<NotificationCandidate>();
            foreach (var breakdown in breakdowns)
            {
                if (!IsCommercialEventApplicable(eventType, breakdown))
                {
                    continue;
                }

                var dueDate = dateSelector(breakdown);
                if (!dueDate.HasValue || breakdown.Opportunity == null)
                {
                    continue;
                }

                var opportunity = breakdown.Opportunity;
                candidates.Add(new NotificationCandidate
                {
                    EventType = eventType,
                    SourceRecordType = NotificationSourceRecordTypes.OpportunityCommercialBreakdown,
                    SourceRecordId = breakdown.Id,
                    SourceDueDate = ToBusinessDate(dueDate.Value, timeZone),
                    RecipientUserId = opportunity.OwnerUserId,
                    CustomerName = clientNames.GetValueOrDefault(opportunity.ClientId) ?? opportunity.Title,
                    OpportunityNumber = opportunity.OpportunityNumber,
                    Amount = eventType == NotificationEventTypes.SubscriptionBilling ? breakdown.SubscriptionAmount : breakdown.AmcAmount,
                    DealOwner = ownerNames.GetValueOrDefault(opportunity.OwnerUserId) ?? string.Empty,
                    RelatedUrl = "/pages/opportunities"
                });
            }

            return candidates;
        }

        private async Task<IReadOnlyList<NotificationCandidate>> GetLeadFollowUpCandidatesAsync(TimeZoneInfo timeZone, CancellationToken cancellationToken)
        {
            var interactions = await _leadsDbContext.LeadInteractions
                .Include(x => x.Lead)
                .Where(x => x.IsActive && x.NextFollowUpDate.HasValue && x.Lead != null && x.Lead.AssignedToUserId.HasValue && !x.Lead.IsDeleted)
                .ToListAsync(cancellationToken);

            var ownerIds = interactions
                .Where(x => x.Lead?.AssignedToUserId != null)
                .Select(x => x.Lead!.AssignedToUserId!.Value)
                .Distinct()
                .ToList();

            var ownerNames = await GetUserNamesAsync(ownerIds, cancellationToken);

            return interactions.Select(interaction => new NotificationCandidate
            {
                EventType = NotificationEventTypes.LeadFollowUp,
                SourceRecordType = NotificationSourceRecordTypes.LeadInteraction,
                SourceRecordId = interaction.Id,
                SourceDueDate = ToBusinessDate(interaction.NextFollowUpDate!.Value, timeZone),
                RecipientUserId = interaction.Lead!.AssignedToUserId!.Value,
                CustomerName = interaction.Lead.CompanyName,
                LeadNumber = interaction.Lead.LeadNumber,
                Notes = interaction.Subject ?? interaction.Notes,
                DealOwner = ownerNames.GetValueOrDefault(interaction.Lead.AssignedToUserId.Value) ?? string.Empty,
                RelatedUrl = "/pages/leads"
            }).ToList();
        }

        private async Task<IReadOnlyList<NotificationCandidate>> GetOpportunityFollowUpCandidatesAsync(TimeZoneInfo timeZone, CancellationToken cancellationToken)
        {
            var activities = await _opportunitiesDbContext.OpportunityActivities
                .Include(x => x.Opportunity)
                .Where(x => x.IsActive && x.FollowUpDate.HasValue && x.Opportunity != null)
                .ToListAsync(cancellationToken);

            var ownerIds = activities
                .Where(x => x.Opportunity != null)
                .Select(x => x.Opportunity!.OwnerUserId)
                .Distinct()
                .ToList();

            var ownerNames = await GetUserNamesAsync(ownerIds, cancellationToken);

            var clientIds = activities
                .Where(x => x.Opportunity != null)
                .Select(x => x.Opportunity!.ClientId)
                .Distinct()
                .ToList();

            var clientNames = await _opportunitiesDbContext.CrmClients
                .Where(x => clientIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Name, cancellationToken);

            return activities.Select(activity => new NotificationCandidate
            {
                EventType = NotificationEventTypes.OpportunityFollowUp,
                SourceRecordType = NotificationSourceRecordTypes.OpportunityActivity,
                SourceRecordId = activity.Id,
                SourceDueDate = ToBusinessDate(activity.FollowUpDate!.Value, timeZone),
                RecipientUserId = activity.Opportunity!.OwnerUserId,
                CustomerName = clientNames.GetValueOrDefault(activity.Opportunity.ClientId) ?? activity.Opportunity.Title,
                OpportunityNumber = activity.Opportunity.OpportunityNumber,
                Notes = activity.Subject ?? activity.Notes,
                DealOwner = ownerNames.GetValueOrDefault(activity.Opportunity.OwnerUserId) ?? string.Empty,
                RelatedUrl = "/pages/opportunities"
            }).ToList();
        }

        private async Task DeliverAsync(NotificationConfiguration configuration, NotificationCandidate candidate, string reminderKey, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users
                .Where(x => x.Id == candidate.RecipientUserId && x.IsActive)
                .Select(x => new { x.Id, x.Email })
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                return;
            }

            var subject = ApplyTemplate(configuration.SubjectTemplate, candidate);
            var body = ApplyTemplate(configuration.BodyTemplate, candidate);

            if (configuration.InAppEnabled)
            {
                await DeliverInAppAsync(candidate, reminderKey, user.Email, subject, body, cancellationToken);
            }

            if (configuration.EmailEnabled)
            {
                await DeliverEmailAsync(candidate, reminderKey, user.Email, subject, body, cancellationToken);
            }
        }

        private async Task DeliverInAppAsync(NotificationCandidate candidate, string reminderKey, string? recipientEmail, string subject, string body, CancellationToken cancellationToken)
        {
            var deliveryLog = await StartDeliveryAttemptAsync(candidate, reminderKey, NotificationChannels.InApp, recipientEmail, cancellationToken);
            if (deliveryLog == null)
            {
                return;
            }

            _notificationsDbContext.InAppNotifications.Add(new InAppNotification
            {
                RecipientUserId = candidate.RecipientUserId,
                Title = subject,
                Message = body,
                EventType = candidate.EventType,
                SourceRecordType = candidate.SourceRecordType,
                SourceRecordId = candidate.SourceRecordId,
                SourceDueDate = candidate.SourceDueDate,
                RelatedUrl = candidate.RelatedUrl
            });

            CompleteDelivery(deliveryLog, NotificationDeliveryStatuses.Sent, null);
            await _notificationsDbContext.SaveChangesAsync(cancellationToken);
        }

        private async Task DeliverEmailAsync(NotificationCandidate candidate, string reminderKey, string? recipientEmail, string subject, string body, CancellationToken cancellationToken)
        {
            var deliveryLog = await StartDeliveryAttemptAsync(candidate, reminderKey, NotificationChannels.Email, recipientEmail, cancellationToken);
            if (deliveryLog == null)
            {
                return;
            }

            var result = string.IsNullOrWhiteSpace(recipientEmail)
                ? EmailSendResult.Failure("Recipient email is missing.")
                : await _emailSender.SendAsync(recipientEmail, subject, body, cancellationToken);

            CompleteDelivery(
                deliveryLog,
                result.Succeeded ? NotificationDeliveryStatuses.AcceptedBySmtp : NotificationDeliveryStatuses.Failed,
                result.ErrorMessage);

            await _notificationsDbContext.SaveChangesAsync(cancellationToken);
        }

        private async Task<NotificationDeliveryLog?> StartDeliveryAttemptAsync(NotificationCandidate candidate, string reminderKey, string channel, string? recipientEmail, CancellationToken cancellationToken)
        {
            var deliveryLog = await QueryDeliveryLog(candidate, reminderKey, channel)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken);

            if (deliveryLog != null)
            {
                var staleProcessingCutoff = DateTime.UtcNow.Subtract(ProcessingLockTimeout);
                var successfulStatuses = new[] { NotificationDeliveryStatuses.Sent, NotificationDeliveryStatuses.AcceptedBySmtp };
                var affectedRows = await QueryDeliveryLog(candidate, reminderKey, channel)
                    .Where(x => !successfulStatuses.Contains(x.Status)
                        && (x.Status != NotificationDeliveryStatuses.Processing || (x.UpdatedOn ?? x.CreatedOn) <= staleProcessingCutoff))
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.Status, NotificationDeliveryStatuses.Processing)
                        .SetProperty(x => x.RecipientEmail, recipientEmail)
                        .SetProperty(x => x.ErrorMessage, (string?)null)
                        .SetProperty(x => x.SentOn, (DateTime?)null)
                        .SetProperty(x => x.AttemptCount, x => x.AttemptCount + 1)
                        .SetProperty(x => x.UpdatedOn, DateTime.UtcNow)
                        .SetProperty(x => x.UpdatedBy, Guid.Empty),
                        cancellationToken);

                if (affectedRows == 0)
                {
                    return null;
                }

                return await QueryDeliveryLog(candidate, reminderKey, channel).FirstOrDefaultAsync(cancellationToken);
            }

            deliveryLog = CreateLog(candidate, reminderKey, channel, recipientEmail, NotificationDeliveryStatuses.Processing, null);
            _notificationsDbContext.NotificationDeliveryLogs.Add(deliveryLog);

            try
            {
                await _notificationsDbContext.SaveChangesAsync(cancellationToken);
                return deliveryLog;
            }
            catch (DbUpdateException ex) when (IsUniqueViolation(ex))
            {
                foreach (var entry in ex.Entries)
                {
                    entry.State = EntityState.Detached;
                }

                _logger.LogDebug(ex, "Notification delivery was already reserved for {EventType} {SourceRecordId} {ReminderKey} {Channel}.", candidate.EventType, candidate.SourceRecordId, reminderKey, channel);
                return null;
            }
        }

        private IQueryable<NotificationDeliveryLog> QueryDeliveryLog(NotificationCandidate candidate, string reminderKey, string channel)
        {
            return _notificationsDbContext.NotificationDeliveryLogs.Where(
                x => x.EventType == candidate.EventType
                    && x.IsActive
                    && x.SourceRecordType == candidate.SourceRecordType
                    && x.SourceRecordId == candidate.SourceRecordId
                    && x.SourceDueDate == candidate.SourceDueDate
                    && x.ReminderKey == reminderKey
                    && x.Channel == channel
                    && x.RecipientUserId == candidate.RecipientUserId);
        }

        private static void CompleteDelivery(NotificationDeliveryLog deliveryLog, string status, string? errorMessage)
        {
            deliveryLog.Status = status;
            deliveryLog.ErrorMessage = errorMessage;
            deliveryLog.SentOn = NotificationDeliveryStatuses.IsSuccessful(status) ? DateTime.UtcNow : null;
        }

        private static bool IsUniqueViolation(DbUpdateException exception)
        {
            return exception.InnerException is PostgresException postgresException
                && postgresException.SqlState == PostgresErrorCodes.UniqueViolation;
        }

        private async Task<bool> IsResolvedAsync(NotificationCandidate candidate, CancellationToken cancellationToken)
        {
            return await _notificationsDbContext.NotificationResolutions.AnyAsync(
                x => x.EventType == candidate.EventType
                    && x.SourceRecordType == candidate.SourceRecordType
                    && x.SourceRecordId == candidate.SourceRecordId
                    && x.SourceDueDate == candidate.SourceDueDate
                    && x.IsResolved,
                cancellationToken);
        }

        private static NotificationDeliveryLog CreateLog(NotificationCandidate candidate, string reminderKey, string channel, string? recipientEmail, string status, string? errorMessage)
        {
            return new NotificationDeliveryLog
            {
                EventType = candidate.EventType,
                SourceRecordType = candidate.SourceRecordType,
                SourceRecordId = candidate.SourceRecordId,
                SourceDueDate = candidate.SourceDueDate,
                ReminderKey = reminderKey,
                Channel = channel,
                RecipientUserId = candidate.RecipientUserId,
                RecipientEmail = recipientEmail,
                Status = status,
                ErrorMessage = errorMessage,
                SentOn = NotificationDeliveryStatuses.IsSuccessful(status) ? DateTime.UtcNow : null,
                AttemptCount = 1
            };
        }

        private static string? GetReminderKey(NotificationConfiguration configuration, DateTime dueDate, DateTime today)
        {
            var intervals = configuration.ReminderIntervals
                .Where(x => x.DaysBeforeDue <= configuration.InitialLeadTimeDays)
                .Select(x => x.DaysBeforeDue)
                .Distinct()
                .OrderBy(x => x)
                .ToList();

            foreach (var daysBeforeDue in intervals)
            {
                var reminderDate = dueDate.AddDays(-daysBeforeDue);
                if (today >= reminderDate && today <= dueDate)
                {
                    return $"DAYS-BEFORE-{daysBeforeDue}";
                }
            }

            if (today > dueDate && configuration.OverdueIntervalDays > 0)
            {
                var overdueDays = (today - dueDate).Days;
                if (overdueDays % configuration.OverdueIntervalDays == 0)
                {
                    return $"OVERDUE-{today:yyyyMMdd}";
                }
            }

            return null;
        }

        private static bool IsCommercialEventApplicable(string eventType, OpportunityCommercialBreakdown breakdown)
        {
            return eventType switch
            {
                NotificationEventTypes.AmcRenewal => breakdown.AmcApplicable,
                NotificationEventTypes.AmcExpiry => breakdown.AmcApplicable,
                NotificationEventTypes.SubscriptionBilling => breakdown.SubscriptionApplicable,
                _ => true
            };
        }

        private async Task<Dictionary<Guid, string>> GetUserNamesAsync(List<Guid> userIds, CancellationToken cancellationToken)
        {
            return await _userManager.Users
                .Where(x => userIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.FullName, cancellationToken);
        }

        private static string ApplyTemplate(string template, NotificationCandidate candidate)
        {
            var values = new Dictionary<string, string>
            {
                ["CustomerName"] = candidate.CustomerName,
                ["OpportunityNumber"] = candidate.OpportunityNumber,
                ["AgreementNumber"] = candidate.OpportunityNumber,
                ["LeadNumber"] = candidate.LeadNumber,
                ["Amount"] = candidate.Amount?.ToString("0.##") ?? string.Empty,
                ["DueDate"] = candidate.SourceDueDate.ToString("yyyy-MM-dd"),
                ["ExpiryDate"] = candidate.SourceDueDate.ToString("yyyy-MM-dd"),
                ["FollowUpDate"] = candidate.SourceDueDate.ToString("yyyy-MM-dd"),
                ["DealOwner"] = candidate.DealOwner,
                ["Notes"] = candidate.Notes
            };

            var output = template;
            foreach (var item in values)
            {
                output = output.Replace("{" + item.Key + "}", item.Value, StringComparison.OrdinalIgnoreCase);
            }

            return output;
        }

        private static DateTime ToBusinessDate(DateTime value, TimeZoneInfo timeZone)
        {
            DateTime date;
            if (value.Kind == DateTimeKind.Utc)
            {
                date = TimeZoneInfo.ConvertTimeFromUtc(value, timeZone).Date;
            }
            else
            {
                date = value.Date;
            }

            return DateTime.SpecifyKind(date, DateTimeKind.Utc);
        }

        private TimeZoneInfo ResolveBusinessTimeZone(string configuredTimeZone)
        {
            foreach (var candidate in new[] { configuredTimeZone, "Nepal Standard Time", "Asia/Kathmandu" })
            {
                if (string.IsNullOrWhiteSpace(candidate))
                {
                    continue;
                }

                try
                {
                    return TimeZoneInfo.FindSystemTimeZoneById(candidate);
                }
                catch (TimeZoneNotFoundException)
                {
                    _logger.LogDebug("Business timezone {TimeZone} was not found.", candidate);
                }
                catch (InvalidTimeZoneException)
                {
                    _logger.LogDebug("Business timezone {TimeZone} is invalid.", candidate);
                }
            }

            return TimeZoneInfo.Utc;
        }

        private sealed class NotificationCandidate
        {
            public string EventType { get; set; } = string.Empty;
            public string SourceRecordType { get; set; } = string.Empty;
            public Guid SourceRecordId { get; set; }
            public DateTime SourceDueDate { get; set; }
            public Guid RecipientUserId { get; set; }
            public string CustomerName { get; set; } = string.Empty;
            public string OpportunityNumber { get; set; } = string.Empty;
            public string LeadNumber { get; set; } = string.Empty;
            public decimal? Amount { get; set; }
            public string DealOwner { get; set; } = string.Empty;
            public string Notes { get; set; } = string.Empty;
            public string? RelatedUrl { get; set; }
        }
    }

    public class EmailSender : IEmailSender
    {
        private readonly IOptions<SmtpOptions> _options;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(IOptions<SmtpOptions> options, ILogger<EmailSender> logger)
        {
            _options = options;
            _logger = logger;
        }

        public async Task<EmailSendResult> SendAsync(string recipientEmail, string subject, string body, CancellationToken cancellationToken)
        {
            var options = _options.Value;
            var providerName = string.IsNullOrWhiteSpace(options.ProviderName) ? "SMTP" : options.ProviderName.Trim();
            if (!options.Enabled)
            {
                return EmailSendResult.Failure($"{providerName} sending is disabled.");
            }

            if (string.IsNullOrWhiteSpace(options.Host) || string.IsNullOrWhiteSpace(options.FromEmail))
            {
                return EmailSendResult.Failure($"{providerName} host and from email must be configured.");
            }

            if (options.Port <= 0 || options.Port > 65535)
            {
                return EmailSendResult.Failure($"{providerName} port must be between 1 and 65535.");
            }

            if (options.RequiresAuthentication
                && (string.IsNullOrWhiteSpace(options.UserName) || string.IsNullOrWhiteSpace(options.Password)))
            {
                return EmailSendResult.Failure($"{providerName} username and password must be configured when authentication is required.");
            }

            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(options.FromName, options.FromEmail));
                message.To.Add(MailboxAddress.Parse(recipientEmail));
                message.Subject = subject;
                message.Body = new TextPart("plain") { Text = body };

                using var client = new SmtpClient();
                var securityMode = ResolveSecurityMode(options);
                await client.ConnectAsync(options.Host, options.Port, securityMode, cancellationToken);

                if (options.RequiresAuthentication)
                {
                    await client.AuthenticateAsync(options.UserName, options.Password, cancellationToken);
                }

                await client.SendAsync(message, cancellationToken);
                await client.DisconnectAsync(true, cancellationToken);

                return EmailSendResult.Success();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send notification email to {RecipientEmail} using {ProviderName}.", recipientEmail, providerName);
                return EmailSendResult.Failure(ex.Message);
            }
        }

        private static SecureSocketOptions ResolveSecurityMode(SmtpOptions options)
        {
            if (string.IsNullOrWhiteSpace(options.SecurityMode))
            {
                return options.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;
            }

            return options.SecurityMode.Trim().ToLowerInvariant() switch
            {
                "auto" => SecureSocketOptions.Auto,
                "none" => SecureSocketOptions.None,
                "starttls" => SecureSocketOptions.StartTls,
                "starttlswhenavailable" => SecureSocketOptions.StartTlsWhenAvailable,
                "sslonconnect" => SecureSocketOptions.SslOnConnect,
                "ssl" => SecureSocketOptions.SslOnConnect,
                "tls" => SecureSocketOptions.SslOnConnect,
                _ => throw new InvalidOperationException($"Unsupported SMTP security mode '{options.SecurityMode}'.")
            };
        }
    }
}
