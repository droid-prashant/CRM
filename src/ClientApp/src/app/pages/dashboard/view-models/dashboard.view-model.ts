export interface DashboardViewModel {
    summary: DashboardSummaryViewModel;
    leadAnalytics: LeadAnalyticsViewModel;
    clientAnalytics: ClientAnalyticsViewModel;
    opportunityAnalytics: OpportunityAnalyticsViewModel;
    recentActivities: RecentActivitiesViewModel;
}

export interface DashboardFilterOptionsViewModel {
    leadSources: DashboardLookupViewModel[];
    assignedUsers: DashboardUserLookupViewModel[];
    leadStatuses: string[];
}

export interface DashboardLookupViewModel {
    id: string;
    name: string;
}

export interface DashboardUserLookupViewModel {
    id: string;
    fullName: string;
}

export interface DashboardSummaryViewModel {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    disqualifiedLeads: number;
    assignedLeads: number;
    convertedLeads: number;
    totalClients: number;
    activeClients: number;
    totalOpportunities: number;
    openOpportunities: number;
    wonOpportunities: number;
    lostOpportunities: number;
}

export interface LeadAnalyticsViewModel {
    salesFunnel: ChartPointViewModel[];
    leadsByStatus: ChartPointViewModel[];
    leadsBySource: ChartPointViewModel[];
    monthlyLeadTrend: MonthlyTrendViewModel[];
    leadsCreatedThisMonth: number;
    qualifiedLeads: number;
    disqualifiedLeads: number;
    assignedLeads: number;
    unassignedLeads: number;
    leadConversionRate: number;
}

export interface ClientAnalyticsViewModel {
    totalClients: number;
    newClientsThisMonth: number;
    activeClients: number;
    inactiveClients: number;
    clientsByProduct: ChartPointViewModel[];
    recentlyAddedClients: DashboardEntityLinkViewModel[];
    clientsWithoutRecentActivity: DashboardEntityLinkViewModel[];
    clientGrowthTrend: MonthlyTrendViewModel[];
}

export interface OpportunityAnalyticsViewModel {
    opportunitiesByStage: ChartPointViewModel[];
    openPipelineValue: number;
    openPipelineValues: CurrencyAmountViewModel[];
    wonDealValue: number;
    wonDealValues: CurrencyAmountViewModel[];
    lostDealValue: number;
    lostDealValues: CurrencyAmountViewModel[];
    expectedRevenue: number;
    expectedRevenues: CurrencyAmountViewModel[];
    opportunityConversionRate: number;
    topOpportunitiesByValue: OpportunityHighlightViewModel[];
    opportunitiesClosingSoon: OpportunityHighlightViewModel[];
    wonVsLost: ChartPointViewModel[];
}

export interface RecentActivitiesViewModel {
    latestActivities: ActivityItemViewModel[];
    pendingFollowUps: ActivityItemViewModel[];
}

export interface ChartPointViewModel {
    label: string;
    count: number;
    value: number;
    amounts: CurrencyAmountViewModel[];
}

export interface CurrencyAmountViewModel {
    currencyCode: string;
    amount: number;
}

export interface MonthlyTrendViewModel {
    month: string;
    count: number;
}

export interface DashboardEntityLinkViewModel {
    id: string;
    label: string;
    subtitle?: string;
    date: string;
}

export interface OpportunityHighlightViewModel {
    id: string;
    opportunityNumber: string;
    title: string;
    stage: string;
    estimatedValue: number;
    currencyCode: string;
    expectedCloseDate?: string;
}

export interface ActivityItemViewModel {
    id: string;
    type: string;
    title: string;
    description?: string;
    date: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
}
