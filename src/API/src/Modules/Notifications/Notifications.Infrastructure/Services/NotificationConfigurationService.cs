using ERP.Identity.Constants;
using ERP.Identity.Services.Interfaces;
using Leads.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Notifications.Application.DTOs;
using Notifications.Application.Interfaces;
using Notifications.Application.ViewModels;
using Notifications.Domain.Constants;
using Notifications.Domain.Entities;
using Notifications.Infrastructure.Options;
using Notifications.Infrastructure.Persistence.Data;
using Opportunities.Infrastructure.Persistence.Data;

namespace Notifications.Infrastructure.Services
{
    public class NotificationConfigurationService : INotificationConfigurationService
    {
        private static readonly Dictionary<string, (string DisplayName, string Description, List<string> MergeFields)> EventMetadata = new(StringComparer.OrdinalIgnoreCase)
        {
            [NotificationEventTypes.AgreementExpiry] = ("Agreement Expiry", "Agreement expiry reminders for won opportunities.", ["CustomerName", "OpportunityNumber", "AgreementNumber", "DueDate", "DealOwner"]),
            [NotificationEventTypes.AmcRenewal] = ("AMC Renewal", "AMC renewal reminders for won opportunities.", ["CustomerName", "OpportunityNumber", "Amount", "DueDate", "DealOwner"]),
            [NotificationEventTypes.AmcExpiry] = ("AMC Expiry", "AMC expiry reminders for won opportunities.", ["CustomerName", "OpportunityNumber", "Amount", "DueDate", "DealOwner"]),
            [NotificationEventTypes.SubscriptionBilling] = ("Subscription Billing", "Subscription billing reminders for won opportunities.", ["CustomerName", "OpportunityNumber", "Amount", "DueDate", "DealOwner"]),
            [NotificationEventTypes.LeadFollowUp] = ("Lead Follow-up", "Lead activity follow-up reminders.", ["CustomerName", "LeadNumber", "FollowUpDate", "DueDate", "Notes", "DealOwner"]),
            [NotificationEventTypes.OpportunityFollowUp] = ("Opportunity Follow-up", "Opportunity activity follow-up reminders.", ["CustomerName", "OpportunityNumber", "FollowUpDate", "DueDate", "Notes", "DealOwner"])
        };

        private readonly NotificationsDbContext _notificationsDbContext;
        private readonly OpportunitiesDbContext _opportunitiesDbContext;
        private readonly LeadsDbContext _leadsDbContext;
        private readonly IUserContextService _userContextService;
        private readonly INotificationProcessorStatusStore _processorStatusStore;
        private readonly IOptions<NotificationProcessorOptions> _processorOptions;

        public NotificationConfigurationService(
            NotificationsDbContext notificationsDbContext,
            OpportunitiesDbContext opportunitiesDbContext,
            LeadsDbContext leadsDbContext,
            IUserContextService userContextService,
            INotificationProcessorStatusStore processorStatusStore,
            IOptions<NotificationProcessorOptions> processorOptions)
        {
            _notificationsDbContext = notificationsDbContext;
            _opportunitiesDbContext = opportunitiesDbContext;
            _leadsDbContext = leadsDbContext;
            _userContextService = userContextService;
            _processorStatusStore = processorStatusStore;
            _processorOptions = processorOptions;
        }

        public async Task<IReadOnlyList<NotificationConfigurationViewModel>> GetConfigurationsAsync(CancellationToken cancellationToken)
        {
            await EnsureConfigurationsAsync(cancellationToken);

            var configurations = await _notificationsDbContext.NotificationConfigurations
                .Include(x => x.ReminderIntervals)
                .Where(x => x.IsActive)
                .OrderBy(x => x.DisplayName)
                .ToListAsync(cancellationToken);

            return configurations.Select(ToViewModel).ToList();
        }

        public Task<IReadOnlyList<NotificationEventTypeViewModel>> GetEventTypesAsync(CancellationToken cancellationToken)
        {
            IReadOnlyList<NotificationEventTypeViewModel> eventTypes = NotificationEventTypes.All
                .Select(eventType =>
                {
                    var metadata = EventMetadata[eventType];
                    return new NotificationEventTypeViewModel
                    {
                        EventType = eventType,
                        DisplayName = metadata.DisplayName,
                        Description = metadata.Description,
                        MergeFields = metadata.MergeFields
                    };
                })
                .ToList();

            return Task.FromResult(eventTypes);
        }

        public Task<NotificationProcessorStatusViewModel> GetProcessorStatusAsync(CancellationToken cancellationToken)
        {
            var status = _processorStatusStore.GetStatus();
            status.ProcessorEnabled = _processorOptions.Value.Enabled;
            status.ProcessorIntervalMinutes = Math.Max(5, _processorOptions.Value.ProcessorIntervalMinutes);
            return Task.FromResult(status);
        }

        public async Task<NotificationConfigurationViewModel> UpdateConfigurationAsync(string eventType, NotificationConfigurationRequest request, CancellationToken cancellationToken)
        {
            if (!NotificationEventTypes.All.Contains(eventType, StringComparer.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Invalid notification event type.");
            }

            ValidateRequest(request);
            await EnsureConfigurationsAsync(cancellationToken);

            var configuration = await _notificationsDbContext.NotificationConfigurations
                .Include(x => x.ReminderIntervals)
                .FirstAsync(x => x.EventType == eventType && x.IsActive, cancellationToken);

            configuration.IsEnabled = request.IsEnabled;
            configuration.InitialLeadTimeDays = request.InitialLeadTimeDays;
            configuration.OverdueIntervalDays = request.OverdueIntervalDays;
            configuration.InAppEnabled = request.InAppEnabled;
            configuration.EmailEnabled = request.EmailEnabled;
            configuration.SubjectTemplate = request.SubjectTemplate.Trim();
            configuration.BodyTemplate = request.BodyTemplate.Trim();

            var requestedIntervals = request.ReminderIntervals
                .Where(x => x >= 0 && x <= request.InitialLeadTimeDays)
                .Distinct()
                .OrderByDescending(x => x)
                .ToList();

            var removedIntervals = configuration.ReminderIntervals
                .Where(interval => !requestedIntervals.Contains(interval.DaysBeforeDue))
                .ToList();

            _notificationsDbContext.NotificationReminderIntervals.RemoveRange(removedIntervals);

            foreach (var daysBeforeDue in requestedIntervals)
            {
                if (configuration.ReminderIntervals.Any(interval => interval.DaysBeforeDue == daysBeforeDue))
                {
                    continue;
                }

                configuration.ReminderIntervals.Add(new NotificationReminderInterval
                {
                    DaysBeforeDue = daysBeforeDue
                });
            }

            await _notificationsDbContext.SaveChangesAsync(cancellationToken);
            return ToViewModel(configuration);
        }

        public async Task<IReadOnlyList<InAppNotificationViewModel>> GetMyNotificationsAsync(CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (!userId.HasValue)
            {
                return [];
            }

            return await _notificationsDbContext.InAppNotifications
                .Where(x => x.IsActive && x.RecipientUserId == userId.Value)
                .OrderByDescending(x => x.CreatedOn)
                .Take(100)
                .Select(x => new InAppNotificationViewModel
                {
                    Id = x.Id,
                    Title = x.Title,
                    Message = x.Message,
                    EventType = x.EventType,
                    SourceRecordType = x.SourceRecordType,
                    SourceRecordId = x.SourceRecordId,
                    SourceDueDate = x.SourceDueDate,
                    RelatedUrl = x.RelatedUrl,
                    IsRead = x.IsRead,
                    CreatedOn = x.CreatedOn
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<NotificationOperationResult> MarkAsReadAsync(Guid notificationId, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (!userId.HasValue)
            {
                return NotificationOperationResult.Failure("User context is unavailable.");
            }

            var notification = await _notificationsDbContext.InAppNotifications
                .FirstOrDefaultAsync(x => x.Id == notificationId && x.RecipientUserId == userId.Value && x.IsActive, cancellationToken);

            if (notification == null)
            {
                return NotificationOperationResult.Failure("Notification was not found.");
            }

            notification.IsRead = true;
            notification.ReadOn = DateTime.UtcNow;
            await _notificationsDbContext.SaveChangesAsync(cancellationToken);

            return NotificationOperationResult.Success("Notification marked as read.");
        }

        public async Task<NotificationOperationResult> MarkAllAsReadAsync(CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (!userId.HasValue)
            {
                return NotificationOperationResult.Failure("User context is unavailable.");
            }

            var notifications = await _notificationsDbContext.InAppNotifications
                .Where(x => x.IsActive && x.RecipientUserId == userId.Value && !x.IsRead)
                .ToListAsync(cancellationToken);

            if (!notifications.Any())
            {
                return NotificationOperationResult.Success("No unread notifications.");
            }

            var readOn = DateTime.UtcNow;
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
                notification.ReadOn = readOn;
            }

            await _notificationsDbContext.SaveChangesAsync(cancellationToken);
            return NotificationOperationResult.Success("All notifications marked as read.");
        }

        public async Task<NotificationOperationResult> ResolveEventAsync(ResolveNotificationEventRequest request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (!userId.HasValue)
            {
                return NotificationOperationResult.Failure("User context is unavailable.");
            }

            if (!NotificationEventTypes.All.Contains(request.EventType, StringComparer.OrdinalIgnoreCase))
            {
                return NotificationOperationResult.Failure("Invalid notification event type.");
            }

            var ownerUserId = await GetSourceOwnerAsync(request.SourceRecordType, request.SourceRecordId, cancellationToken);
            if (!ownerUserId.HasValue)
            {
                return NotificationOperationResult.Failure("Source record was not found.");
            }

            if (!CanResolve(userId.Value, ownerUserId.Value))
            {
                return NotificationOperationResult.Failure("You are not allowed to resolve this notification event.");
            }

            var dueDate = DateTime.SpecifyKind(request.SourceDueDate.Date, DateTimeKind.Utc);
            var resolution = await _notificationsDbContext.NotificationResolutions.FirstOrDefaultAsync(
                x => x.EventType == request.EventType
                    && x.SourceRecordType == request.SourceRecordType
                    && x.SourceRecordId == request.SourceRecordId
                    && x.SourceDueDate == dueDate,
                cancellationToken);

            if (resolution == null)
            {
                resolution = new NotificationResolution
                {
                    EventType = request.EventType,
                    SourceRecordType = request.SourceRecordType,
                    SourceRecordId = request.SourceRecordId,
                    SourceDueDate = dueDate
                };
                _notificationsDbContext.NotificationResolutions.Add(resolution);
            }

            resolution.IsResolved = true;
            resolution.ResolvedOn = DateTime.UtcNow;
            resolution.ResolvedByUserId = userId.Value;
            resolution.ResolutionRemarks = request.ResolutionRemarks;

            await _notificationsDbContext.SaveChangesAsync(cancellationToken);
            return NotificationOperationResult.Success("Notification event resolved.");
        }

        private async Task EnsureConfigurationsAsync(CancellationToken cancellationToken)
        {
            var existingEventTypes = await _notificationsDbContext.NotificationConfigurations
                .Select(x => x.EventType)
                .ToListAsync(cancellationToken);

            foreach (var eventType in NotificationEventTypes.All)
            {
                if (existingEventTypes.Contains(eventType, StringComparer.OrdinalIgnoreCase))
                {
                    continue;
                }

                var metadata = EventMetadata[eventType];
                _notificationsDbContext.NotificationConfigurations.Add(new NotificationConfiguration
                {
                    EventType = eventType,
                    DisplayName = metadata.DisplayName,
                    IsEnabled = false,
                    InitialLeadTimeDays = 90,
                    OverdueIntervalDays = 7,
                    InAppEnabled = true,
                    EmailEnabled = false,
                    SubjectTemplate = $"{metadata.DisplayName} reminder for {{CustomerName}}",
                    BodyTemplate = $"{metadata.DisplayName} reminder for {{CustomerName}} is due on {{DueDate}}.",
                    ReminderIntervals = new List<NotificationReminderInterval>
                    {
                        new() { DaysBeforeDue = 90 },
                        new() { DaysBeforeDue = 60 },
                        new() { DaysBeforeDue = 30 },
                        new() { DaysBeforeDue = 7 }
                    }
                });
            }

            await _notificationsDbContext.SaveChangesAsync(cancellationToken);
        }

        private async Task<Guid?> GetSourceOwnerAsync(string sourceRecordType, Guid sourceRecordId, CancellationToken cancellationToken)
        {
            if (sourceRecordType == NotificationSourceRecordTypes.OpportunityCommercialBreakdown)
            {
                return await _opportunitiesDbContext.OpportunityCommercialBreakdowns
                    .Where(x => x.Id == sourceRecordId && x.Opportunity != null)
                    .Select(x => (Guid?)x.Opportunity!.OwnerUserId)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            if (sourceRecordType == NotificationSourceRecordTypes.OpportunityActivity)
            {
                return await _opportunitiesDbContext.OpportunityActivities
                    .Where(x => x.Id == sourceRecordId && x.Opportunity != null)
                    .Select(x => (Guid?)x.Opportunity!.OwnerUserId)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            if (sourceRecordType == NotificationSourceRecordTypes.LeadInteraction)
            {
                return await _leadsDbContext.LeadInteractions
                    .Where(x => x.Id == sourceRecordId && x.Lead != null)
                    .Select(x => x.Lead!.AssignedToUserId)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            return null;
        }

        private bool CanResolve(Guid userId, Guid ownerUserId)
        {
            if (userId == ownerUserId)
            {
                return true;
            }

            var roles = _userContextService.GetUserRoles();
            return roles.Contains(DefaultRoles.SuperAdmin, StringComparer.OrdinalIgnoreCase)
                || roles.Contains(DefaultRoles.Admin, StringComparer.OrdinalIgnoreCase)
                || roles.Contains(DefaultRoles.Manager, StringComparer.OrdinalIgnoreCase);
        }

        private static NotificationConfigurationViewModel ToViewModel(NotificationConfiguration configuration)
        {
            return new NotificationConfigurationViewModel
            {
                Id = configuration.Id,
                EventType = configuration.EventType,
                DisplayName = configuration.DisplayName,
                IsEnabled = configuration.IsEnabled,
                InitialLeadTimeDays = configuration.InitialLeadTimeDays,
                OverdueIntervalDays = configuration.OverdueIntervalDays,
                InAppEnabled = configuration.InAppEnabled,
                EmailEnabled = configuration.EmailEnabled,
                SubjectTemplate = configuration.SubjectTemplate,
                BodyTemplate = configuration.BodyTemplate,
                ReminderIntervals = configuration.ReminderIntervals
                    .Select(x => x.DaysBeforeDue)
                    .OrderByDescending(x => x)
                    .ToList()
            };
        }

        private static void ValidateRequest(NotificationConfigurationRequest request)
        {
            if (request.InitialLeadTimeDays < 0)
            {
                throw new InvalidOperationException("Initial lead time cannot be negative.");
            }

            if (request.OverdueIntervalDays < 0)
            {
                throw new InvalidOperationException("Overdue reminder interval cannot be negative.");
            }

            if (!request.InAppEnabled && !request.EmailEnabled)
            {
                throw new InvalidOperationException("At least one notification channel must be enabled.");
            }

            if (string.IsNullOrWhiteSpace(request.SubjectTemplate))
            {
                throw new InvalidOperationException("Subject template is required.");
            }

            if (string.IsNullOrWhiteSpace(request.BodyTemplate))
            {
                throw new InvalidOperationException("Body template is required.");
            }
        }
    }
}
