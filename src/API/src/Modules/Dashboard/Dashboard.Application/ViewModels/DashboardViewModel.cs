namespace Dashboard.Application.ViewModels
{
    public class DashboardViewModel
    {
        public DashboardSummaryViewModel Summary { get; set; } = new();
        public LeadAnalyticsViewModel LeadAnalytics { get; set; } = new();
        public ClientAnalyticsViewModel ClientAnalytics { get; set; } = new();
        public OpportunityAnalyticsViewModel OpportunityAnalytics { get; set; } = new();
        public RecentActivitiesViewModel RecentActivities { get; set; } = new();
    }

    public class DashboardSummaryViewModel
    {
        public int TotalLeads { get; set; }
        public int NewLeads { get; set; }
        public int QualifiedLeads { get; set; }
        public int DisqualifiedLeads { get; set; }
        public int AssignedLeads { get; set; }
        public int ConvertedLeads { get; set; }
        public int TotalClients { get; set; }
        public int ActiveClients { get; set; }
        public int TotalOpportunities { get; set; }
        public int OpenOpportunities { get; set; }
        public int WonOpportunities { get; set; }
        public int LostOpportunities { get; set; }
    }

    public class LeadAnalyticsViewModel
    {
        public List<ChartPointViewModel> SalesFunnel { get; set; } = new();
        public List<ChartPointViewModel> LeadsByStatus { get; set; } = new();
        public List<ChartPointViewModel> LeadsBySource { get; set; } = new();
        public List<MonthlyTrendViewModel> MonthlyLeadTrend { get; set; } = new();
        public int LeadsCreatedThisMonth { get; set; }
        public int QualifiedLeads { get; set; }
        public int DisqualifiedLeads { get; set; }
        public int AssignedLeads { get; set; }
        public int UnassignedLeads { get; set; }
        public decimal LeadConversionRate { get; set; }
    }

    public class ClientAnalyticsViewModel
    {
        public int TotalClients { get; set; }
        public int NewClientsThisMonth { get; set; }
        public int ActiveClients { get; set; }
        public int InactiveClients { get; set; }
        public List<ChartPointViewModel> ClientsByProduct { get; set; } = new();
        public List<DashboardEntityLinkViewModel> RecentlyAddedClients { get; set; } = new();
        public List<MonthlyTrendViewModel> ClientGrowthTrend { get; set; } = new();
    }

    public class OpportunityAnalyticsViewModel
    {
        public List<ChartPointViewModel> OpportunitiesByStage { get; set; } = new();
        public decimal OpenPipelineValue { get; set; }
        public List<CurrencyAmountViewModel> OpenPipelineValues { get; set; } = new();
        public decimal WonDealValue { get; set; }
        public List<CurrencyAmountViewModel> WonDealValues { get; set; } = new();
        public decimal LostDealValue { get; set; }
        public List<CurrencyAmountViewModel> LostDealValues { get; set; } = new();
        public decimal ExpectedRevenue { get; set; }
        public List<CurrencyAmountViewModel> ExpectedRevenues { get; set; } = new();
        public decimal OpportunityConversionRate { get; set; }
        public List<OpportunityHighlightViewModel> TopOpportunitiesByValue { get; set; } = new();
        public List<OpportunityHighlightViewModel> OpportunitiesClosingSoon { get; set; } = new();
        public List<ChartPointViewModel> WonVsLost { get; set; } = new();
    }

    public class RecentActivitiesViewModel
    {
        public List<ActivityItemViewModel> LatestActivities { get; set; } = new();
        public List<ActivityItemViewModel> PendingFollowUps { get; set; } = new();
    }

    public class ChartPointViewModel
    {
        public string Label { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Value { get; set; }
        public List<CurrencyAmountViewModel> Amounts { get; set; } = new();
    }

    public class CurrencyAmountViewModel
    {
        public string CurrencyCode { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class MonthlyTrendViewModel
    {
        public string Month { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class DashboardEntityLinkViewModel
    {
        public Guid Id { get; set; }
        public string Label { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public DateTime Date { get; set; }
    }

    public class OpportunityHighlightViewModel
    {
        public Guid Id { get; set; }
        public string OpportunityNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public DateTime? ExpectedCloseDate { get; set; }
    }

    public class ActivityItemViewModel
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public Guid? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; }
    }

    public class DashboardFilterOptionsViewModel
    {
        public List<DashboardLookupViewModel> LeadSources { get; set; } = new();
        public List<DashboardUserLookupViewModel> AssignedUsers { get; set; } = new();
        public List<string> LeadStatuses { get; set; } = new();
    }

    public class DashboardLookupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class DashboardUserLookupViewModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
    }
}
