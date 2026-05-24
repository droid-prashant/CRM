using ERP.Identity.Entities;
using Leads.Application.DTOs;
using Leads.Application.Interfaces;
using Leads.Application.Repositories;
using Leads.Application.ViewModels;
using Leads.Domain.Entities;
using Leads.Domain.Enums;
using Leads.Infrastructure.Persistence.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Opportunities.Domain.Entities;
using Partners.Application.Services;
using System.Text.RegularExpressions;

namespace Leads.Infrastructure.Repositories
{
    public class LeadRepository : ILeadRepository
    {
        private readonly LeadsDbContext _dbContext;
        private readonly IPartnerLookupService _partnerLookupService;
        private readonly UserManager<ApplicationUser> _userManager;

        public LeadRepository(LeadsDbContext dbContext, IPartnerLookupService partnerLookupService, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _partnerLookupService = partnerLookupService;
            _userManager = userManager;
        }

        public async Task<List<LeadListItemViewModel>> GetLeadListAsync(CancellationToken cancellationToken)
        {
            var leads = await _dbContext.Leads
                .AsNoTracking()
                .Include(x => x.Source)
                .Include(x => x.Category)
                .Include(x => x.Country)
                .Include(x => x.ProductInterests).ThenInclude(x => x.Product)
                .Where(x => x.IsActive)
                .OrderByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            var partnerNames = (await _partnerLookupService.GetActivePartnersAsync(cancellationToken))
                .ToDictionary(x => x.Id, x => x.Name);

            return leads.Select(x => new LeadListItemViewModel
            {
                Id = x.Id,
                LeadNumber = x.LeadNumber,
                SourceId = x.SourceId,
                CategoryId = x.CategoryId,
                PartnerId = x.PartnerId,
                PartnerName = x.PartnerId.HasValue ? partnerNames.GetValueOrDefault(x.PartnerId.Value) : null,
                CampaignName = x.CampaignName,
                SourceStartDate = x.SourceStartDate,
                SourceEndDate = x.SourceEndDate,
                CompanyName = x.CompanyName,
                Website = x.Website,
                ContactPersonName = x.ContactPersonName,
                JobTitle = x.JobTitle,
                Email = x.Email,
                Phone = x.Phone,
                AlternatePhone = x.AlternatePhone,
                CountryId = x.CountryId,
                Address = x.Address,
                IndustryId = x.IndustryId,
                Notes = x.Notes,
                LeadScore = x.LeadScore,
                ProductIds = x.ProductInterests.Where(p => p.IsActive).Select(p => p.ProductId).ToList(),
                SourceName = x.Source?.Name ?? string.Empty,
                CategoryName = x.Category?.Name ?? string.Empty,
                CountryName = x.Country?.Name ?? string.Empty,
                Status = x.Status.ToString(),
                ProductNames = string.Join(", ", x.ProductInterests.Where(p => p.IsActive).Select(p => p.Product?.Name).Where(p => !string.IsNullOrWhiteSpace(p))),
                CreatedAt = x.CreatedOn
            }).ToList();
        }

        public async Task<LeadDetailViewModel?> GetLeadDetailAsync(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .AsNoTracking()
                .Include(x => x.Source)
                .Include(x => x.Category)
                .Include(x => x.Country)
                .Include(x => x.Industry)
                .Include(x => x.ProductInterests).ThenInclude(x => x.Product)
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null)
            {
                return null;
            }

            var detail = MapDetail(lead, false);
            if (lead.PartnerId.HasValue)
            {
                detail.PartnerName = await _partnerLookupService.GetPartnerNameAsync(lead.PartnerId.Value, cancellationToken);
            }

            await PopulateAssignedUserNameAsync(detail);
            return detail;
        }

        public async Task<LeadEditViewModel?> GetLeadEditAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _dbContext.Leads
                .AsNoTracking()
                .Where(x => x.Id == id && x.IsActive)
                .Select(x => new LeadEditViewModel
                {
                    Id = x.Id,
                    SourceId = x.SourceId,
                    CategoryId = x.CategoryId,
                    PartnerId = x.PartnerId,
                    CampaignName = x.CampaignName,
                    SourceStartDate = x.SourceStartDate,
                    SourceEndDate = x.SourceEndDate,
                    CompanyName = x.CompanyName,
                    Website = x.Website,
                    ContactPersonName = x.ContactPersonName,
                    JobTitle = x.JobTitle,
                    Email = x.Email,
                    Phone = x.Phone,
                    AlternatePhone = x.AlternatePhone,
                    CountryId = x.CountryId,
                    Address = x.Address,
                    IndustryId = x.IndustryId,
                    Notes = x.Notes,
                    LeadScore = x.LeadScore,
                    SelectedProductIds = x.ProductInterests.Where(p => p.IsActive).Select(p => p.ProductId).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<List<LeadLookupViewModel>> GetLeadLookupsAsync(CancellationToken cancellationToken)
        {
            return _dbContext.Leads
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.CompanyName)
                .Select(x => new LeadLookupViewModel
                {
                    Id = x.Id,
                    LeadNumber = x.LeadNumber,
                    CompanyName = x.CompanyName,
                    ContactPersonName = x.ContactPersonName,
                    Status = x.Status.ToString()
                })
                .ToListAsync(cancellationToken);
        }

        public Task<List<LookupViewModel>> GetLeadSourceLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.LeadSources, cancellationToken);
        public Task<List<LookupViewModel>> GetLeadCategoryLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.LeadCategories, cancellationToken);
        public Task<List<LookupViewModel>> GetProductLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.Products, cancellationToken);
        public Task<List<LookupViewModel>> GetCountryLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.Countries, cancellationToken);
        public Task<List<LookupViewModel>> GetIndustryLookupsAsync(CancellationToken cancellationToken) => GetLookupsAsync(_dbContext.Industries, cancellationToken);

        public Task<bool> SourceRequiresPartnerAsync(Guid sourceId, CancellationToken cancellationToken)
        {
            return _dbContext.LeadSources.AnyAsync(x => x.Id == sourceId && x.IsActive && x.RequiresPartner, cancellationToken);
        }

        public Task<string?> GetLeadSourceCodeAsync(Guid sourceId, CancellationToken cancellationToken)
        {
            return _dbContext.LeadSources
                .AsNoTracking()
                .Where(x => x.Id == sourceId && x.IsActive)
                .Select(x => x.Code)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<bool> LeadExistsAsync(Guid id, CancellationToken cancellationToken) => _dbContext.Leads.AnyAsync(x => x.Id == id && x.IsActive, cancellationToken);
        public Task<LeadStatus?> GetLeadStatusAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.Leads
                .AsNoTracking()
                .Where(x => x.Id == id && x.IsActive)
                .Select(x => (LeadStatus?)x.Status)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<bool> SourceExistsAsync(Guid sourceId, CancellationToken cancellationToken) => _dbContext.LeadSources.AnyAsync(x => x.Id == sourceId && x.IsActive, cancellationToken);
        public Task<bool> CategoryExistsAsync(Guid categoryId, CancellationToken cancellationToken) => _dbContext.LeadCategories.AnyAsync(x => x.Id == categoryId && x.IsActive, cancellationToken);
        public Task<bool> CountryExistsAsync(Guid countryId, CancellationToken cancellationToken) => _dbContext.Countries.AnyAsync(x => x.Id == countryId && x.IsActive, cancellationToken);
        public Task<bool> IndustryExistsAsync(Guid industryId, CancellationToken cancellationToken) => _dbContext.Industries.AnyAsync(x => x.Id == industryId && x.IsActive, cancellationToken);

        public Task<List<Guid>> GetActiveProductIdsAsync(IEnumerable<Guid> productIds, CancellationToken cancellationToken)
        {
            var ids = productIds.ToList();
            return _dbContext.Products.Where(x => ids.Contains(x.Id) && x.IsActive).Select(x => x.Id).ToListAsync(cancellationToken);
        }

        public Task<bool> DuplicateCompanyEmailExistsAsync(string companyName, string email, CancellationToken cancellationToken)
        {
            var normalizedCompany = companyName.Trim().ToLower();
            var normalizedEmail = email.Trim().ToLower();

            return _dbContext.Leads.AnyAsync(
                x => x.IsActive
                    && x.CompanyName.ToLower() == normalizedCompany
                    && x.Email != null
                    && x.Email.ToLower() == normalizedEmail,
                cancellationToken);
        }

        public async Task<string> GenerateNextLeadNumberAsync(CancellationToken cancellationToken)
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"LD-{year}-";
            var count = await _dbContext.Leads.CountAsync(x => x.LeadNumber.StartsWith(prefix), cancellationToken);
            return $"{prefix}{count + 1:000000}";
        }

        public async Task<LeadDetailViewModel> CreateLeadAsync(CreateLeadRequest request, string leadNumber, bool hasDuplicateWarning, CancellationToken cancellationToken)
        {
            var lead = new Lead
            {
                LeadNumber = leadNumber,
                SourceId = request.SourceId,
                CategoryId = request.CategoryId,
                PartnerId = request.PartnerId,
                CampaignName = Clean(request.CampaignName),
                SourceStartDate = request.SourceStartDate?.ToUniversalTime(),
                SourceEndDate = request.SourceEndDate?.ToUniversalTime(),
                CompanyName = request.CompanyName.Trim(),
                Website = Clean(request.Website),
                ContactPersonName = request.ContactPersonName.Trim(),
                JobTitle = Clean(request.JobTitle),
                Email = Clean(request.Email),
                Phone = Clean(request.Phone),
                AlternatePhone = Clean(request.AlternatePhone),
                CountryId = request.CountryId,
                Address = Clean(request.Address),
                IndustryId = request.IndustryId,
                Notes = Clean(request.Notes),
                LeadScore = request.LeadScore,
                Status = LeadStatus.New,
                ProductInterests = request.ProductIds.Select(productId => new LeadProductInterest
                {
                    ProductId = productId
                }).ToList(),
                TimelineEntries = new List<LeadTimelineEntry>
                {
                    new()
                    {
                        EventType = "LeadCreated",
                        Description = "Lead was created."
                    }
                }
            };

            _dbContext.Leads.Add(lead);
            await _dbContext.SaveChangesAsync(cancellationToken);

            var detail = await GetLeadDetailAsync(lead.Id, cancellationToken);
            detail!.HasDuplicateWarning = hasDuplicateWarning;
            detail.DuplicateWarning = hasDuplicateWarning ? "A lead with the same company and email already exists." : null;
            return detail;
        }

        public async Task<LeadDetailViewModel?> UpdateLeadAsync(Guid id, UpdateLeadRequest request, CancellationToken cancellationToken)
        {
            await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

            var lead = await _dbContext.Leads
                .Include(x => x.ProductInterests)
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null || lead.Status == LeadStatus.Converted)
            {
                return null;
            }

            var previousStatus = lead.Status;
            lead.SourceId = request.SourceId;
            lead.CategoryId = request.CategoryId;
            lead.PartnerId = request.PartnerId;
            lead.CampaignName = Clean(request.CampaignName);
            lead.SourceStartDate = request.SourceStartDate?.ToUniversalTime();
            lead.SourceEndDate = request.SourceEndDate?.ToUniversalTime();
            lead.CompanyName = request.CompanyName.Trim();
            lead.Website = Clean(request.Website);
            lead.ContactPersonName = request.ContactPersonName.Trim();
            lead.JobTitle = Clean(request.JobTitle);
            lead.Email = Clean(request.Email);
            lead.Phone = Clean(request.Phone);
            lead.AlternatePhone = Clean(request.AlternatePhone);
            lead.CountryId = request.CountryId;
            lead.Address = Clean(request.Address);
            lead.IndustryId = request.IndustryId;
            lead.Notes = Clean(request.Notes);
            lead.LeadScore = request.LeadScore;

            UpdateProductInterests(lead, request.ProductIds);
            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadUpdated",
                Description = "Lead details were updated."
            });

            if (previousStatus == LeadStatus.Disqualified)
            {
                ResetDisqualifiedLeadForResubmission(lead);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return await GetLeadDetailAsync(id, cancellationToken);
        }

        public async Task<LeadQualificationViewModel?> GetLeadQualificationAsync(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .AsNoTracking()
                .Include(x => x.ProductInterests).ThenInclude(x => x.Product)
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null)
            {
                return null;
            }

            var assignedToUserName = await GetUserFullNameAsync(lead.AssignedToUserId);
            return MapQualification(lead, assignedToUserName);
        }

        public async Task<LeadQualificationResultViewModel?> UpdateLeadStatusAsync(Guid id, string status, string? disqualificationReason, string? remarks, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null || lead.Status == LeadStatus.Converted)
            {
                return null;
            }

            var previousStatus = lead.Status;
            var newStatus = Enum.Parse<LeadStatus>(status, true);
            lead.Status = newStatus;

            if (newStatus == LeadStatus.Qualified)
            {
                lead.QualificationDate = DateTime.UtcNow;
                lead.DisqualificationReason = null;
            }
            else if (newStatus == LeadStatus.Disqualified)
            {
                lead.DisqualificationReason = Clean(disqualificationReason);
            }

            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadStatusChanged",
                Description = BuildStatusChangeDescription(previousStatus.ToString(), newStatus.ToString(), remarks)
            });

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new LeadQualificationResultViewModel
            {
                LeadId = lead.Id,
                LeadNumber = lead.LeadNumber,
                Status = lead.Status.ToString(),
                QualificationDate = lead.QualificationDate,
                DisqualificationReason = lead.DisqualificationReason,
                ConvertToOpportunityAllowed = lead.Status == LeadStatus.Qualified
            };
        }

        public async Task<List<LeadStatusHistoryItemViewModel>?> GetLeadStatusHistoryAsync(Guid id, CancellationToken cancellationToken)
        {
            var leadExists = await _dbContext.Leads.AsNoTracking().AnyAsync(x => x.Id == id && x.IsActive, cancellationToken);
            if (!leadExists)
            {
                return null;
            }

            var entries = await _dbContext.LeadTimelineEntries
                .AsNoTracking()
                .Where(x => x.LeadId == id && x.IsActive && x.EventType == "LeadStatusChanged")
                .OrderByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            var history = new List<LeadStatusHistoryItemViewModel>();
            foreach (var entry in entries)
            {
                var values = ParseStatusChangeDescription(entry.Description);
                history.Add(new LeadStatusHistoryItemViewModel
                {
                    LeadId = entry.LeadId,
                    PreviousStatus = values.PreviousStatus,
                    NewStatus = values.NewStatus,
                    ChangedAt = entry.CreatedOn,
                    ChangedByUserId = entry.CreatedBy,
                    ChangedByUserName = await GetUserFullNameAsync(entry.CreatedBy),
                    Remarks = values.Remarks
                });
            }

            return history;
        }

        public async Task<LeadConversionViewModel?> GetLeadConversionAsync(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .AsNoTracking()
                .Include(x => x.ProductInterests).ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null)
            {
                return null;
            }

            var existingClients = await GetClientLookupsAsync(cancellationToken);
            var existingContacts = await GetContactLookupsAsync(cancellationToken);
            var selectedClientId = FindMatchingClientId(lead.CompanyName, existingClients);
            var selectedContactId = FindMatchingContactId(lead.ContactPersonName, lead.Email, selectedClientId, existingContacts);

            return new LeadConversionViewModel
            {
                LeadId = lead.Id,
                LeadNumber = lead.LeadNumber,
                CompanyName = lead.CompanyName,
                ContactPersonName = lead.ContactPersonName,
                Email = lead.Email,
                Phone = lead.Phone,
                SelectedClientId = selectedClientId,
                SelectedContactId = selectedContactId,
                ProductInterests = lead.ProductInterests
                    .Where(x => x.IsActive)
                    .Select(x => new LeadProductInterestViewModel
                    {
                        ProductId = x.ProductId,
                        ProductCode = x.Product?.Code ?? string.Empty,
                        ProductName = x.Product?.Name ?? string.Empty,
                        ProductCategoryName = x.Product?.CategoryName
                    }).ToList(),
                ExistingClients = existingClients,
                ExistingContacts = existingContacts,
                Countries = await GetCountryLookupsAsync(cancellationToken),
                Industries = await GetIndustryLookupsAsync(cancellationToken),
                Currencies = GetCurrencyLookups(),
                OwnerUsers = await GetActiveUserLookupsAsync(cancellationToken),
                DefaultOwnerUserId = lead.AssignedToUserId,
                DefaultOwnerUserName = await GetUserFullNameAsync(lead.AssignedToUserId),
                CanConvert = lead.Status == LeadStatus.Qualified && lead.AssignedToUserId.HasValue && !lead.ConvertedOpportunityId.HasValue
            };
        }

        public async Task<OpportunityCreatedViewModel?> ConvertLeadAsync(Guid id, ConvertLeadRequest request, string opportunityNumber, CancellationToken cancellationToken)
        {
            await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

            var lead = await _dbContext.Leads
                .Include(x => x.ProductInterests)
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null || lead.Status != LeadStatus.Qualified || !lead.AssignedToUserId.HasValue || lead.ConvertedOpportunityId.HasValue)
            {
                return null;
            }

            if (!lead.ProductInterests.Any(x => x.IsActive && x.ProductId == request.ProductId))
            {
                return null;
            }

            var client = request.ClientId.HasValue
                ? await _dbContext.Clients.FirstOrDefaultAsync(x => x.Id == request.ClientId.Value && x.IsActive, cancellationToken)
                : CreateClient(request.NewClient!);

            if (client == null)
            {
                return null;
            }

            if (!request.ClientId.HasValue)
            {
                _dbContext.Clients.Add(client);
            }

            var contact = request.ContactId.HasValue
                ? await _dbContext.ClientContacts.FirstOrDefaultAsync(x => x.Id == request.ContactId.Value && x.ClientId == client.Id && x.IsActive, cancellationToken)
                : CreateContact(client, request.NewContact!);

            if (contact == null)
            {
                return null;
            }

            if (!request.ContactId.HasValue)
            {
                _dbContext.ClientContacts.Add(contact);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            var defaultStage = await _dbContext.OpportunityStages
                .Where(x => x.IsActive && !x.IsDeleted)
                .OrderByDescending(x => x.IsDefault)
                .ThenBy(x => x.Sequence)
                .FirstAsync(cancellationToken);

            var opportunity = new Opportunity
            {
                OpportunityNumber = opportunityNumber,
                LeadId = lead.Id,
                ProductId = request.ProductId,
                ClientId = client.Id,
                ContactId = contact.Id,
                Title = request.OpportunityTitle.Trim(),
                EstimatedValue = request.EstimatedValue,
                CurrencyId = request.CurrencyId,
                ExpectedCloseDate = request.ExpectedCloseDate,
                OwnerUserId = lead.AssignedToUserId.Value,
                StageId = defaultStage.Id,
                Stage = defaultStage.Name,
                Status = "Open"
            };

            _dbContext.Opportunities.Add(opportunity);
            await _dbContext.SaveChangesAsync(cancellationToken);

            _dbContext.OpportunityStageHistories.Add(new OpportunityStageHistory
            {
                OpportunityId = opportunity.Id,
                ToStageId = defaultStage.Id,
                Remarks = "Lead converted to opportunity."
            });

            lead.Status = LeadStatus.Converted;
            lead.ConvertedOpportunityId = opportunity.Id;
            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadConverted",
                Description = $"Lead converted to opportunity {opportunityNumber}."
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            var productName = await _dbContext.Products
                .Where(x => x.Id == opportunity.ProductId)
                .Select(x => x.Name)
                .FirstAsync(cancellationToken);

            return new OpportunityCreatedViewModel
            {
                OpportunityId = opportunity.Id,
                OpportunityNumber = opportunity.OpportunityNumber,
                Title = opportunity.Title,
                ClientName = client.Name,
                ProductName = productName,
                EstimatedValue = opportunity.EstimatedValue,
                OwnerUserName = await GetUserFullNameAsync(opportunity.OwnerUserId),
                Stage = opportunity.Stage,
                CreatedAt = opportunity.CreatedOn
            };
        }

        public async Task<LeadAssignmentResultViewModel?> AssignLeadAsync(Guid id, AssignLeadRequest request, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null || lead.Status != LeadStatus.Qualified)
            {
                return null;
            }

            lead.AssignedToUserId = request.AssignedToUserId;
            lead.AssignedAt = DateTime.UtcNow;

            var assigneeName = await GetUserFullNameAsync(request.AssignedToUserId);
            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadAssigned",
                Description = BuildAssignmentDescription(assigneeName, request.Remarks)
            });

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new LeadAssignmentResultViewModel
            {
                LeadId = lead.Id,
                LeadNumber = lead.LeadNumber,
                Status = lead.Status.ToString(),
                AssignedToUserId = request.AssignedToUserId,
                AssignedToUserName = assigneeName,
                AssignedAt = lead.AssignedAt.Value
            };
        }

        public async Task<List<LeadInteractionViewModel>?> GetLeadInteractionsAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await LeadExistsAsync(id, cancellationToken))
            {
                return null;
            }

            var interactions = await _dbContext.LeadInteractions
                .AsNoTracking()
                .Where(x => x.LeadId == id && x.IsActive)
                .OrderByDescending(x => x.InteractionDate)
                .ThenByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            var viewModels = new List<LeadInteractionViewModel>();
            foreach (var interaction in interactions)
            {
                viewModels.Add(await MapInteractionAsync(interaction));
            }

            return viewModels;
        }

        public async Task<LeadInteractionViewModel?> CreateLeadInteractionAsync(Guid id, CreateLeadInteractionRequest request, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null)
            {
                return null;
            }

            var interactionType = Enum.Parse<LeadInteractionType>(request.InteractionType, true);
            var interaction = new LeadInteraction
            {
                LeadId = lead.Id,
                InteractionType = interactionType,
                Subject = Clean(request.Subject),
                Notes = request.Notes.Trim(),
                InteractionDate = request.InteractionDate?.ToUniversalTime() ?? DateTime.UtcNow,
                NextFollowUpDate = request.NextFollowUpDate?.ToUniversalTime()
            };

            _dbContext.LeadInteractions.Add(interaction);
            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadInteraction",
                Description = BuildInteractionDescription(interaction)
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await MapInteractionAsync(interaction);
        }

        public Task<List<ClientLookupViewModel>> GetClientLookupsAsync(CancellationToken cancellationToken)
        {
            return _dbContext.Clients
                .AsNoTracking()
                .Include(x => x.Country)
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .Select(x => new ClientLookupViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Country = x.Country != null ? x.Country.Name : string.Empty
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<List<ContactLookupViewModel>?> GetClientContactsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            var clientExists = await ClientExistsAsync(clientId, cancellationToken);
            if (!clientExists)
            {
                return null;
            }

            return await _dbContext.ClientContacts
                .AsNoTracking()
                .Where(x => x.ClientId == clientId && x.IsActive)
                .OrderBy(x => x.FirstName)
                .ThenBy(x => x.LastName)
                .Select(x => new ContactLookupViewModel
                {
                    Id = x.Id,
                    ClientId = x.ClientId,
                    FullName = (x.FirstName + " " + x.LastName).Trim(),
                    Email = x.Email
                })
                .ToListAsync(cancellationToken);
        }

        public Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.Clients.AnyAsync(x => x.Id == clientId && x.IsActive, cancellationToken);
        }

        public Task<bool> ContactBelongsToClientAsync(Guid contactId, Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.ClientContacts.AnyAsync(x => x.Id == contactId && x.ClientId == clientId && x.IsActive, cancellationToken);
        }

        public async Task<bool> UserExistsAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user?.IsActive == true;
        }

        public async Task<bool> DeleteLeadAsync(Guid id, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .Include(x => x.ProductInterests)
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (lead == null)
            {
                return false;
            }

            lead.IsActive = false;

            foreach (var productInterest in lead.ProductInterests.Where(x => x.IsActive))
            {
                productInterest.IsActive = false;
            }

            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadDeleted",
                Description = "Lead was deleted."
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        private static Task<List<LookupViewModel>> GetLookupsAsync<T>(DbSet<T> dbSet, CancellationToken cancellationToken) where T : ERP.Core.Entities.BaseEntity
        {
            return dbSet
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => EF.Property<string>(x, "Name"))
                .Select(x => new LookupViewModel
                {
                    Id = x.Id,
                    Name = EF.Property<string>(x, "Name"),
                    Code = EF.Property<string>(x, "Code")
                })
                .ToListAsync(cancellationToken);
        }

        private static LeadDetailViewModel MapDetail(Lead lead, bool hasDuplicateWarning)
        {
            return new LeadDetailViewModel
            {
                Id = lead.Id,
                LeadNumber = lead.LeadNumber,
                SourceId = lead.SourceId,
                SourceName = lead.Source?.Name ?? string.Empty,
                CategoryId = lead.CategoryId,
                CategoryName = lead.Category?.Name ?? string.Empty,
                PartnerId = lead.PartnerId,
                CampaignName = lead.CampaignName,
                SourceStartDate = lead.SourceStartDate,
                SourceEndDate = lead.SourceEndDate,
                CompanyName = lead.CompanyName,
                Website = lead.Website,
                ContactPersonName = lead.ContactPersonName,
                JobTitle = lead.JobTitle,
                Email = lead.Email,
                Phone = lead.Phone,
                AlternatePhone = lead.AlternatePhone,
                CountryId = lead.CountryId,
                CountryName = lead.Country?.Name ?? string.Empty,
                Address = lead.Address,
                IndustryId = lead.IndustryId,
                IndustryName = lead.Industry?.Name,
                Notes = lead.Notes,
                LeadScore = lead.LeadScore,
                Status = lead.Status.ToString(),
                AssignedToUserId = lead.AssignedToUserId,
                AssignedAt = lead.AssignedAt,
                QualificationDate = lead.QualificationDate,
                DisqualificationReason = lead.DisqualificationReason,
                ConvertedOpportunityId = lead.ConvertedOpportunityId,
                CreatedAt = lead.CreatedOn,
                CreatedBy = lead.CreatedBy,
                UpdatedAt = lead.UpdatedOn,
                UpdatedBy = lead.UpdatedBy,
                HasDuplicateWarning = hasDuplicateWarning,
                ProductInterests = lead.ProductInterests
                    .Where(x => x.IsActive)
                    .Select(x => new LeadProductInterestViewModel
                    {
                        ProductId = x.ProductId,
                        ProductCode = x.Product?.Code ?? string.Empty,
                        ProductName = x.Product?.Name ?? string.Empty,
                        ProductCategoryName = x.Product?.CategoryName
                    }).ToList(),
                TimelineEntries = lead.TimelineEntries
                    .Where(x => x.IsActive)
                    .OrderByDescending(x => x.CreatedOn)
                    .Select(x => new LeadTimelineEntryViewModel
                    {
                        Id = x.Id,
                        EventType = x.EventType,
                        Description = x.Description,
                        CreatedAt = x.CreatedOn
                    }).ToList()
            };
        }

        private static string? Clean(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private static LeadQualificationViewModel MapQualification(Lead lead, string? assignedToUserName)
        {
            return new LeadQualificationViewModel
            {
                LeadId = lead.Id,
                LeadNumber = lead.LeadNumber,
                CompanyName = lead.CompanyName,
                ContactPersonName = lead.ContactPersonName,
                CurrentStatus = lead.Status.ToString(),
                ProductInterests = lead.ProductInterests
                    .Where(x => x.IsActive)
                    .Select(x => new LeadProductInterestViewModel
                    {
                        ProductId = x.ProductId,
                        ProductCode = x.Product?.Code ?? string.Empty,
                        ProductName = x.Product?.Name ?? string.Empty,
                        ProductCategoryName = x.Product?.CategoryName
                    }).ToList(),
                AssignedToUserId = lead.AssignedToUserId,
                AssignedToUserName = assignedToUserName,
                QualificationDate = lead.QualificationDate,
                DisqualificationReason = lead.DisqualificationReason,
                LastInteractionDate = lead.TimelineEntries.Where(x => x.IsActive).Max(x => (DateTime?)x.CreatedOn),
                ConvertToOpportunityAllowed = lead.Status == LeadStatus.Qualified
            };
        }

        private static string BuildStatusChangeDescription(string previousStatus, string newStatus, string? remarks)
        {
            return $"PreviousStatus={previousStatus};NewStatus={newStatus};Remarks={Clean(remarks) ?? string.Empty}";
        }

        private static void ResetDisqualifiedLeadForResubmission(Lead lead)
        {
            lead.Status = LeadStatus.New;
            lead.QualificationDate = null;
            lead.DisqualificationReason = null;
            lead.AssignedToUserId = null;
            lead.AssignedAt = null;
            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "LeadResubmitted",
                Description = "Lead was resubmitted after editing. Status reset from Disqualified to New."
            });
        }

        private static string BuildAssignmentDescription(string? assigneeName, string? remarks)
        {
            var description = $"Lead assigned to {assigneeName ?? "selected user"}.";
            var cleanRemarks = Clean(remarks);
            return cleanRemarks == null ? description : $"{description} Remarks: {cleanRemarks}";
        }

        private static string BuildInteractionDescription(LeadInteraction interaction)
        {
            var subject = Clean(interaction.Subject) ?? "No subject";
            var followUp = interaction.NextFollowUpDate.HasValue
                ? $" Next follow-up: {interaction.NextFollowUpDate.Value:yyyy-MM-dd}."
                : string.Empty;

            return $"{interaction.InteractionType} logged: {subject}.{followUp}";
        }

        private static Client CreateClient(NewClientRequest request)
        {
            return new Client
            {
                Name = request.Name.Trim(),
                CountryId = request.CountryId,
                IndustryId = request.IndustryId
            };
        }

        private static ClientContact CreateContact(Client client, NewContactRequest request)
        {
            return new ClientContact
            {
                Client = client,
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = Clean(request.Email),
                Phone = Clean(request.Phone)
            };
        }

        private static Guid? FindMatchingClientId(string companyName, IEnumerable<ClientLookupViewModel> clients)
        {
            var normalizedCompanyName = Normalize(companyName);
            if (string.IsNullOrWhiteSpace(normalizedCompanyName))
            {
                return null;
            }

            return clients.FirstOrDefault(client => Normalize(client.Name) == normalizedCompanyName)?.Id;
        }

        private static Guid? FindMatchingContactId(string contactPersonName, string? email, Guid? clientId, IEnumerable<ContactLookupViewModel> contacts)
        {
            var candidates = clientId.HasValue ? contacts.Where(contact => contact.ClientId == clientId.Value) : contacts;
            var normalizedEmail = Normalize(email);
            if (!string.IsNullOrWhiteSpace(normalizedEmail))
            {
                var contactByEmail = candidates.FirstOrDefault(contact => Normalize(contact.Email) == normalizedEmail);
                if (contactByEmail != null)
                {
                    return contactByEmail.Id;
                }
            }

            var normalizedName = Normalize(contactPersonName);
            if (string.IsNullOrWhiteSpace(normalizedName))
            {
                return null;
            }

            return candidates.FirstOrDefault(contact => Normalize(contact.FullName) == normalizedName)?.Id;
        }

        private static string Normalize(string? value)
        {
            return Regex.Replace(value?.Trim().ToUpperInvariant() ?? string.Empty, @"[\W_]+", string.Empty);
        }

        private static void UpdateProductInterests(Lead lead, List<Guid> productIds)
        {
            var selectedIds = productIds.Distinct().ToHashSet();

            foreach (var existingInterest in lead.ProductInterests)
            {
                existingInterest.IsActive = selectedIds.Contains(existingInterest.ProductId);
            }

            var existingIds = lead.ProductInterests.Select(x => x.ProductId).ToHashSet();
            foreach (var newProductId in selectedIds.Except(existingIds))
            {
                lead.ProductInterests.Add(new LeadProductInterest
                {
                    ProductId = newProductId
                });
            }
        }

        private Task<List<ContactLookupViewModel>> GetContactLookupsAsync(CancellationToken cancellationToken)
        {
            return _dbContext.ClientContacts
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.FirstName)
                .ThenBy(x => x.LastName)
                .Select(x => new ContactLookupViewModel
                {
                    Id = x.Id,
                    ClientId = x.ClientId,
                    FullName = (x.FirstName + " " + x.LastName).Trim(),
                    Email = x.Email
                })
                .ToListAsync(cancellationToken);
        }

        private static List<CurrencyLookupViewModel> GetCurrencyLookups()
        {
            return new List<CurrencyLookupViewModel>
            {
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000001"), Code = "NPR", Name = "Nepalese Rupee" },
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000002"), Code = "USD", Name = "US Dollar" },
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000003"), Code = "INR", Name = "Indian Rupee" }
            };
        }

        private Task<List<LeadUserLookupViewModel>> GetActiveUserLookupsAsync(CancellationToken cancellationToken)
        {
            return _userManager.Users
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.FullName)
                .Select(x => new LeadUserLookupViewModel
                {
                    Id = x.Id,
                    FullName = x.FullName
                })
                .ToListAsync(cancellationToken);
        }

        private static (string PreviousStatus, string NewStatus, string? Remarks) ParseStatusChangeDescription(string description)
        {
            var values = description
                .Split(';', StringSplitOptions.RemoveEmptyEntries)
                .Select(part => part.Split('=', 2))
                .Where(parts => parts.Length == 2)
                .ToDictionary(parts => parts[0], parts => parts[1]);

            values.TryGetValue("PreviousStatus", out var previousStatus);
            values.TryGetValue("NewStatus", out var newStatus);
            values.TryGetValue("Remarks", out var remarks);

            return (previousStatus ?? string.Empty, newStatus ?? string.Empty, Clean(remarks));
        }

        private async Task<string?> GetUserFullNameAsync(Guid? userId)
        {
            if (!userId.HasValue || userId.Value == Guid.Empty)
            {
                return null;
            }

            var user = await _userManager.FindByIdAsync(userId.Value.ToString());
            return user?.FullName;
        }

        private async Task<LeadInteractionViewModel> MapInteractionAsync(LeadInteraction interaction)
        {
            return new LeadInteractionViewModel
            {
                Id = interaction.Id,
                LeadId = interaction.LeadId,
                InteractionType = interaction.InteractionType.ToString(),
                Subject = interaction.Subject,
                Notes = interaction.Notes,
                InteractionDate = interaction.InteractionDate,
                NextFollowUpDate = interaction.NextFollowUpDate,
                CreatedByUserName = await GetUserFullNameAsync(interaction.CreatedBy)
            };
        }

        private async Task PopulateAssignedUserNameAsync(LeadDetailViewModel detail)
        {
            if (!detail.AssignedToUserId.HasValue)
            {
                return;
            }

            detail.AssignedToUserName = await GetUserFullNameAsync(detail.AssignedToUserId);
        }
    }
}
