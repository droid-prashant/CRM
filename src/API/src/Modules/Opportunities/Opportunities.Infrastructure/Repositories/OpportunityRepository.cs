using ERP.Identity.Entities;
using Leads.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Opportunities.Application.DTOs;
using Opportunities.Application.Repositories;
using Opportunities.Application.ViewModels;
using Opportunities.Domain.Entities;
using Opportunities.Infrastructure.Persistence.Data;

namespace Opportunities.Infrastructure.Repositories
{
    public class OpportunityRepository : IOpportunityRepository
    {
        private const string ProposalDocumentType = "Proposal";
        private const string AgreementDocumentType = "Agreement";
        private const string PurchaseOrderDocumentType = "PurchaseOrder";

        private readonly OpportunitiesDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public OpportunityRepository(OpportunitiesDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<PagedResultViewModel<OpportunityListItemViewModel>> GetOpportunityListAsync(OpportunityListQuery query, CancellationToken cancellationToken)
        {
            var opportunitiesQuery = ApplySorting(ApplyFilters(BaseOpportunityQuery(), query), query);
            var totalCount = await opportunitiesQuery.CountAsync(cancellationToken);
            var opportunities = await opportunitiesQuery
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResultViewModel<OpportunityListItemViewModel>
            {
                Items = await MapOpportunitiesAsync(opportunities, cancellationToken),
                PageNumber = query.PageNumber,
                PageSize = query.PageSize,
                TotalCount = totalCount
            };
        }

        public async Task<List<OpportunityPipelineStageViewModel>> GetPipelineAsync(OpportunityListQuery query, CancellationToken cancellationToken)
        {
            var stages = await GetActiveStagesQuery()
                .OrderBy(x => x.Sequence)
                .ToListAsync(cancellationToken);

            var opportunities = await ApplySorting(ApplyFilters(BaseOpportunityQuery(), query, ignoreStage: true), new OpportunityListQuery { SortField = "stage", SortDirection = "asc" })
                .ToListAsync(cancellationToken);
            var mapped = await MapOpportunitiesAsync(opportunities, cancellationToken);

            return stages.Select(stage => new OpportunityPipelineStageViewModel
            {
                StageId = stage.Id,
                StageName = stage.Name,
                Sequence = stage.Sequence,
                IsFinal = stage.IsFinal,
                IsWonStage = stage.IsWonStage,
                IsLostStage = stage.IsLostStage,
                Opportunities = mapped
                    .Where(x => x.StageId == stage.Id)
                    .OrderByDescending(x => x.ExpectedCloseDate.HasValue)
                    .ThenBy(x => x.ExpectedCloseDate)
                    .ThenBy(x => x.OpportunityNumber)
                    .ToList()
            }).ToList();
        }

        public async Task<OpportunityLookupViewModel> GetOpportunityLookupsAsync(CancellationToken cancellationToken)
        {
            return new OpportunityLookupViewModel
            {
                Clients = await _dbContext.CrmClients
                    .AsNoTracking()
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .OrderBy(x => x.Name)
                    .Select(x => new OpportunityClientLookupViewModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Country = string.Empty
                    })
                    .ToListAsync(cancellationToken),
                Contacts = await _dbContext.CrmClientContacts
                    .AsNoTracking()
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .OrderBy(x => x.FirstName)
                    .ThenBy(x => x.LastName)
                    .Select(x => new OpportunityContactLookupViewModel
                    {
                        Id = x.Id,
                        ClientId = x.ClientId,
                        FullName = x.FullName,
                        Email = x.Email
                    })
                    .ToListAsync(cancellationToken),
                Products = await _dbContext.Products
                    .AsNoTracking()
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .OrderBy(x => x.Name)
                    .Select(x => new OpportunityProductLookupViewModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        IsLicenseBased = x.IsLicenseBased,
                        IsSubscriptionBased = x.IsSubscriptionBased
                    })
                    .ToListAsync(cancellationToken),
                Leads = await _dbContext.Leads
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.CompanyName)
                    .Select(x => new OpportunityLeadLookupViewModel
                    {
                        Id = x.Id,
                        LeadNumber = x.LeadNumber,
                        CompanyName = x.CompanyName,
                        ContactPersonName = x.ContactPersonName,
                        Status = x.Status.ToString()
                    })
                    .ToListAsync(cancellationToken),
                Currencies = GetCurrencyLookups(),
                OwnerUsers = await _userManager.Users
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.FullName)
                    .Select(x => new OpportunityUserLookupViewModel
                    {
                        Id = x.Id,
                        FullName = x.FullName
                    })
                    .ToListAsync(cancellationToken),
                Stages = await GetActiveStagesQuery()
                    .OrderBy(x => x.Sequence)
                    .Select(x => new OpportunityLookupItemViewModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Code = x.Name,
                        Sequence = x.Sequence,
                        IsFinal = x.IsFinal,
                        IsWonStage = x.IsWonStage,
                        IsLostStage = x.IsLostStage
                    })
                    .ToListAsync(cancellationToken),
                Statuses = GetStatusLookups()
            };
        }

        public async Task<OpportunityListItemViewModel> CreateOpportunityAsync(CreateOpportunityRequest request, string opportunityNumber, CancellationToken cancellationToken)
        {
            var defaultStage = await GetDefaultStageAsync(cancellationToken);
            var opportunity = new Opportunity
            {
                OpportunityNumber = opportunityNumber,
                LeadId = request.LeadId,
                ProductId = request.ProductId,
                ClientId = request.ClientId,
                ContactId = request.ContactId,
                Title = request.Title.Trim(),
                EstimatedValue = request.EstimatedValue,
                CurrencyId = request.CurrencyId,
                ExpectedCloseDate = request.ExpectedCloseDate?.ToUniversalTime(),
                OwnerUserId = request.OwnerUserId,
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
                Remarks = "Opportunity created."
            });
            await _dbContext.SaveChangesAsync(cancellationToken);

            return await MapOpportunityAsync(opportunity, cancellationToken);
        }

        public async Task<OpportunityListItemViewModel?> UpdateOpportunityAsync(UpdateOpportunityRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await BaseOpportunityQuery()
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (opportunity == null)
            {
                return null;
            }

            opportunity.Title = request.Title.Trim();
            opportunity.EstimatedValue = request.EstimatedValue;
            opportunity.OwnerUserId = request.OwnerUserId;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await MapOpportunityAsync(opportunity, cancellationToken);
        }

        public async Task<OpportunityListItemViewModel?> ChangeStageAsync(Guid id, ChangeOpportunityStageRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await BaseOpportunityQuery()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            var targetStage = await GetActiveStagesQuery()
                .FirstOrDefaultAsync(x => x.Id == request.StageId, cancellationToken);

            if (opportunity == null || targetStage == null || targetStage.IsFinal || IsClosed(opportunity))
            {
                return null;
            }

            if (opportunity.StageId == targetStage.Id)
            {
                return await MapOpportunityAsync(opportunity, cancellationToken);
            }

            var currentSequence = opportunity.CurrentStage?.Sequence ?? 0;
            if (targetStage.Sequence <= currentSequence)
            {
                return null;
            }

            Guid? fromStageId = opportunity.StageId == Guid.Empty ? null : opportunity.StageId;
            opportunity.StageId = targetStage.Id;
            opportunity.Stage = targetStage.Name;
            if (request.EstimatedValue.HasValue)
            {
                opportunity.EstimatedValue = request.EstimatedValue.Value;
            }

            _dbContext.OpportunityStageHistories.Add(new OpportunityStageHistory
            {
                OpportunityId = opportunity.Id,
                FromStageId = fromStageId,
                ToStageId = targetStage.Id,
                Remarks = Clean(request.Remarks)
            });

            if (!string.IsNullOrWhiteSpace(request.ProposalDocumentPath))
            {
                await AddProposalVersionAsync(opportunity, request.ProposalDocumentFileName, request.ProposalDocumentStoredFileName,
                    request.ProposalDocumentPath, request.ProposalDocumentContentType, request.ProposalDocumentSize, null, cancellationToken);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await MapOpportunityAsync(opportunity, cancellationToken);
        }

        public Task<OpportunityListItemViewModel?> CloseAsWonAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return CloseOpportunityAsync(id, true, request, cancellationToken);
        }

        public Task<OpportunityListItemViewModel?> CloseAsLostAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return CloseOpportunityAsync(id, false, request, cancellationToken);
        }

        public async Task<List<OpportunityStageHistoryViewModel>?> GetStageHistoryAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await _dbContext.Opportunities.AsNoTracking().AnyAsync(x => x.Id == id && x.IsActive, cancellationToken))
            {
                return null;
            }

            var history = await _dbContext.OpportunityStageHistories
                .AsNoTracking()
                .Include(x => x.FromStage)
                .Include(x => x.ToStage)
                .Where(x => x.OpportunityId == id && x.IsActive)
                .OrderByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            var viewModels = new List<OpportunityStageHistoryViewModel>();
            foreach (var item in history)
            {
                viewModels.Add(new OpportunityStageHistoryViewModel
                {
                    Id = item.Id,
                    OpportunityId = item.OpportunityId,
                    FromStageName = item.FromStage?.Name,
                    ToStageName = item.ToStage?.Name ?? string.Empty,
                    Remarks = item.Remarks,
                    ChangedByUserId = item.CreatedBy,
                    ChangedByUserName = await GetUserFullNameAsync(item.CreatedBy),
                    ChangedAt = item.CreatedOn
                });
            }

            return viewModels;
        }

        public async Task<OpportunityDocumentViewModel?> GetProposalDocumentAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await _dbContext.Opportunities.AsNoTracking().AnyAsync(x => x.Id == id && x.IsActive, cancellationToken))
            {
                return null;
            }

            var document = await GetLatestProposalDocumentQuery(id)
                .FirstOrDefaultAsync(cancellationToken);

            return document == null ? null : await MapDocumentAsync(document);
        }

        public async Task<List<OpportunityCommercialDocumentViewModel>?> GetCommercialDocumentsAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await _dbContext.Opportunities.AsNoTracking().AnyAsync(x => x.Id == id && x.IsActive, cancellationToken))
            {
                return null;
            }

            var documents = await _dbContext.OpportunityCommercialDocuments
                .AsNoTracking()
                .Where(x => x.OpportunityId == id && x.IsActive)
                .OrderBy(x => x.DocumentType)
                .ThenByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            var viewModels = new List<OpportunityCommercialDocumentViewModel>();
            foreach (var document in documents)
            {
                viewModels.Add(await MapCommercialDocumentAsync(document));
            }

            return viewModels;
        }

        public async Task<OpportunityCommercialDocumentViewModel?> GetCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var document = await _dbContext.OpportunityCommercialDocuments
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == documentId && x.OpportunityId == id && x.IsActive, cancellationToken);

            return document == null ? null : await MapCommercialDocumentAsync(document);
        }

        public async Task<OpportunityCommercialDocumentViewModel?> UploadCommercialDocumentAsync(Guid id, UploadOpportunityCommercialDocumentRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await _dbContext.Opportunities
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (opportunity == null)
            {
                return null;
            }

            var documentType = NormalizeCommercialDocumentType(request.DocumentType);
            DeactivateExistingCommercialDocuments(opportunity.Id, documentType);

            var document = new OpportunityCommercialDocument
            {
                Id = Guid.NewGuid(),
                OpportunityId = opportunity.Id,
                DocumentType = documentType,
                FileName = request.FileName.Trim(),
                StoredFileName = request.StoredFileName.Trim(),
                FilePath = request.FilePath.Trim(),
                ContentType = request.ContentType.Trim(),
                FileSize = request.FileSize,
                Remarks = Clean(request.Remarks)
            };

            _dbContext.OpportunityCommercialDocuments.Add(document);
            UpdateCommercialBreakdownDocumentReference(opportunity.Id, document);
            var leadStatus = await GetLeadStatusAsync(opportunity.LeadId, cancellationToken);
            AddOpportunityActivity(opportunity, "DocumentUpload", $"{FormatCommercialDocumentType(documentType)} uploaded.", BuildCommercialDocumentActivityNotes(documentType, opportunity.Status, leadStatus, request.Remarks));
            AddLeadTimelineEntry(opportunity, "OpportunityDocumentUploaded", BuildCommercialDocumentTimelineDescription(opportunity, documentType, leadStatus, request.Remarks));

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await MapCommercialDocumentAsync(document);
        }

        public async Task<OpportunityCommercialDocumentViewModel?> DeleteCommercialDocumentAsync(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var opportunity = await _dbContext.Opportunities
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (opportunity == null)
            {
                return null;
            }

            var document = await _dbContext.OpportunityCommercialDocuments
                .FirstOrDefaultAsync(x => x.Id == documentId && x.OpportunityId == id && x.IsActive, cancellationToken);

            if (document == null)
            {
                return null;
            }

            document.IsActive = false;

            var leadStatus = await GetLeadStatusAsync(opportunity.LeadId, cancellationToken);
            AddOpportunityActivity(opportunity, "DocumentDelete", $"{FormatCommercialDocumentType(document.DocumentType)} deleted.", BuildCommercialDocumentActivityNotes(document.DocumentType, opportunity.Status, leadStatus, document.Remarks));
            AddLeadTimelineEntry(opportunity, "OpportunityDocumentDeleted", BuildCommercialDocumentDeletedTimelineDescription(opportunity, document.DocumentType, leadStatus));

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await MapCommercialDocumentAsync(document);
        }

        public async Task<OpportunityCommercialBreakdownViewModel?> GetCommercialBreakdownAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await _dbContext.Opportunities.AsNoTracking().AnyAsync(x => x.Id == id && x.IsActive, cancellationToken))
            {
                return null;
            }

            var breakdown = await _dbContext.OpportunityCommercialBreakdowns
                .AsNoTracking()
                .Include(x => x.AgreementDocument)
                .Include(x => x.PurchaseOrderDocument)
                .FirstOrDefaultAsync(x => x.OpportunityId == id && x.IsActive, cancellationToken);

            return breakdown == null ? null : await MapCommercialBreakdownAsync(breakdown);
        }

        public async Task<OpportunityCommercialBreakdownViewModel?> SaveCommercialBreakdownAsync(Guid id, SaveOpportunityCommercialBreakdownRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await _dbContext.Opportunities
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (opportunity == null)
            {
                return null;
            }

            var breakdown = await _dbContext.OpportunityCommercialBreakdowns
                .Include(x => x.AgreementDocument)
                .Include(x => x.PurchaseOrderDocument)
                .FirstOrDefaultAsync(x => x.OpportunityId == id && x.IsActive, cancellationToken);

            var isCreated = breakdown == null;
            if (breakdown == null)
            {
                breakdown = new OpportunityCommercialBreakdown
                {
                    OpportunityId = opportunity.Id
                };
                _dbContext.OpportunityCommercialBreakdowns.Add(breakdown);
            }

            breakdown.CurrencyId = request.CurrencyId;
            breakdown.FinalPayableAmount = request.FinalPayableAmount;
            breakdown.AgreementDocumentId = request.AgreementDocumentId;
            breakdown.AgreementDate = request.AgreementDocumentId.HasValue ? ToUtc(request.AgreementDate) : null;
            breakdown.AgreementExpiryDate = request.AgreementDocumentId.HasValue ? ToUtc(request.AgreementExpiryDate) : null;
            breakdown.PurchaseOrderDocumentId = request.PurchaseOrderDocumentId;
            breakdown.PurchaseOrderDate = request.PurchaseOrderDocumentId.HasValue ? ToUtc(request.PurchaseOrderDate) : null;
            breakdown.LicenseApplicable = request.LicenseApplicable;
            breakdown.LicenseAmount = request.LicenseApplicable ? request.LicenseAmount : null;
            breakdown.AmcAmount = request.LicenseApplicable ? request.AmcAmount : null;
            breakdown.AmcStartDate = request.LicenseApplicable ? ToUtc(request.AmcStartDate) : null;
            breakdown.AmcRenewalDate = request.LicenseApplicable ? ToUtc(request.AmcRenewalDate) : null;
            breakdown.AmcExpiryDate = request.LicenseApplicable ? ToUtc(request.AmcExpiryDate) : null;
            breakdown.SubscriptionApplicable = request.SubscriptionApplicable;
            breakdown.SubscriptionAmount = request.SubscriptionApplicable ? request.SubscriptionAmount : null;
            breakdown.SubscriptionBillingFrequency = request.SubscriptionApplicable ? Clean(request.SubscriptionBillingFrequency) : null;
            breakdown.SubscriptionStartDate = request.SubscriptionApplicable ? ToUtc(request.SubscriptionStartDate) : null;
            breakdown.NextSubscriptionBillingDate = request.SubscriptionApplicable ? ToUtc(request.NextSubscriptionBillingDate) : null;
            breakdown.IsFinal = request.IsFinal;
            breakdown.Remarks = Clean(request.Remarks);

            var activitySubject = isCreated ? "Commercial breakdown created." : "Commercial breakdown updated.";
            var activityType = isCreated ? "CommercialCreated" : "CommercialUpdated";
            var leadStatus = await GetLeadStatusAsync(opportunity.LeadId, cancellationToken);
            AddOpportunityActivity(opportunity, "CommercialBreakdown", activitySubject, BuildCommercialBreakdownActivityNotes(opportunity.Status, leadStatus, breakdown, request.Remarks));
            AddLeadTimelineEntry(opportunity, activityType, BuildCommercialBreakdownTimelineDescription(opportunity, leadStatus, activitySubject, breakdown));

            await _dbContext.SaveChangesAsync(cancellationToken);

            breakdown.AgreementDocument = request.AgreementDocumentId.HasValue
                ? await _dbContext.OpportunityCommercialDocuments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.AgreementDocumentId.Value, cancellationToken)
                : null;
            breakdown.PurchaseOrderDocument = request.PurchaseOrderDocumentId.HasValue
                ? await _dbContext.OpportunityCommercialDocuments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.PurchaseOrderDocumentId.Value, cancellationToken)
                : null;

            return await MapCommercialBreakdownAsync(breakdown);
        }

        public async Task<List<OpportunityActivityViewModel>?> GetActivitiesAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await _dbContext.Opportunities.AsNoTracking().AnyAsync(x => x.Id == id && x.IsActive, cancellationToken))
            {
                return null;
            }

            var activities = await _dbContext.OpportunityActivities
                .AsNoTracking()
                .Where(x => x.OpportunityId == id && x.IsActive)
                .OrderByDescending(x => x.ActivityDate)
                .ThenByDescending(x => x.CreatedOn)
                .ToListAsync(cancellationToken);

            var viewModels = new List<OpportunityActivityViewModel>();
            foreach (var activity in activities)
            {
                viewModels.Add(await MapActivityAsync(activity));
            }

            return viewModels;
        }

        public async Task<OpportunityActivityViewModel?> CreateActivityAsync(Guid id, CreateOpportunityActivityRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await _dbContext.Opportunities
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (opportunity == null || IsClosed(opportunity))
            {
                return null;
            }

            var activity = new OpportunityActivity
            {
                OpportunityId = opportunity.Id,
                ActivityType = request.ActivityType.Trim(),
                Subject = Clean(request.Subject),
                Notes = request.Notes.Trim(),
                ActivityDate = request.ActivityDate?.ToUniversalTime() ?? DateTime.UtcNow,
                FollowUpDate = request.FollowUpDate?.ToUniversalTime()
            };

            _dbContext.OpportunityActivities.Add(activity);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return await MapActivityAsync(activity);
        }

        public Task<bool> UserCanAccessOpportunityAsync(Guid id, Guid currentUserId, bool hasOverrideAccess, CancellationToken cancellationToken)
        {
            return _dbContext.Opportunities
                .AsNoTracking()
                .AnyAsync(x => x.Id == id && x.IsActive && (hasOverrideAccess || x.OwnerUserId == currentUserId), cancellationToken);
        }

        public Task<bool> UserCanModifyOpportunityAsync(Guid id, Guid currentUserId, bool hasOverrideAccess, CancellationToken cancellationToken)
        {
            return _dbContext.Opportunities
                .AsNoTracking()
                .AnyAsync(x => x.Id == id && x.IsActive && (hasOverrideAccess || x.OwnerUserId == currentUserId), cancellationToken);
        }

        public Task<bool> OpportunityExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.Opportunities
                .AsNoTracking()
                .AnyAsync(x => x.Id == id && x.IsActive, cancellationToken);
        }

        public Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.CrmClients.AnyAsync(x => x.Id == clientId && x.IsActive && !x.IsDeleted, cancellationToken);
        }

        public Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken)
        {
            return _dbContext.Products.AnyAsync(x => x.Id == productId && x.IsActive && !x.IsDeleted, cancellationToken);
        }

        public Task<bool> LeadExistsAsync(Guid leadId, CancellationToken cancellationToken)
        {
            return _dbContext.Leads.AnyAsync(x => x.Id == leadId && x.IsActive, cancellationToken);
        }

        public Task<bool> ContactBelongsToClientAsync(Guid contactId, Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.CrmClientContacts.AnyAsync(x => x.Id == contactId && x.ClientId == clientId && x.IsActive && !x.IsDeleted, cancellationToken);
        }

        public async Task<bool> UserExistsAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user?.IsActive == true;
        }

        public Task<bool> StageExistsAsync(Guid stageId, CancellationToken cancellationToken)
        {
            return GetActiveStagesQuery().AnyAsync(x => x.Id == stageId, cancellationToken);
        }

        public Task<bool> StageIsProposalSentAsync(Guid stageId, CancellationToken cancellationToken)
        {
            return GetActiveStagesQuery().AnyAsync(
                x => x.Id == stageId && x.Name.ToLower() == "proposal sent",
                cancellationToken);
        }

        public Task<bool> OpportunityHasProposalDocumentAsync(Guid id, CancellationToken cancellationToken)
        {
            return GetLatestProposalDocumentQuery(id).AnyAsync(cancellationToken);
        }

        public Task<bool> OpportunityIsWonAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.Opportunities
                .AsNoTracking()
                .AnyAsync(x => x.Id == id && x.IsActive && x.Status.ToLower() == "won", cancellationToken);
        }

        public Task<bool> OpportunityHasCommercialDocumentAsync(Guid id, CancellationToken cancellationToken)
        {
            return _dbContext.OpportunityCommercialDocuments
                .AsNoTracking()
                .AnyAsync(x => x.OpportunityId == id && x.IsActive, cancellationToken);
        }

        public Task<bool> CommercialDocumentBelongsToOpportunityAsync(Guid id, Guid documentId, string documentType, CancellationToken cancellationToken)
        {
            var normalizedType = NormalizeCommercialDocumentType(documentType);
            return _dbContext.OpportunityCommercialDocuments
                .AsNoTracking()
                .AnyAsync(x => x.Id == documentId && x.OpportunityId == id && x.IsActive && x.DocumentType == normalizedType, cancellationToken);
        }

        public Task<bool> CommercialDocumentIsReferencedByBreakdownAsync(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            return _dbContext.OpportunityCommercialBreakdowns
                .AsNoTracking()
                .AnyAsync(x => x.OpportunityId == id
                    && x.IsActive
                    && (x.AgreementDocumentId == documentId || x.PurchaseOrderDocumentId == documentId),
                    cancellationToken);
        }

        private async Task<OpportunityListItemViewModel?> CloseOpportunityAsync(Guid id, bool won, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await BaseOpportunityQuery()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            var targetStage = won
                ? await GetActiveStagesQuery().FirstOrDefaultAsync(x => x.IsWonStage, cancellationToken)
                : await GetActiveStagesQuery().FirstOrDefaultAsync(x => x.IsLostStage, cancellationToken);

            if (opportunity == null || targetStage == null || IsClosed(opportunity))
            {
                return null;
            }

            var status = won ? "Won" : "Lost";
            Guid? fromStageId = opportunity.StageId == Guid.Empty ? null : opportunity.StageId;
            opportunity.StageId = targetStage.Id;
            opportunity.Stage = targetStage.Name;
            opportunity.Status = status;
            opportunity.FinalAmount = status == "Won" ? request.FinalAmount : null;
            opportunity.ClosedDate = request.ClosedDate.ToUniversalTime();
            opportunity.ClosingNote = Clean(request.Note);
            opportunity.LostReason = status == "Lost" ? Clean(request.LostReason) : null;

            _dbContext.OpportunityStageHistories.Add(new OpportunityStageHistory
            {
                OpportunityId = opportunity.Id,
                FromStageId = fromStageId,
                ToStageId = targetStage.Id,
                Remarks = Clean(request.Note)
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await MapOpportunityAsync(opportunity, cancellationToken);
        }

        private IQueryable<Opportunity> BaseOpportunityQuery()
        {
            return _dbContext.Opportunities
                .Include(x => x.CurrentStage)
                .AsQueryable();
        }

        private IQueryable<OpportunityStage> GetActiveStagesQuery()
        {
            return _dbContext.OpportunityStages
                .AsNoTracking()
                .Where(x => x.IsActive && !x.IsDeleted);
        }

        private Task<OpportunityStage> GetDefaultStageAsync(CancellationToken cancellationToken)
        {
            return GetActiveStagesQuery()
                .OrderByDescending(x => x.IsDefault)
                .ThenBy(x => x.Sequence)
                .FirstAsync(cancellationToken);
        }

        private async Task<List<OpportunityListItemViewModel>> MapOpportunitiesAsync(List<Opportunity> opportunities, CancellationToken cancellationToken)
        {
            var viewModels = new List<OpportunityListItemViewModel>();
            foreach (var opportunity in opportunities)
            {
                viewModels.Add(await MapOpportunityAsync(opportunity, cancellationToken));
            }

            return viewModels;
        }

        private async Task<OpportunityListItemViewModel> MapOpportunityAsync(Opportunity opportunity, CancellationToken cancellationToken)
        {
            var clientName = await _dbContext.CrmClients
                .Where(x => x.Id == opportunity.ClientId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken);

            var productName = await _dbContext.Products
                .Where(x => x.Id == opportunity.ProductId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken);

            var contactName = await _dbContext.CrmClientContacts
                .Where(x => x.Id == opportunity.ContactId)
                .Select(x => x.FullName)
                .FirstOrDefaultAsync(cancellationToken);

            var leadNumber = await _dbContext.Leads
                .Where(x => x.Id == opportunity.LeadId)
                .Select(x => x.LeadNumber)
                .FirstOrDefaultAsync(cancellationToken);

            var stage = opportunity.CurrentStage ?? await _dbContext.OpportunityStages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == opportunity.StageId, cancellationToken);
            var proposalDocument = await GetLatestProposalDocumentQuery(opportunity.Id).FirstOrDefaultAsync(cancellationToken);

            return new OpportunityListItemViewModel
            {
                Id = opportunity.Id,
                OpportunityNumber = opportunity.OpportunityNumber,
                Title = opportunity.Title,
                ClientId = opportunity.ClientId,
                ClientName = clientName ?? string.Empty,
                ProductId = opportunity.ProductId,
                ProductName = productName ?? string.Empty,
                ContactId = opportunity.ContactId,
                ContactName = contactName ?? string.Empty,
                LeadId = opportunity.LeadId,
                LeadNumber = leadNumber,
                StageId = stage?.Id ?? opportunity.StageId,
                StageName = stage?.Name ?? opportunity.Stage,
                StageSequence = stage?.Sequence ?? 0,
                IsFinalStage = stage?.IsFinal == true,
                EstimatedValue = opportunity.EstimatedValue,
                CurrencyId = opportunity.CurrencyId,
                CurrencyCode = GetCurrencyCode(opportunity.CurrencyId),
                OwnerUserId = opportunity.OwnerUserId,
                OwnerUserName = await GetUserFullNameAsync(opportunity.OwnerUserId),
                ExpectedCloseDate = opportunity.ExpectedCloseDate,
                Status = opportunity.Status,
                FinalAmount = opportunity.FinalAmount,
                ClosedDate = opportunity.ClosedDate,
                ClosingNote = opportunity.ClosingNote,
                LostReason = opportunity.LostReason,
                HasProposalDocument = proposalDocument != null,
                ProposalDocumentId = proposalDocument?.Id,
                ProposalDocumentFileName = proposalDocument?.FileName,
                ProposalDocumentUploadedOn = proposalDocument?.CreatedOn,
                ProposalVersionNumber = proposalDocument?.VersionNumber,
                ProposalIsLastCommunicated = proposalDocument?.IsLastCommunicated
            };
        }

        private IQueryable<Opportunity> ApplyFilters(IQueryable<Opportunity> queryable, OpportunityListQuery query, bool ignoreStage = false)
        {
            if (query.ClientId.HasValue)
            {
                queryable = queryable.Where(x => x.ClientId == query.ClientId.Value);
            }

            if (query.OwnerUserId.HasValue)
            {
                queryable = queryable.Where(x => x.OwnerUserId == query.OwnerUserId.Value);
            }

            if (!ignoreStage && !string.IsNullOrWhiteSpace(query.StageId))
            {
                var stage = query.StageId.Trim();
                if (Guid.TryParse(stage, out var stageId))
                {
                    queryable = queryable.Where(x => x.StageId == stageId);
                }
                else
                {
                    var stageName = stage.ToLower();
                    queryable = queryable.Where(x => x.Stage.ToLower() == stageName || (x.CurrentStage != null && x.CurrentStage.Name.ToLower() == stageName));
                }
            }

            var status = query.Status?.Trim().ToLower();
            if (!string.IsNullOrWhiteSpace(status))
            {
                queryable = queryable.Where(x => x.Status.ToLower() == status);
            }
            else
            {
                queryable = queryable.Where(x => x.IsActive);
            }

            if (!string.IsNullOrWhiteSpace(query.SearchTerm))
            {
                var searchTerm = query.SearchTerm.Trim().ToLower();
                var matchingClientIds = _dbContext.CrmClients
                    .Where(x => x.Name.ToLower().Contains(searchTerm))
                    .Select(x => x.Id);
                var matchingProductIds = _dbContext.Products
                    .Where(x => !x.IsDeleted && (x.Name.ToLower().Contains(searchTerm) || x.Code.ToLower().Contains(searchTerm)))
                    .Select(x => x.Id);
                var matchingContactIds = _dbContext.CrmClientContacts
                    .Where(x => x.FullName.ToLower().Contains(searchTerm) || (x.Email != null && x.Email.ToLower().Contains(searchTerm)))
                    .Select(x => x.Id);
                var matchingLeadIds = _dbContext.Leads
                    .Where(x => x.LeadNumber.ToLower().Contains(searchTerm) || x.CompanyName.ToLower().Contains(searchTerm))
                    .Select(x => x.Id);

                queryable = queryable.Where(x =>
                    x.OpportunityNumber.ToLower().Contains(searchTerm)
                    || x.Title.ToLower().Contains(searchTerm)
                    || x.Stage.ToLower().Contains(searchTerm)
                    || matchingClientIds.Contains(x.ClientId)
                    || matchingProductIds.Contains(x.ProductId)
                    || matchingContactIds.Contains(x.ContactId)
                    || matchingLeadIds.Contains(x.LeadId));
            }

            return queryable.Where(x => x.IsActive);
        }

        private static IQueryable<Opportunity> ApplySorting(IQueryable<Opportunity> queryable, OpportunityListQuery query)
        {
            var descending = string.Equals(query.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);

            return query.SortField?.Trim().ToLowerInvariant() switch
            {
                "opportunitynumber" => descending ? queryable.OrderByDescending(x => x.OpportunityNumber) : queryable.OrderBy(x => x.OpportunityNumber),
                "title" => descending ? queryable.OrderByDescending(x => x.Title) : queryable.OrderBy(x => x.Title),
                "estimatedvalue" => descending ? queryable.OrderByDescending(x => x.EstimatedValue) : queryable.OrderBy(x => x.EstimatedValue),
                "stage" or "stagename" => descending ? queryable.OrderByDescending(x => x.CurrentStage!.Sequence) : queryable.OrderBy(x => x.CurrentStage!.Sequence),
                "expectedclosedate" => descending ? queryable.OrderByDescending(x => x.ExpectedCloseDate) : queryable.OrderBy(x => x.ExpectedCloseDate),
                _ => queryable.OrderByDescending(x => x.CreatedOn)
            };
        }

        private async Task<string?> GetUserFullNameAsync(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return null;
            }

            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user?.FullName;
        }

        private async Task<string?> GetLeadStatusAsync(Guid leadId, CancellationToken cancellationToken)
        {
            return await _dbContext.Leads
                .AsNoTracking()
                .Where(x => x.Id == leadId && x.IsActive)
                .Select(x => x.Status.ToString())
                .FirstOrDefaultAsync(cancellationToken);
        }

        private async Task<OpportunityActivityViewModel> MapActivityAsync(OpportunityActivity activity)
        {
            return new OpportunityActivityViewModel
            {
                Id = activity.Id,
                OpportunityId = activity.OpportunityId,
                ActivityType = activity.ActivityType,
                Subject = activity.Subject,
                Notes = activity.Notes,
                ActivityDate = activity.ActivityDate,
                FollowUpDate = activity.FollowUpDate,
                CreatedByUserId = activity.CreatedBy,
                CreatedByUserName = await GetUserFullNameAsync(activity.CreatedBy)
            };
        }

        private async Task<OpportunityDocumentViewModel> MapDocumentAsync(OpportunityDocument document)
        {
            return new OpportunityDocumentViewModel
            {
                Id = document.Id,
                OpportunityId = document.OpportunityId,
                DocumentType = document.DocumentType,
                FileName = document.FileName,
                StoredFileName = document.StoredFileName,
                FilePath = document.FilePath,
                ContentType = document.ContentType,
                FileSize = document.FileSize,
                UploadedByUserId = document.CreatedBy,
                UploadedByUserName = await GetUserFullNameAsync(document.CreatedBy),
                UploadedOn = document.CreatedOn,
                VersionNumber = document.VersionNumber,
                Description = document.Description,
                IsLastCommunicated = document.IsLastCommunicated
            };
        }

        private async Task<OpportunityCommercialDocumentViewModel> MapCommercialDocumentAsync(OpportunityCommercialDocument document)
        {
            return new OpportunityCommercialDocumentViewModel
            {
                Id = document.Id,
                OpportunityId = document.OpportunityId,
                DocumentType = document.DocumentType,
                FileName = document.FileName,
                StoredFileName = document.StoredFileName,
                FilePath = document.FilePath,
                ContentType = document.ContentType,
                FileSize = document.FileSize,
                Remarks = document.Remarks,
                UploadedByUserId = document.CreatedBy,
                UploadedByUserName = await GetUserFullNameAsync(document.CreatedBy),
                UploadedOn = document.CreatedOn
            };
        }

        private async Task<OpportunityCommercialBreakdownViewModel> MapCommercialBreakdownAsync(OpportunityCommercialBreakdown breakdown)
        {
            var updatedBy = breakdown.UpdatedBy ?? breakdown.CreatedBy;
            return new OpportunityCommercialBreakdownViewModel
            {
                Id = breakdown.Id,
                OpportunityId = breakdown.OpportunityId,
                CurrencyId = breakdown.CurrencyId,
                CurrencyCode = GetCurrencyCode(breakdown.CurrencyId),
                FinalPayableAmount = breakdown.FinalPayableAmount,
                AgreementDocumentId = breakdown.AgreementDocumentId,
                AgreementDocumentFileName = breakdown.AgreementDocument?.FileName,
                AgreementDate = breakdown.AgreementDate,
                AgreementExpiryDate = breakdown.AgreementExpiryDate,
                PurchaseOrderDocumentId = breakdown.PurchaseOrderDocumentId,
                PurchaseOrderDocumentFileName = breakdown.PurchaseOrderDocument?.FileName,
                PurchaseOrderDate = breakdown.PurchaseOrderDate,
                LicenseApplicable = breakdown.LicenseApplicable,
                LicenseAmount = breakdown.LicenseAmount,
                AmcAmount = breakdown.AmcAmount,
                AmcStartDate = breakdown.AmcStartDate,
                AmcRenewalDate = breakdown.AmcRenewalDate,
                AmcExpiryDate = breakdown.AmcExpiryDate,
                SubscriptionApplicable = breakdown.SubscriptionApplicable,
                SubscriptionAmount = breakdown.SubscriptionAmount,
                SubscriptionBillingFrequency = breakdown.SubscriptionBillingFrequency,
                SubscriptionStartDate = breakdown.SubscriptionStartDate,
                NextSubscriptionBillingDate = breakdown.NextSubscriptionBillingDate,
                IsFinal = breakdown.IsFinal,
                Remarks = breakdown.Remarks,
                UpdatedByUserId = updatedBy,
                UpdatedByUserName = await GetUserFullNameAsync(updatedBy),
                UpdatedOn = breakdown.UpdatedOn ?? breakdown.CreatedOn
            };
        }

        private IQueryable<OpportunityDocument> GetLatestProposalDocumentQuery(Guid opportunityId)
        {
            return _dbContext.OpportunityDocuments
                .AsNoTracking()
                .Where(x => x.OpportunityId == opportunityId && x.IsLastCommunicated && x.DocumentType == ProposalDocumentType);
        }

        public async Task<List<ProposalVersionViewModel>> GetProposalHistoryAsync(Guid id, CancellationToken cancellationToken)
        {
            var documents = await _dbContext.OpportunityDocuments
                .AsNoTracking()
                .Where(x => x.OpportunityId == id && x.DocumentType == ProposalDocumentType)
                .OrderByDescending(x => x.VersionNumber)
                .ToListAsync(cancellationToken);

            var viewModels = new List<ProposalVersionViewModel>();
            foreach (var document in documents)
            {
                viewModels.Add(new ProposalVersionViewModel
                {
                    DocumentId = document.Id,
                    VersionNumber = document.VersionNumber,
                    FileName = document.FileName,
                    ContentType = document.ContentType,
                    FileSize = document.FileSize,
                    UploadedByUserId = document.CreatedBy,
                    UploadedByUserName = await GetUserFullNameAsync(document.CreatedBy),
                    UploadedOn = document.CreatedOn,
                    Description = document.Description,
                    IsLastCommunicated = document.IsLastCommunicated
                });
            }

            return viewModels;
        }

        public async Task<OpportunityDocumentViewModel?> GetProposalDocumentVersionAsync(Guid id, Guid documentId, CancellationToken cancellationToken)
        {
            var document = await _dbContext.OpportunityDocuments
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == documentId && x.OpportunityId == id && x.DocumentType == ProposalDocumentType, cancellationToken);

            return document == null ? null : await MapDocumentAsync(document);
        }

        public async Task<OpportunityDocumentViewModel?> UploadProposalVersionAsync(Guid id, UploadProposalVersionRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await _dbContext.Opportunities
                .FirstOrDefaultAsync(x => x.Id == id && x.IsActive, cancellationToken);

            if (opportunity == null || IsClosed(opportunity))
            {
                return null;
            }

            var document = await AddProposalVersionAsync(opportunity, request.ProposalDocumentFileName, request.ProposalDocumentStoredFileName,
                request.ProposalDocumentPath!, request.ProposalDocumentContentType, request.ProposalDocumentSize, request.Description, cancellationToken);

            await AddProposalTimelineEntryAsync(opportunity, document, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return await MapDocumentAsync(document);
        }

        private async Task<OpportunityDocument> AddProposalVersionAsync(Opportunity opportunity, string? fileName, string? storedFileName,
            string filePath, string? contentType, long? fileSize, string? description, CancellationToken cancellationToken)
        {
            var maxVersion = await _dbContext.OpportunityDocuments
                .Where(x => x.OpportunityId == opportunity.Id && x.DocumentType == ProposalDocumentType)
                .MaxAsync(x => (int?)x.VersionNumber, cancellationToken) ?? 0;

            var existingLastCommunicated = await _dbContext.OpportunityDocuments
                .Where(x => x.OpportunityId == opportunity.Id && x.DocumentType == ProposalDocumentType && x.IsLastCommunicated)
                .ToListAsync(cancellationToken);

            foreach (var doc in existingLastCommunicated)
            {
                doc.IsLastCommunicated = false;
            }

            var document = new OpportunityDocument
            {
                OpportunityId = opportunity.Id,
                DocumentType = ProposalDocumentType,
                FileName = fileName?.Trim() ?? string.Empty,
                StoredFileName = storedFileName?.Trim() ?? string.Empty,
                FilePath = filePath.Trim(),
                ContentType = contentType?.Trim() ?? string.Empty,
                FileSize = fileSize ?? 0,
                VersionNumber = maxVersion + 1,
                Description = description?.Trim(),
                IsLastCommunicated = true
            };

            _dbContext.OpportunityDocuments.Add(document);
            return document;
        }

        private async Task AddProposalTimelineEntryAsync(Opportunity opportunity, OpportunityDocument document, CancellationToken cancellationToken)
        {
            var lead = await _dbContext.Leads
                .Include(x => x.TimelineEntries)
                .FirstOrDefaultAsync(x => x.Id == opportunity.LeadId && x.IsActive && !x.IsDeleted, cancellationToken);

            if (lead == null)
            {
                return;
            }

            var description = $"Proposal v{document.VersionNumber} uploaded: {document.FileName}";
            if (!string.IsNullOrWhiteSpace(document.Description))
            {
                description += $" ({document.Description})";
            }

            lead.TimelineEntries.Add(new LeadTimelineEntry
            {
                EventType = "ProposalUploaded",
                Description = description
            });
        }

        private void DeactivateExistingCommercialDocuments(Guid opportunityId, string documentType)
        {
            var documents = _dbContext.OpportunityCommercialDocuments
                .Where(x => x.OpportunityId == opportunityId && x.IsActive && x.DocumentType == documentType);

            foreach (var document in documents)
            {
                document.IsActive = false;
            }
        }

        private void UpdateCommercialBreakdownDocumentReference(Guid opportunityId, OpportunityCommercialDocument document)
        {
            var breakdown = _dbContext.OpportunityCommercialBreakdowns
                .FirstOrDefault(x => x.OpportunityId == opportunityId && x.IsActive);

            if (breakdown == null)
            {
                return;
            }

            if (document.DocumentType == AgreementDocumentType && breakdown.AgreementDocumentId.HasValue)
            {
                breakdown.AgreementDocumentId = document.Id;
            }
            else if (document.DocumentType == PurchaseOrderDocumentType && breakdown.PurchaseOrderDocumentId.HasValue)
            {
                breakdown.PurchaseOrderDocumentId = document.Id;
            }
        }

        private void AddOpportunityActivity(Opportunity opportunity, string activityType, string subject, string notes)
        {
            _dbContext.OpportunityActivities.Add(new OpportunityActivity
            {
                OpportunityId = opportunity.Id,
                ActivityType = activityType,
                Subject = subject,
                Notes = notes,
                ActivityDate = DateTime.UtcNow
            });
        }

        private void AddLeadTimelineEntry(Opportunity opportunity, string eventType, string description)
        {
            _dbContext.LeadTimelineEntries.Add(new LeadTimelineEntry
            {
                LeadId = opportunity.LeadId,
                EventType = eventType,
                Description = description.Trim()
            });
        }

        private static string BuildCommercialDocumentActivityNotes(string documentType, string opportunityStatus, string? leadStatus, string? remarks)
        {
            var notes = $"Document Type: {FormatCommercialDocumentType(documentType)}\nOpportunity Status: {opportunityStatus}\nLead Status: {FormatStatus(leadStatus)}";
            var cleanedRemarks = Clean(remarks);
            return string.IsNullOrWhiteSpace(cleanedRemarks) ? notes : $"{notes}\nRemarks: {cleanedRemarks}";
        }

        private static string BuildCommercialBreakdownActivityNotes(string opportunityStatus, string? leadStatus, OpportunityCommercialBreakdown breakdown, string? remarks)
        {
            var notes = $"Opportunity Status: {opportunityStatus}\nLead Status: {FormatStatus(leadStatus)}\n{BuildCommercialBreakdownSummary(breakdown)}";
            var cleanedRemarks = Clean(remarks);
            return string.IsNullOrWhiteSpace(cleanedRemarks) ? notes : $"{notes}\nRemarks: {cleanedRemarks}";
        }

        private static string BuildCommercialDocumentTimelineDescription(Opportunity opportunity, string documentType, string? leadStatus, string? remarks)
        {
            var description = $"{FormatCommercialDocumentType(documentType)} uploaded for {opportunity.OpportunityNumber}. Opportunity Status: {opportunity.Status}. Lead Status: {FormatStatus(leadStatus)}.";
            var cleanedRemarks = Clean(remarks);
            return string.IsNullOrWhiteSpace(cleanedRemarks) ? description : $"{description} Remarks: {cleanedRemarks}";
        }

        private static string BuildCommercialDocumentDeletedTimelineDescription(Opportunity opportunity, string documentType, string? leadStatus)
        {
            return $"{FormatCommercialDocumentType(documentType)} deleted for {opportunity.OpportunityNumber}. Opportunity Status: {opportunity.Status}. Lead Status: {FormatStatus(leadStatus)}.";
        }

        private static string BuildCommercialBreakdownTimelineDescription(Opportunity opportunity, string? leadStatus, string activitySubject, OpportunityCommercialBreakdown breakdown)
        {
            return $"{activitySubject} Opportunity {opportunity.OpportunityNumber}. Opportunity Status: {opportunity.Status}. Lead Status: {FormatStatus(leadStatus)}. {BuildCommercialBreakdownSummary(breakdown)}";
        }

        private static string BuildCommercialBreakdownSummary(OpportunityCommercialBreakdown breakdown)
        {
            var parts = new List<string>
            {
                $"Currency: {GetCurrencyCode(breakdown.CurrencyId)}",
                $"Final Payable Amount: {breakdown.FinalPayableAmount:0.##}"
            };

            if (breakdown.AgreementDocumentId.HasValue)
            {
                parts.Add($"Agreement Date: {FormatDate(breakdown.AgreementDate)}");
                parts.Add($"Agreement Expiry: {FormatDate(breakdown.AgreementExpiryDate)}");
            }

            if (breakdown.PurchaseOrderDocumentId.HasValue)
            {
                parts.Add($"PO Date: {FormatDate(breakdown.PurchaseOrderDate)}");
            }

            if (breakdown.LicenseApplicable)
            {
                parts.Add($"License Amount: {breakdown.LicenseAmount:0.##}");
                parts.Add($"AMC Amount: {breakdown.AmcAmount:0.##}");
                parts.Add($"AMC Renewal: {FormatDate(breakdown.AmcRenewalDate)}");
                parts.Add($"AMC Expiry: {FormatDate(breakdown.AmcExpiryDate)}");
            }

            if (breakdown.SubscriptionApplicable)
            {
                parts.Add($"Subscription Amount: {breakdown.SubscriptionAmount:0.##}");
                parts.Add($"Billing Frequency: {breakdown.SubscriptionBillingFrequency}");
                parts.Add($"Next Billing: {FormatDate(breakdown.NextSubscriptionBillingDate)}");
            }

            return string.Join("; ", parts);
        }

        private static string NormalizeCommercialDocumentType(string documentType)
        {
            return string.Equals(documentType, PurchaseOrderDocumentType, StringComparison.OrdinalIgnoreCase)
                || string.Equals(documentType, "PO", StringComparison.OrdinalIgnoreCase)
                || string.Equals(documentType, "Purchase Order", StringComparison.OrdinalIgnoreCase)
                    ? PurchaseOrderDocumentType
                    : AgreementDocumentType;
        }

        private static string FormatCommercialDocumentType(string documentType)
        {
            return string.Equals(documentType, PurchaseOrderDocumentType, StringComparison.OrdinalIgnoreCase)
                ? "Purchase Order"
                : "Agreement";
        }

        private static DateTime? ToUtc(DateTime? value)
        {
            return value?.Kind == DateTimeKind.Utc ? value : value?.ToUniversalTime();
        }

        private static string FormatDate(DateTime? value)
        {
            return value?.ToString("yyyy-MM-dd") ?? "Not set";
        }

        private static string FormatStatus(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? "Not linked" : value;
        }

        private static string GetCurrencyCode(Guid currencyId)
        {
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000001")) return "NPR";
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000002")) return "USD";
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000003")) return "INR";

            return string.Empty;
        }

        private static List<OpportunityCurrencyLookupViewModel> GetCurrencyLookups()
        {
            return new List<OpportunityCurrencyLookupViewModel>
            {
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000001"), Code = "NPR", Name = "Nepalese Rupee" },
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000002"), Code = "USD", Name = "US Dollar" },
                new() { Id = Guid.Parse("70000000-0000-0000-0000-000000000003"), Code = "INR", Name = "Indian Rupee" }
            };
        }

        private static List<OpportunityLookupItemViewModel> GetStatusLookups()
        {
            return new List<OpportunityLookupItemViewModel>
            {
                new() { Id = Guid.Parse("90000000-0000-0000-0000-000000000001"), Code = "Open", Name = "Open" },
                new() { Id = Guid.Parse("90000000-0000-0000-0000-000000000002"), Code = "Won", Name = "Won" },
                new() { Id = Guid.Parse("90000000-0000-0000-0000-000000000003"), Code = "Lost", Name = "Lost" }
            };
        }

        private static bool IsClosed(Opportunity opportunity)
        {
            return string.Equals(opportunity.Status, "Won", StringComparison.OrdinalIgnoreCase)
                || string.Equals(opportunity.Status, "Lost", StringComparison.OrdinalIgnoreCase);
        }

        private static string? Clean(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }
    }
}
