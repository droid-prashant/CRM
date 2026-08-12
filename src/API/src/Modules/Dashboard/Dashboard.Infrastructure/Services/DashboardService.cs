using Dashboard.Application.DTOs;
using Dashboard.Application.Services;
using Dashboard.Application.ViewModels;
using Dashboard.Infrastructure.Persistence;
using ERP.Identity.Constants;
using ERP.Identity.Services.Interfaces;
using Leads.Domain.Entities;
using Leads.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Opportunities.Domain.Entities;

namespace Dashboard.Infrastructure.Services
{
    public class DashboardService : IDashboardService
    {
        private const int RecentLimit = 10;
        private const int StaleClientDays = 30;

        private readonly DashboardDbContext _dbContext;
        private readonly IUserContextService _userContextService;

        public DashboardService(DashboardDbContext dbContext, IUserContextService userContextService)
        {
            _dbContext = dbContext;
            _userContextService = userContextService;
        }

        public async Task<DashboardViewModel> GetDashboardAsync(DashboardQueryRequest query, CancellationToken cancellationToken)
        {
            var scope = await BuildScopeAsync(cancellationToken);
            var scopedLeads = ApplyLeadFilters(BuildScopedLeadQuery(scope), query);
            var scopedOpportunities = ApplyOpportunityFilters(BuildScopedOpportunityQuery(scope), query);
            var scopedClients = ApplyClientFilters(BuildScopedClientQuery(scope), query);

            return new DashboardViewModel
            {
                Summary = await BuildSummaryAsync(scopedLeads, scopedClients, scopedOpportunities, cancellationToken),
                LeadAnalytics = await BuildLeadAnalyticsAsync(scopedLeads, scopedOpportunities, cancellationToken),
                ClientAnalytics = await BuildClientAnalyticsAsync(scopedClients, scope, cancellationToken),
                OpportunityAnalytics = await BuildOpportunityAnalyticsAsync(scopedOpportunities, cancellationToken),
                RecentActivities = await BuildRecentActivitiesAsync(scope, cancellationToken)
            };
        }

        public async Task<DashboardFilterOptionsViewModel> GetFilterOptionsAsync(CancellationToken cancellationToken)
        {
            var scope = await BuildScopeAsync(cancellationToken);
            var users = scope.CanSeeAll
                ? _dbContext.Users.AsNoTracking().Where(x => x.IsActive)
                : _dbContext.Users.AsNoTracking().Where(x => x.IsActive && scope.UserIds.Contains(x.Id));

            return new DashboardFilterOptionsViewModel
            {
                LeadSources = await _dbContext.LeadSources
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.Name)
                    .Select(x => new DashboardLookupViewModel { Id = x.Id, Name = x.Name })
                    .ToListAsync(cancellationToken),
                AssignedUsers = await users
                    .OrderBy(x => x.FullName)
                    .Select(x => new DashboardUserLookupViewModel { Id = x.Id, FullName = x.FullName })
                    .ToListAsync(cancellationToken),
                LeadStatuses = Enum.GetNames<LeadStatus>().ToList()
            };
        }

        private async Task<DashboardScope> BuildScopeAsync(CancellationToken cancellationToken)
        {
            var roles = _userContextService.GetUserRoles();
            var userId = _userContextService.GetUserId();
            var canSeeAll = roles.Contains(DefaultRoles.Admin, StringComparer.OrdinalIgnoreCase)
                || roles.Contains(DefaultRoles.SuperAdmin, StringComparer.OrdinalIgnoreCase);

            if (canSeeAll)
            {
                return new DashboardScope(true, new List<Guid>());
            }

            if (!userId.HasValue)
            {
                return new DashboardScope(false, new List<Guid>());
            }

            var userIds = new List<Guid> { userId.Value };
            if (roles.Contains(DefaultRoles.Manager, StringComparer.OrdinalIgnoreCase))
            {
                var directReports = await _dbContext.Users
                    .AsNoTracking()
                    .Where(x => x.ManagerId == userId.Value && x.IsActive)
                    .Select(x => x.Id)
                    .ToListAsync(cancellationToken);
                userIds.AddRange(directReports);
            }

            return new DashboardScope(false, userIds.Distinct().ToList());
        }

        private IQueryable<Lead> BuildScopedLeadQuery(DashboardScope scope)
        {
            var query = _dbContext.Leads.AsNoTracking().Where(x => x.IsActive);
            if (scope.CanSeeAll)
            {
                return query;
            }

            return query.Where(x => x.AssignedToUserId.HasValue && scope.UserIds.Contains(x.AssignedToUserId.Value));
        }

        private IQueryable<Opportunity> BuildScopedOpportunityQuery(DashboardScope scope)
        {
            var query = _dbContext.Opportunities.AsNoTracking().Where(x => x.IsActive);
            if (scope.CanSeeAll)
            {
                return query;
            }

            return query.Where(x => scope.UserIds.Contains(x.OwnerUserId));
        }

        private IQueryable<Clients.Domain.Entities.Client> BuildScopedClientQuery(DashboardScope scope)
        {
            var query = _dbContext.Clients.AsNoTracking().Where(x => !x.IsDeleted);
            if (scope.CanSeeAll)
            {
                return query;
            }

            var scopedLeadClientIds = BuildScopedLeadQuery(scope)
                .Where(x => x.ClientId.HasValue)
                .Select(x => x.ClientId!.Value);
            var scopedOpportunityClientIds = BuildScopedOpportunityQuery(scope)
                .Select(x => x.ClientId);

            return query.Where(x =>
                (x.AccountOwnerUserId.HasValue && scope.UserIds.Contains(x.AccountOwnerUserId.Value))
                || scopedLeadClientIds.Contains(x.Id)
                || scopedOpportunityClientIds.Contains(x.Id));
        }

        private static IQueryable<Lead> ApplyLeadFilters(IQueryable<Lead> query, DashboardQueryRequest request)
        {
            query = ApplyCreatedDateFilter(query, request);

            if (request.AssignedUserId.HasValue)
            {
                query = query.Where(x => x.AssignedToUserId == request.AssignedUserId.Value);
            }

            if (request.SourceId.HasValue)
            {
                query = query.Where(x => x.SourceId == request.SourceId.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<LeadStatus>(request.Status.Trim(), true, out var status))
            {
                query = query.Where(x => x.Status == status);
            }

            return query;
        }

        private static IQueryable<Opportunity> ApplyOpportunityFilters(IQueryable<Opportunity> query, DashboardQueryRequest request)
        {
            query = ApplyCreatedDateFilter(query, request);

            if (request.AssignedUserId.HasValue)
            {
                query = query.Where(x => x.OwnerUserId == request.AssignedUserId.Value);
            }

            var status = request.Status?.Trim();
            if (!string.IsNullOrWhiteSpace(status) && (status.Equals("Open", StringComparison.OrdinalIgnoreCase)
                || status.Equals("Won", StringComparison.OrdinalIgnoreCase)
                || status.Equals("Lost", StringComparison.OrdinalIgnoreCase)))
            {
                query = query.Where(x => x.Status.ToLower() == status.ToLower());
            }

            return query;
        }

        private static IQueryable<Clients.Domain.Entities.Client> ApplyClientFilters(IQueryable<Clients.Domain.Entities.Client> query, DashboardQueryRequest request)
        {
            return ApplyCreatedDateFilter(query, request);
        }

        private static IQueryable<T> ApplyCreatedDateFilter<T>(IQueryable<T> query, DashboardQueryRequest request) where T : ERP.Core.Entities.BaseEntity
        {
            if (request.FromDate.HasValue)
            {
                var from = DateTime.SpecifyKind(request.FromDate.Value.Date, DateTimeKind.Utc);
                query = query.Where(x => x.CreatedOn >= from);
            }

            if (request.ToDate.HasValue)
            {
                var to = DateTime.SpecifyKind(request.ToDate.Value.Date.AddDays(1), DateTimeKind.Utc);
                query = query.Where(x => x.CreatedOn < to);
            }

            return query;
        }

        private static async Task<DashboardSummaryViewModel> BuildSummaryAsync(
            IQueryable<Lead> leads,
            IQueryable<Clients.Domain.Entities.Client> clients,
            IQueryable<Opportunity> opportunities,
            CancellationToken cancellationToken)
        {
            return new DashboardSummaryViewModel
            {
                TotalLeads = await leads.CountAsync(cancellationToken),
                NewLeads = await leads.CountAsync(x => x.Status == LeadStatus.New, cancellationToken),
                QualifiedLeads = await leads.CountAsync(x => x.Status == LeadStatus.Qualified, cancellationToken),
                DisqualifiedLeads = await leads.CountAsync(x => x.Status == LeadStatus.Disqualified, cancellationToken),
                AssignedLeads = await leads.CountAsync(x => x.Status == LeadStatus.Assigned, cancellationToken),
                ConvertedLeads = await leads.CountAsync(x => x.Status == LeadStatus.Converted, cancellationToken),
                TotalClients = await clients.CountAsync(cancellationToken),
                ActiveClients = await clients.CountAsync(x => x.IsActive && !x.IsDeleted, cancellationToken),
                TotalOpportunities = await opportunities.CountAsync(cancellationToken),
                OpenOpportunities = await opportunities.CountAsync(x => x.Status.ToLower() == "open", cancellationToken),
                WonOpportunities = await opportunities.CountAsync(x => x.Status.ToLower() == "won" || x.Stage.ToLower() == "won", cancellationToken),
                LostOpportunities = await opportunities.CountAsync(x => x.Status.ToLower() == "lost" || x.Stage.ToLower() == "lost", cancellationToken)
            };
        }

        private async Task<LeadAnalyticsViewModel> BuildLeadAnalyticsAsync(IQueryable<Lead> leads, IQueryable<Opportunity> opportunities, CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var total = await leads.CountAsync(cancellationToken);
            var converted = await leads.CountAsync(x => x.Status == LeadStatus.Converted, cancellationToken);

            var sourceRows = await leads
                .GroupBy(x => x.SourceId)
                .Select(x => new { SourceId = x.Key, Count = x.Count() })
                .OrderByDescending(x => x.Count)
                .ToListAsync(cancellationToken);
            var sourceIds = sourceRows.Select(x => x.SourceId).ToList();
            var sources = await _dbContext.LeadSources
                .AsNoTracking()
                .Where(x => sourceIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Name, cancellationToken);

            var monthlyRows = await leads
                .Where(x => x.CreatedOn >= monthStart.AddMonths(-11))
                .GroupBy(x => new { x.CreatedOn.Year, x.CreatedOn.Month })
                .Select(x => new { x.Key.Year, x.Key.Month, Count = x.Count() })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync(cancellationToken);

            return new LeadAnalyticsViewModel
            {
                SalesFunnel = await BuildSalesFunnelAsync(leads, opportunities, cancellationToken),
                LeadsByStatus = await leads
                    .GroupBy(x => x.Status)
                    .Select(x => new ChartPointViewModel { Label = x.Key.ToString(), Count = x.Count() })
                    .ToListAsync(cancellationToken),
                LeadsBySource = sourceRows
                    .Select(x => new ChartPointViewModel { Label = sources.GetValueOrDefault(x.SourceId) ?? "Unknown", Count = x.Count })
                    .ToList(),
                MonthlyLeadTrend = monthlyRows
                    .Select(x => new MonthlyTrendViewModel { Month = new DateTime(x.Year, x.Month, 1).ToString("MMM yyyy"), Count = x.Count })
                    .ToList(),
                LeadsCreatedThisMonth = await leads.CountAsync(x => x.CreatedOn >= monthStart, cancellationToken),
                QualifiedLeads = await leads.CountAsync(x => x.Status == LeadStatus.Qualified, cancellationToken),
                DisqualifiedLeads = await leads.CountAsync(x => x.Status == LeadStatus.Disqualified, cancellationToken),
                AssignedLeads = await leads.CountAsync(x => x.AssignedToUserId.HasValue, cancellationToken),
                UnassignedLeads = await leads.CountAsync(x => !x.AssignedToUserId.HasValue, cancellationToken),
                LeadConversionRate = total == 0 ? 0 : Math.Round((decimal)converted / total * 100, 2)
            };
        }

        private async Task<List<ChartPointViewModel>> BuildSalesFunnelAsync(IQueryable<Lead> leads, IQueryable<Opportunity> opportunities, CancellationToken cancellationToken)
        {
            var leadSnapshots = await leads
                .Select(x => new
                {
                    x.Id,
                    x.Status,
                    x.AssignedToUserId,
                    x.ConvertedOpportunityId
                })
                .ToListAsync(cancellationToken);

            var leadIds = leadSnapshots.Select(x => x.Id).ToList();
            var qualifiedLeadIds = leadSnapshots
                .Where(x => x.Status == LeadStatus.Qualified
                    || x.Status == LeadStatus.Assigned
                    || x.Status == LeadStatus.Converted
                    || x.AssignedToUserId.HasValue
                    || x.ConvertedOpportunityId.HasValue)
                .Select(x => x.Id)
                .ToHashSet();
            var assignedLeadIds = leadSnapshots
                .Where(x => x.Status == LeadStatus.Assigned
                    || x.AssignedToUserId.HasValue
                    || x.ConvertedOpportunityId.HasValue)
                .Select(x => x.Id)
                .ToHashSet();
            var opportunityLeadIds = leadSnapshots
                .Where(x => x.Status == LeadStatus.Converted || x.ConvertedOpportunityId.HasValue)
                .Select(x => x.Id)
                .ToHashSet();

            if (leadIds.Count > 0)
            {
                foreach (var id in await _dbContext.LeadTimelineEntries
                             .AsNoTracking()
                             .Where(x => x.IsActive
                                 && leadIds.Contains(x.LeadId)
                                 && x.EventType == "LeadStatusChanged"
                                 && x.Description.Contains("NewStatus=Qualified"))
                             .Select(x => x.LeadId)
                             .Distinct()
                             .ToListAsync(cancellationToken))
                {
                    qualifiedLeadIds.Add(id);
                }

                foreach (var id in await _dbContext.LeadTimelineEntries
                             .AsNoTracking()
                             .Where(x => x.IsActive
                                 && leadIds.Contains(x.LeadId)
                                 && x.EventType == "LeadAssigned")
                             .Select(x => x.LeadId)
                             .Distinct()
                             .ToListAsync(cancellationToken))
                {
                    assignedLeadIds.Add(id);
                    qualifiedLeadIds.Add(id);
                }

                foreach (var id in await _dbContext.LeadTimelineEntries
                             .AsNoTracking()
                             .Where(x => x.IsActive
                                 && leadIds.Contains(x.LeadId)
                                 && x.EventType == "LeadConverted")
                             .Select(x => x.LeadId)
                             .Distinct()
                             .ToListAsync(cancellationToken))
                {
                    opportunityLeadIds.Add(id);
                    assignedLeadIds.Add(id);
                    qualifiedLeadIds.Add(id);
                }
            }

            var convertedOpportunityIds = leadSnapshots
                .Where(x => x.ConvertedOpportunityId.HasValue)
                .Select(x => x.ConvertedOpportunityId!.Value)
                .Distinct()
                .ToList();
            var wonOpportunityIds = new HashSet<Guid>();

            if (convertedOpportunityIds.Count > 0)
            {
                var visibleConvertedOpportunityIds = await opportunities
                    .Where(x => convertedOpportunityIds.Contains(x.Id))
                    .Select(x => x.Id)
                    .Distinct()
                    .ToListAsync(cancellationToken);

                foreach (var id in await opportunities
                             .Where(x => visibleConvertedOpportunityIds.Contains(x.Id)
                                 && (x.Status.ToLower() == "won" || x.Stage.ToLower() == "won"))
                             .Select(x => x.Id)
                             .Distinct()
                             .ToListAsync(cancellationToken))
                {
                    wonOpportunityIds.Add(id);
                }

                var wonStageIds = await _dbContext.OpportunityStages
                    .AsNoTracking()
                    .Where(x => x.IsActive && !x.IsDeleted && x.IsWonStage)
                    .Select(x => x.Id)
                    .ToListAsync(cancellationToken);

                if (wonStageIds.Count > 0)
                {
                    foreach (var id in await _dbContext.OpportunityStageHistories
                                 .AsNoTracking()
                                 .Where(x => x.IsActive
                                     && visibleConvertedOpportunityIds.Contains(x.OpportunityId)
                                     && wonStageIds.Contains(x.ToStageId))
                                 .Select(x => x.OpportunityId)
                                 .Distinct()
                                 .ToListAsync(cancellationToken))
                    {
                        wonOpportunityIds.Add(id);
                    }
                }
            }

            return new List<ChartPointViewModel>
            {
                new() { Label = "Lead", Count = leadSnapshots.Count },
                new() { Label = "Qualified", Count = qualifiedLeadIds.Count },
                new() { Label = "Assigned", Count = assignedLeadIds.Count },
                new() { Label = "Opportunity", Count = opportunityLeadIds.Count },
                new() { Label = "Won", Count = wonOpportunityIds.Count }
            };
        }

        private async Task<ClientAnalyticsViewModel> BuildClientAnalyticsAsync(
            IQueryable<Clients.Domain.Entities.Client> clients,
            DashboardScope scope,
            CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var staleCutoff = now.AddDays(-StaleClientDays);
            var clientIds = clients.Select(x => x.Id);

            var productRows = await _dbContext.ClientProducts
                .AsNoTracking()
                .Where(x => !x.IsDeleted && clientIds.Contains(x.ClientId))
                .GroupBy(x => x.ProductId)
                .Select(x => new { ProductId = x.Key, Count = x.Count() })
                .OrderByDescending(x => x.Count)
                .Take(8)
                .ToListAsync(cancellationToken);
            var productIds = productRows.Select(x => x.ProductId).ToList();
            var products = await _dbContext.Products
                .AsNoTracking()
                .Where(x => productIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Name, cancellationToken);

            var monthlyRows = await clients
                .Where(x => x.CreatedOn >= monthStart.AddMonths(-11))
                .GroupBy(x => new { x.CreatedOn.Year, x.CreatedOn.Month })
                .Select(x => new { x.Key.Year, x.Key.Month, Count = x.Count() })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync(cancellationToken);

            var activeClientIds = await clients.Select(x => x.Id).ToListAsync(cancellationToken);
            var recentlyActiveClientIds = await GetRecentlyActiveClientIdsAsync(activeClientIds, staleCutoff, cancellationToken);

            return new ClientAnalyticsViewModel
            {
                TotalClients = await clients.CountAsync(cancellationToken),
                NewClientsThisMonth = await clients.CountAsync(x => x.CreatedOn >= monthStart, cancellationToken),
                ActiveClients = await clients.CountAsync(x => x.IsActive && !x.IsDeleted, cancellationToken),
                InactiveClients = await clients.CountAsync(x => !x.IsActive || x.IsDeleted, cancellationToken),
                ClientsByProduct = productRows
                    .Select(x => new ChartPointViewModel { Label = products.GetValueOrDefault(x.ProductId) ?? "Unknown", Count = x.Count })
                    .ToList(),
                RecentlyAddedClients = await clients
                    .OrderByDescending(x => x.CreatedOn)
                    .Take(RecentLimit)
                    .Select(x => new DashboardEntityLinkViewModel
                    {
                        Id = x.Id,
                        Label = x.Name,
                        Subtitle = x.ClientCode,
                        Date = x.CreatedOn
                    })
                    .ToListAsync(cancellationToken),
                ClientsWithoutRecentActivity = await clients
                    .Where(x => !recentlyActiveClientIds.Contains(x.Id))
                    .OrderBy(x => x.Name)
                    .Take(RecentLimit)
                    .Select(x => new DashboardEntityLinkViewModel
                    {
                        Id = x.Id,
                        Label = x.Name,
                        Subtitle = x.ClientCode,
                        Date = x.CreatedOn
                    })
                    .ToListAsync(cancellationToken),
                ClientGrowthTrend = monthlyRows
                    .Select(x => new MonthlyTrendViewModel { Month = new DateTime(x.Year, x.Month, 1).ToString("MMM yyyy"), Count = x.Count })
                    .ToList()
            };
        }

        private async Task<OpportunityAnalyticsViewModel> BuildOpportunityAnalyticsAsync(IQueryable<Opportunity> opportunities, CancellationToken cancellationToken)
        {
            var stageRows = await opportunities
                .GroupBy(x => new { x.StageId, x.Stage, x.CurrencyId })
                .Select(x => new { x.Key.StageId, x.Key.Stage, x.Key.CurrencyId, Count = x.Count(), Value = x.Sum(o => o.EstimatedValue) })
                .OrderByDescending(x => x.Count)
                .ToListAsync(cancellationToken);
            var stageIds = stageRows.Select(x => x.StageId).ToList();
            var stages = await _dbContext.OpportunityStages
                .AsNoTracking()
                .Where(x => stageIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Name, cancellationToken);

            var total = await opportunities.CountAsync(cancellationToken);
            var won = await opportunities.CountAsync(x => x.Status.ToLower() == "won" || x.Stage.ToLower() == "won", cancellationToken);

            return new OpportunityAnalyticsViewModel
            {
                OpportunitiesByStage = stageRows
                    .GroupBy(x => new { x.StageId, x.Stage })
                    .Select(x => new ChartPointViewModel
                    {
                        Label = stages.GetValueOrDefault(x.Key.StageId) ?? x.Key.Stage,
                        Count = x.Sum(row => row.Count),
                        Value = x.Sum(row => row.Value),
                        Amounts = x
                            .GroupBy(row => row.CurrencyId)
                            .Select(row => new CurrencyAmountViewModel
                            {
                                CurrencyCode = GetCurrencyCode(row.Key),
                                Amount = row.Sum(item => item.Value)
                            })
                            .Where(row => !string.IsNullOrWhiteSpace(row.CurrencyCode))
                            .OrderBy(row => row.CurrencyCode)
                            .ToList()
                    })
                    .OrderByDescending(x => x.Count)
                    .ToList(),
                OpenPipelineValue = await opportunities.Where(x => x.Status.ToLower() == "open").SumAsync(x => x.EstimatedValue, cancellationToken),
                OpenPipelineValues = await BuildCurrencyAmountsAsync(opportunities.Where(x => x.Status.ToLower() == "open"), false, cancellationToken),
                WonDealValue = await opportunities.Where(x => x.Status.ToLower() == "won" || x.Stage.ToLower() == "won").SumAsync(x => x.FinalAmount ?? x.EstimatedValue, cancellationToken),
                WonDealValues = await BuildCurrencyAmountsAsync(opportunities.Where(x => x.Status.ToLower() == "won" || x.Stage.ToLower() == "won"), true, cancellationToken),
                LostDealValue = await opportunities.Where(x => x.Status.ToLower() == "lost" || x.Stage.ToLower() == "lost").SumAsync(x => x.FinalAmount ?? x.EstimatedValue, cancellationToken),
                LostDealValues = await BuildCurrencyAmountsAsync(opportunities.Where(x => x.Status.ToLower() == "lost" || x.Stage.ToLower() == "lost"), true, cancellationToken),
                ExpectedRevenue = await opportunities.Where(x => x.Status.ToLower() == "open").SumAsync(x => x.EstimatedValue, cancellationToken),
                ExpectedRevenues = await BuildCurrencyAmountsAsync(opportunities.Where(x => x.Status.ToLower() == "open"), false, cancellationToken),
                OpportunityConversionRate = total == 0 ? 0 : Math.Round((decimal)won / total * 100, 2),
                TopOpportunitiesByValue = await opportunities
                    .OrderByDescending(x => x.EstimatedValue)
                    .Take(RecentLimit)
                    .Select(x => new OpportunityHighlightViewModel
                    {
                        Id = x.Id,
                        OpportunityNumber = x.OpportunityNumber,
                        Title = x.Title,
                        Stage = x.Stage,
                        EstimatedValue = x.EstimatedValue,
                        CurrencyCode = GetCurrencyCode(x.CurrencyId),
                        ExpectedCloseDate = x.ExpectedCloseDate
                    })
                    .ToListAsync(cancellationToken),
                OpportunitiesClosingSoon = await opportunities
                    .Where(x => x.ExpectedCloseDate.HasValue && x.ExpectedCloseDate.Value >= DateTime.UtcNow && x.ExpectedCloseDate.Value <= DateTime.UtcNow.AddDays(30) && x.Stage != "Won" &&
                            x.Stage != "Lost")
                    .OrderBy(x => x.ExpectedCloseDate)
                    .Take(RecentLimit)
                    .Select(x => new OpportunityHighlightViewModel
                    {
                        Id = x.Id,
                        OpportunityNumber = x.OpportunityNumber,
                        Title = x.Title,
                        Stage = x.Stage,
                        EstimatedValue = x.EstimatedValue,
                        CurrencyCode = GetCurrencyCode(x.CurrencyId),
                        ExpectedCloseDate = x.ExpectedCloseDate
                    })
                    .ToListAsync(cancellationToken),
                WonVsLost = new List<ChartPointViewModel>
                {
                    new() { Label = "Won", Count = won },
                    new() { Label = "Lost", Count = await opportunities.CountAsync(x => x.Status.ToLower() == "lost" || x.Stage.ToLower() == "lost", cancellationToken) }
                }
            };
        }

        private static async Task<List<CurrencyAmountViewModel>> BuildCurrencyAmountsAsync(IQueryable<Opportunity> opportunities, bool useFinalAmount, CancellationToken cancellationToken)
        {
            var rows = useFinalAmount
                ? await opportunities
                    .GroupBy(x => x.CurrencyId)
                    .Select(x => new { CurrencyId = x.Key, Amount = x.Sum(o => o.FinalAmount ?? o.EstimatedValue) })
                    .ToListAsync(cancellationToken)
                : await opportunities
                    .GroupBy(x => x.CurrencyId)
                    .Select(x => new { CurrencyId = x.Key, Amount = x.Sum(o => o.EstimatedValue) })
                    .ToListAsync(cancellationToken);

            return rows
                .Select(x => new CurrencyAmountViewModel
                {
                    CurrencyCode = GetCurrencyCode(x.CurrencyId),
                    Amount = x.Amount
                })
                .Where(x => !string.IsNullOrWhiteSpace(x.CurrencyCode))
                .OrderBy(x => x.CurrencyCode)
                .ToList();
        }

        private static string GetCurrencyCode(Guid currencyId)
        {
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000001")) return "NPR";
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000002")) return "USD";
            if (currencyId == Guid.Parse("70000000-0000-0000-0000-000000000003")) return "INR";

            return string.Empty;
        }

        private async Task<RecentActivitiesViewModel> BuildRecentActivitiesAsync(DashboardScope scope, CancellationToken cancellationToken)
        {
            var leads = BuildScopedLeadQuery(scope);
            var opportunities = BuildScopedOpportunityQuery(scope);
            var clients = BuildScopedClientQuery(scope);
            var leadIds = leads.Select(x => x.Id);
            var opportunityIds = opportunities.Select(x => x.Id);
            var clientIds = clients.Select(x => x.Id);

            var activities = new List<ActivityItemViewModel>();
            activities.AddRange(await leads
                .OrderByDescending(x => x.CreatedOn)
                .Take(RecentLimit)
                .Select(x => new ActivityItemViewModel
                {
                    Id = x.Id,
                    Type = "LeadCreated",
                    Title = x.LeadNumber,
                    Description = x.CompanyName,
                    Date = x.CreatedOn,
                    RelatedEntityId = x.Id,
                    RelatedEntityType = "Lead"
                })
                .ToListAsync(cancellationToken));
            activities.AddRange(await clients
                .OrderByDescending(x => x.CreatedOn)
                .Take(RecentLimit)
                .Select(x => new ActivityItemViewModel
                {
                    Id = x.Id,
                    Type = "ClientCreated",
                    Title = x.Name,
                    Description = x.ClientCode,
                    Date = x.CreatedOn,
                    RelatedEntityId = x.Id,
                    RelatedEntityType = "Client"
                })
                .ToListAsync(cancellationToken));
            activities.AddRange(await _dbContext.LeadTimelineEntries
                .AsNoTracking()
                .Where(x => x.IsActive && leadIds.Contains(x.LeadId))
                .OrderByDescending(x => x.CreatedOn)
                .Take(RecentLimit)
                .Select(x => new ActivityItemViewModel
                {
                    Id = x.Id,
                    Type = x.EventType,
                    Title = "Lead timeline",
                    Description = x.Description,
                    Date = x.CreatedOn,
                    RelatedEntityId = x.LeadId,
                    RelatedEntityType = "Lead"
                })
                .ToListAsync(cancellationToken));
            activities.AddRange(await _dbContext.ClientTimelineEntries
                .AsNoTracking()
                .Where(x => x.IsActive && clientIds.Contains(x.ClientId))
                .OrderByDescending(x => x.CreatedOn)
                .Take(RecentLimit)
                .Select(x => new ActivityItemViewModel
                {
                    Id = x.Id,
                    Type = x.EventType,
                    Title = "Client timeline",
                    Description = x.Description,
                    Date = x.CreatedOn,
                    RelatedEntityId = x.ClientId,
                    RelatedEntityType = "Client"
                })
                .ToListAsync(cancellationToken));
            activities.AddRange(await _dbContext.OpportunityStageHistories
                .AsNoTracking()
                .Where(x => x.IsActive && opportunityIds.Contains(x.OpportunityId))
                .OrderByDescending(x => x.CreatedOn)
                .Take(RecentLimit)
                .Select(x => new ActivityItemViewModel
                {
                    Id = x.Id,
                    Type = "OpportunityStageChanged",
                    Title = "Opportunity stage changed",
                    Description = x.Remarks,
                    Date = x.CreatedOn,
                    RelatedEntityId = x.OpportunityId,
                    RelatedEntityType = "Opportunity"
                })
                .ToListAsync(cancellationToken));

            var now = DateTime.UtcNow;
            var pendingFollowUps = new List<ActivityItemViewModel>();
            pendingFollowUps.AddRange(await _dbContext.LeadInteractions
                .AsNoTracking()
                .Where(x => x.IsActive && x.NextFollowUpDate.HasValue && x.NextFollowUpDate.Value >= now && leadIds.Contains(x.LeadId))
                .OrderBy(x => x.NextFollowUpDate)
                .Take(RecentLimit)
                .Select(x => new ActivityItemViewModel
                {
                    Id = x.Id,
                    Type = "LeadFollowUp",
                    Title = x.Subject ?? "Lead follow-up",
                    Description = x.Notes,
                    Date = x.NextFollowUpDate!.Value,
                    RelatedEntityId = x.LeadId,
                    RelatedEntityType = "Lead"
                })
                .ToListAsync(cancellationToken));
            pendingFollowUps.AddRange(await _dbContext.OpportunityActivities
                .AsNoTracking()
                .Where(x => x.IsActive && x.FollowUpDate.HasValue && x.FollowUpDate.Value >= now && opportunityIds.Contains(x.OpportunityId))
                .OrderBy(x => x.FollowUpDate)
                .Take(RecentLimit)
                .Select(x => new ActivityItemViewModel
                {
                    Id = x.Id,
                    Type = "OpportunityFollowUp",
                    Title = x.Subject ?? "Opportunity follow-up",
                    Description = x.Notes,
                    Date = x.FollowUpDate!.Value,
                    RelatedEntityId = x.OpportunityId,
                    RelatedEntityType = "Opportunity"
                })
                .ToListAsync(cancellationToken));

            return new RecentActivitiesViewModel
            {
                LatestActivities = activities.OrderByDescending(x => x.Date).Take(RecentLimit).ToList(),
                PendingFollowUps = pendingFollowUps.OrderBy(x => x.Date).Take(RecentLimit).ToList()
            };
        }

        private async Task<HashSet<Guid>> GetRecentlyActiveClientIdsAsync(List<Guid> clientIds, DateTime cutoff, CancellationToken cancellationToken)
        {
            var recentClientIds = new HashSet<Guid>();

            foreach (var id in await _dbContext.ClientTimelineEntries.AsNoTracking()
                         .Where(x => x.CreatedOn >= cutoff && clientIds.Contains(x.ClientId))
                         .Select(x => x.ClientId)
                         .Distinct()
                         .ToListAsync(cancellationToken))
            {
                recentClientIds.Add(id);
            }

            foreach (var id in await _dbContext.LeadTimelineEntries.AsNoTracking()
                         .Join(_dbContext.Leads.AsNoTracking(), timeline => timeline.LeadId, lead => lead.Id, (timeline, lead) => new { timeline, lead })
                         .Where(x => x.timeline.CreatedOn >= cutoff && x.lead.ClientId.HasValue && clientIds.Contains(x.lead.ClientId.Value))
                         .Select(x => x.lead.ClientId!.Value)
                         .Distinct()
                         .ToListAsync(cancellationToken))
            {
                recentClientIds.Add(id);
            }

            foreach (var id in await _dbContext.OpportunityStageHistories.AsNoTracking()
                         .Join(_dbContext.Opportunities.AsNoTracking(), history => history.OpportunityId, opportunity => opportunity.Id, (history, opportunity) => new { history, opportunity })
                         .Where(x => x.history.CreatedOn >= cutoff && clientIds.Contains(x.opportunity.ClientId))
                         .Select(x => x.opportunity.ClientId)
                         .Distinct()
                         .ToListAsync(cancellationToken))
            {
                recentClientIds.Add(id);
            }

            return recentClientIds;
        }

        private sealed record DashboardScope(bool CanSeeAll, List<Guid> UserIds);
    }
}
