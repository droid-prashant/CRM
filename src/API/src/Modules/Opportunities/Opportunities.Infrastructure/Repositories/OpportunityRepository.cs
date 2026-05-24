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
        private static readonly Guid WonStageId = Guid.Parse("80000000-0000-0000-0000-000000000005");
        private static readonly Guid LostStageId = Guid.Parse("80000000-0000-0000-0000-000000000006");

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
                Clients = await _dbContext.Clients
                    .AsNoTracking()
                    .Include(x => x.Country)
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.Name)
                    .Select(x => new OpportunityClientLookupViewModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Country = x.Country != null ? x.Country.Name : string.Empty
                    })
                    .ToListAsync(cancellationToken),
                Contacts = await _dbContext.ClientContacts
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.FirstName)
                    .ThenBy(x => x.LastName)
                    .Select(x => new OpportunityContactLookupViewModel
                    {
                        Id = x.Id,
                        ClientId = x.ClientId,
                        FullName = (x.FirstName + " " + x.LastName).Trim(),
                        Email = x.Email
                    })
                    .ToListAsync(cancellationToken),
                Products = await _dbContext.Products
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.Name)
                    .Select(x => new OpportunityLookupItemViewModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Code = x.Code
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

            _dbContext.OpportunityStageHistories.Add(new OpportunityStageHistory
            {
                OpportunityId = opportunity.Id,
                FromStageId = fromStageId,
                ToStageId = targetStage.Id,
                Remarks = Clean(request.Remarks)
            });

            await _dbContext.SaveChangesAsync(cancellationToken);
            return await MapOpportunityAsync(opportunity, cancellationToken);
        }

        public Task<OpportunityListItemViewModel?> CloseAsWonAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return CloseOpportunityAsync(id, WonStageId, "Won", request, cancellationToken);
        }

        public Task<OpportunityListItemViewModel?> CloseAsLostAsync(Guid id, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            return CloseOpportunityAsync(id, LostStageId, "Lost", request, cancellationToken);
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

        public Task<bool> ClientExistsAsync(Guid clientId, CancellationToken cancellationToken)
        {
            return _dbContext.Clients.AnyAsync(x => x.Id == clientId && x.IsActive, cancellationToken);
        }

        public Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken)
        {
            return _dbContext.Products.AnyAsync(x => x.Id == productId && x.IsActive, cancellationToken);
        }

        public Task<bool> LeadExistsAsync(Guid leadId, CancellationToken cancellationToken)
        {
            return _dbContext.Leads.AnyAsync(x => x.Id == leadId && x.IsActive, cancellationToken);
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

        public Task<bool> StageExistsAsync(Guid stageId, CancellationToken cancellationToken)
        {
            return GetActiveStagesQuery().AnyAsync(x => x.Id == stageId, cancellationToken);
        }

        private async Task<OpportunityListItemViewModel?> CloseOpportunityAsync(Guid id, Guid stageId, string status, CloseOpportunityRequest request, CancellationToken cancellationToken)
        {
            var opportunity = await BaseOpportunityQuery()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            var targetStage = await GetActiveStagesQuery()
                .FirstOrDefaultAsync(x => x.Id == stageId, cancellationToken);

            if (opportunity == null || targetStage == null || IsClosed(opportunity))
            {
                return null;
            }

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
            var clientName = await _dbContext.Clients
                .Where(x => x.Id == opportunity.ClientId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken);

            var productName = await _dbContext.Products
                .Where(x => x.Id == opportunity.ProductId)
                .Select(x => x.Name)
                .FirstOrDefaultAsync(cancellationToken);

            var contactName = await _dbContext.ClientContacts
                .Where(x => x.Id == opportunity.ContactId)
                .Select(x => (x.FirstName + " " + x.LastName).Trim())
                .FirstOrDefaultAsync(cancellationToken);

            var leadNumber = opportunity.LeadId.HasValue
                ? await _dbContext.Leads.Where(x => x.Id == opportunity.LeadId.Value).Select(x => x.LeadNumber).FirstOrDefaultAsync(cancellationToken)
                : null;

            var stage = opportunity.CurrentStage ?? await _dbContext.OpportunityStages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == opportunity.StageId, cancellationToken);

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
                LostReason = opportunity.LostReason
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
                var matchingClientIds = _dbContext.Clients
                    .Where(x => x.Name.ToLower().Contains(searchTerm))
                    .Select(x => x.Id);
                var matchingProductIds = _dbContext.Products
                    .Where(x => x.Name.ToLower().Contains(searchTerm) || x.Code.ToLower().Contains(searchTerm))
                    .Select(x => x.Id);
                var matchingContactIds = _dbContext.ClientContacts
                    .Where(x => (x.FirstName + " " + x.LastName).ToLower().Contains(searchTerm) || (x.Email != null && x.Email.ToLower().Contains(searchTerm)))
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
                    || (x.LeadId.HasValue && matchingLeadIds.Contains(x.LeadId.Value)));
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
