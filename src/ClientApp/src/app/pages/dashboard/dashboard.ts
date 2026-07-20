import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { DashboardApiService } from './dashboard-api.service';
import { ChartPointViewModel, CurrencyAmountViewModel, DashboardViewModel, MonthlyTrendViewModel, OpportunityHighlightViewModel } from './view-models/dashboard.view-model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, TagModule],
    template: `
        <section class="crm-dashboard grid grid-cols-12 gap-4">
            @if (errorMessage) {
                <div class="col-span-12 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
            }

            @if (dashboard) {
                <div class="metric-row col-span-12 grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 2xl:grid-cols-4">
                    @for (group of metricGroups; track group.title) {
                        <div class="card metric-group border-l-4" [style.border-left-color]="group.color">
                            <div class="metric-group-header mb-4 flex items-center justify-between gap-3">
                                <div class="min-w-0">
                                    <div class="truncate text-xs font-semibold uppercase text-surface-500">{{ group.title }}</div>
                                    <div class="mt-1 text-sm font-semibold text-surface-950 dark:text-surface-0">{{ group.subtitle }}</div>
                                </div>
                                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" [ngStyle]="{ background: group.tint, color: group.color }">
                                    <i class="pi" [ngClass]="group.icon"></i>
                                </span>
                            </div>
                            <div class="metric-group-body grid grid-cols-2 gap-3">
                                @for (metric of group.metrics; track metric.label) {
                                    <button type="button" class="metric-cell min-w-0 rounded-md p-3 text-left" (click)="navigate(metric.route, metric.query)">
                                        <div class="truncate text-xs font-semibold text-surface-500">{{ metric.label }}</div>
                                        <div class="mt-2 min-h-8 truncate text-2xl font-semibold leading-none text-surface-950 dark:text-surface-0">{{ metric.value }}</div>
                                        <div class="mt-2 flex min-w-0 items-center gap-1 text-xs" [ngStyle]="{ color: metric.color }">
                                            <i class="pi shrink-0" [ngClass]="metric.trendIcon"></i>
                                            <span class="truncate">{{ metric.context }}</span>
                                        </div>
                                    </button>
                                }
                            </div>
                        </div>
                    }
                </div>

                <div class="col-span-12 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    @for (insight of operationalInsights; track insight.label) {
                        <div class="insight-tile">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div class="text-xs font-semibold uppercase text-surface-500">{{ insight.label }}</div>
                                    <div class="mt-2 text-xl font-semibold text-surface-950 dark:text-surface-0">{{ insight.value }}</div>
                                    <div class="mt-1 text-xs text-surface-500">{{ insight.detail }}</div>
                                </div>
                                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md" [ngStyle]="{ background: insight.tint, color: insight.color }">
                                    <i class="pi" [ngClass]="insight.icon"></i>
                                </span>
                            </div>
                            <div class="mt-4 h-1.5 rounded-full bg-surface-100 dark:bg-surface-800">
                                <div class="h-1.5 rounded-full" [style.width.%]="insight.progress" [style.background]="insight.color"></div>
                            </div>
                        </div>
                    }
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-5">
                    <div class="mb-4 flex items-center justify-between">
                        <div>
                            <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Sales Funnel</h2>
                            <p class="mt-1 mb-0 text-xs text-surface-500 dark:text-surface-400">Cumulative records that reached each stage.</p>
                        </div>
                        <span class="panel-badge">{{ dashboard.summary.totalLeads }} leads</span>
                    </div>
                    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div class="funnel-stack flex min-h-72 flex-col justify-center gap-1">
                            @for (step of salesFunnel; track step.label) {
                                <div class="funnel-slice mx-auto flex h-11 items-center justify-center text-sm font-semibold text-white shadow-sm" [style.width.%]="step.width" [style.background]="step.color">
                                    {{ step.label }}
                                </div>
                            }
                        </div>
                        <div class="flex flex-col justify-center gap-4">
                            @for (step of salesFunnel; track step.label) {
                                <div class="grid grid-cols-[1fr_auto] items-center gap-4 text-sm">
                                    <div class="flex items-center gap-2">
                                        <span class="h-2.5 w-2.5 rounded-full" [ngStyle]="{ background: step.color }"></span>
                                        <span class="text-surface-700 dark:text-surface-200">{{ step.label }}</span>
                                    </div>
                                    <div class="text-right">
                                        <span class="font-semibold text-surface-950 dark:text-surface-0">{{ step.count }}</span>
                                        <span class="ml-1 text-xs text-surface-500">({{ step.rate }})</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-4">
                    <div class="mb-4 flex items-center justify-between">
                        <div>
                            <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Opportunity Pipeline</h2>
                            <p class="mt-1 mb-0 text-xs text-surface-500 dark:text-surface-400">Stage count and estimated value.</p>
                        </div>
                        <span class="panel-badge">{{ dashboard.summary.openOpportunities }} open</span>
                    </div>
                    <div class="space-y-4">
                        @for (stage of pipelineStages; track stage.label) {
                            <div class="grid grid-cols-[7rem_1fr_3rem_minmax(5.75rem,auto)] items-center gap-3 text-sm">
                                <span class="truncate text-surface-600 dark:text-surface-300">{{ stage.label }}</span>
                                <div class="pipeline-track h-4 overflow-hidden rounded bg-surface-100 dark:bg-surface-800">
                                    <div class="h-full rounded" [style.width.%]="stage.width" [style.background]="stage.color"></div>
                                </div>
                                <span class="text-right font-semibold text-surface-900 dark:text-surface-100">{{ stage.count }}</span>
                                <span class="text-right text-xs text-surface-500">{{ formatCurrencyAmounts(stage.amounts, stage.value) }}</span>
                            </div>
                        } @empty {
                            <div class="text-sm text-surface-500">No opportunity stages found.</div>
                        }
                    </div>
                    <div class="mt-5 grid grid-cols-2 gap-3 border-t border-surface-100 pt-4 dark:border-surface-800">
                        <div>
                            <div class="text-xs text-surface-500">Open Pipeline</div>
                            <div class="mt-1 text-lg font-semibold text-surface-950 dark:text-surface-0">{{ formatCurrencyAmounts(dashboard.opportunityAnalytics.openPipelineValues, dashboard.opportunityAnalytics.openPipelineValue) }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-surface-500">Expected Revenue</div>
                            <div class="mt-1 text-lg font-semibold text-surface-950 dark:text-surface-0">{{ formatCurrencyAmounts(dashboard.opportunityAnalytics.expectedRevenues, dashboard.opportunityAnalytics.expectedRevenue) }}</div>
                        </div>
                    </div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-3">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Lead Sources</h2>
                        <i class="pi pi-info-circle text-surface-400"></i>
                    </div>
                    <div class="chart-box min-h-72">
                        <p-chart type="doughnut" [data]="pointChart(dashboard.leadAnalytics.leadsBySource)" [options]="doughnutOptions" />
                    </div>
                    <div class="mt-2 text-center text-xs font-semibold text-surface-700 dark:text-surface-200">Total {{ dashboard.summary.totalLeads }}</div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-3">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Product Interest</h2>
                        <i class="pi pi-info-circle text-surface-400"></i>
                    </div>
                    <div class="chart-box min-h-72">
                        <p-chart type="doughnut" [data]="pointChart(dashboard.clientAnalytics.clientsByProduct)" [options]="doughnutOptions" />
                    </div>
                    <div class="mt-2 text-center text-xs font-semibold text-surface-700 dark:text-surface-200">Clients {{ dashboard.clientAnalytics.totalClients }}</div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-3">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Lead Trend</h2>
                        <span class="text-xs text-surface-500">{{ dashboard.leadAnalytics.leadsCreatedThisMonth }} this month</span>
                    </div>
                    <div class="chart-box min-h-72">
                        <p-chart type="line" [data]="trendChart(dashboard.leadAnalytics.monthlyLeadTrend, 'Leads', '#2563eb')" [options]="lineOptions" />
                    </div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-3">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Client Growth</h2>
                        <span class="text-xs text-surface-500">{{ dashboard.clientAnalytics.newClientsThisMonth }} this month</span>
                    </div>
                    <div class="chart-box min-h-72">
                        <p-chart type="line" [data]="trendChart(dashboard.clientAnalytics.clientGrowthTrend, 'Clients', '#0f766e')" [options]="lineOptions" />
                    </div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-3">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Won vs Lost</h2>
                        <p-tag [value]="dashboard.opportunityAnalytics.opportunityConversionRate + '% win rate'" severity="success" />
                    </div>
                    <div class="chart-box min-h-72">
                        <p-chart type="doughnut" [data]="pointChart(dashboard.opportunityAnalytics.wonVsLost)" [options]="doughnutOptions" />
                    </div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-4">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Top Opportunities</h2>
                        <button type="button" class="text-sm font-semibold text-blue-600" (click)="navigate('/pages/opportunities')">View All</button>
                    </div>
                    @for (item of dashboard.opportunityAnalytics.topOpportunitiesByValue; track item.id; let index = $index) {
                        <button type="button" class="list-row mb-4 grid w-full grid-cols-[1.5rem_1fr_5.75rem_3rem] items-center gap-3 rounded-md p-2 text-left last:mb-0" (click)="navigate('/pages/opportunities')">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{{ index + 1 }}</span>
                            <span class="min-w-0">
                                <span class="block truncate text-sm font-semibold text-surface-950 dark:text-surface-0">{{ item.title }}</span>
                                <span class="block truncate text-xs text-surface-500">{{ item.opportunityNumber }} - {{ item.stage }}</span>
                            </span>
                            <span class="text-right text-sm font-semibold text-surface-900 dark:text-surface-100">{{ moneyCompact(item.estimatedValue, item.currencyCode) }}</span>
                            <span class="h-2 rounded bg-blue-600" [style.width.%]="opportunityBarWidth(item)"></span>
                        </button>
                    } @empty {
                        <div class="text-sm text-surface-500">No opportunities found.</div>
                    }
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-4">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Recent Activities</h2>
                        <p-tag [value]="dashboard.recentActivities.latestActivities.length + ' items'" severity="secondary" />
                    </div>
                    @for (activity of dashboard.recentActivities.latestActivities; track activity.id) {
                        <div class="activity-row mb-4 grid grid-cols-[2.25rem_1fr_auto] items-start gap-3 rounded-md p-2 last:mb-0">
                            <span class="flex h-9 w-9 items-center justify-center rounded-full" [ngStyle]="activityIconStyle(activity.type)">
                                <i class="pi text-sm" [ngClass]="activityIcon(activity.type)"></i>
                            </span>
                            <span class="min-w-0">
                                <span class="block truncate text-sm font-semibold text-surface-950 dark:text-surface-0">{{ activity.title }}</span>
                                <span class="block line-clamp-2 text-xs text-surface-500">{{ activity.description || activity.type }}</span>
                            </span>
                            <span class="whitespace-nowrap text-xs text-surface-500">{{ formatDate(activity.date) }}</span>
                        </div>
                    } @empty {
                        <div class="text-sm text-surface-500">No recent activity.</div>
                    }
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-4">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Pending Follow-ups</h2>
                        <p-tag [value]="dashboard.recentActivities.pendingFollowUps.length + ' due'" severity="warn" />
                    </div>
                    @for (followUp of dashboard.recentActivities.pendingFollowUps; track followUp.id) {
                        <div class="activity-row mb-4 grid grid-cols-[1.25rem_1fr_auto] items-start gap-3 rounded-md border-b border-surface-100 p-2 pb-4 last:mb-0 last:border-0 dark:border-surface-800">
                            <span class="mt-0.5 flex h-5 w-5 items-center justify-center rounded border border-blue-300 bg-blue-50 text-blue-700">
                                <i class="pi pi-check text-xs"></i>
                            </span>
                            <span class="min-w-0">
                                <span class="block truncate text-sm font-semibold text-surface-950 dark:text-surface-0">{{ followUp.title }}</span>
                                <span class="block line-clamp-2 text-xs text-surface-500">{{ followUp.description || followUp.type }}</span>
                            </span>
                            <span class="whitespace-nowrap text-xs text-surface-500">{{ formatDate(followUp.date) }}</span>
                        </div>
                    } @empty {
                        <div class="text-sm text-surface-500">No pending follow-ups.</div>
                    }
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-6">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Closing Soon</h2>
                        <button type="button" class="text-sm font-semibold text-blue-600" (click)="navigate('/pages/opportunities')">View Opportunities</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="data-table w-full min-w-[36rem] border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr class="text-left text-xs font-semibold text-surface-500">
                                    <th class="border-b border-surface-100 py-3 dark:border-surface-800">Opportunity</th>
                                    <th class="border-b border-surface-100 py-3 dark:border-surface-800">Stage</th>
                                    <th class="border-b border-surface-100 py-3 text-right dark:border-surface-800">Value</th>
                                    <th class="border-b border-surface-100 py-3 text-right dark:border-surface-800">Close Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (item of dashboard.opportunityAnalytics.opportunitiesClosingSoon; track item.id) {
                                    <tr class="transition">
                                        <td class="border-b border-surface-100 py-3 pr-4 font-semibold text-surface-950 dark:border-surface-800 dark:text-surface-0">{{ item.title }}</td>
                                        <td class="border-b border-surface-100 py-3 pr-4 dark:border-surface-800"><p-tag [value]="item.stage" severity="info" /></td>
                                        <td class="border-b border-surface-100 py-3 text-right dark:border-surface-800">{{ moneyCompact(item.estimatedValue, item.currencyCode) }}</td>
                                        <td class="border-b border-surface-100 py-3 text-right text-surface-500 dark:border-surface-800">{{ formatDate(item.expectedCloseDate) }}</td>
                                    </tr>
                                } @empty {
                                    <tr>
                                        <td class="py-4 text-sm text-surface-500" colspan="4">No upcoming closes.</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card dashboard-panel col-span-12 xl:col-span-6">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="m-0 text-base font-semibold text-surface-950 dark:text-surface-0">Client Attention</h2>
                        <button type="button" class="text-sm font-semibold text-blue-600" (click)="navigate('/pages/clients')">View Clients</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="data-table w-full min-w-[32rem] border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr class="text-left text-xs font-semibold text-surface-500">
                                    <th class="border-b border-surface-100 py-3 dark:border-surface-800">Client</th>
                                    <th class="border-b border-surface-100 py-3 dark:border-surface-800">Reason</th>
                                    <th class="border-b border-surface-100 py-3 text-right dark:border-surface-800">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (client of dashboard.clientAnalytics.clientsWithoutRecentActivity; track client.id) {
                                    <tr class="transition">
                                        <td class="border-b border-surface-100 py-3 pr-4 font-semibold text-surface-950 dark:border-surface-800 dark:text-surface-0">{{ client.label }}</td>
                                        <td class="border-b border-surface-100 py-3 pr-4 text-surface-500 dark:border-surface-800">{{ client.subtitle || 'No recent activity' }}</td>
                                        <td class="border-b border-surface-100 py-3 text-right text-surface-500 dark:border-surface-800">{{ formatDate(client.date) }}</td>
                                    </tr>
                                } @empty {
                                    <tr>
                                        <td class="py-4 text-sm text-surface-500" colspan="3">All visible clients have recent activity.</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            } @else if (isLoading) {
                <div class="card col-span-12 text-surface-500">Loading dashboard...</div>
            }
        </section>
    `,
    styles: [
        `
            :host {
                display: block;
            }

            .crm-dashboard .card,
            .insight-tile {
                border: 1px solid rgba(148, 163, 184, 0.22);
                border-radius: 12px;
                box-shadow: 0 10px 28px rgba(15, 23, 42, 0.045);
            }

            .metric-group {
                display: flex;
                flex-direction: column;
                height: 12.5rem;
                position: relative;
                overflow: hidden;
            }

            .metric-group::after {
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0));
                content: '';
                height: 38px;
                pointer-events: none;
                position: absolute;
                right: -18px;
                top: -18px;
                transform: rotate(32deg);
                width: 76px;
            }

            .metric-cell {
                background: rgba(248, 250, 252, 0.72);
                border: 1px solid rgba(148, 163, 184, 0.14);
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-height: 5.35rem;
                transition:
                    background 150ms ease,
                    border-color 150ms ease,
                    transform 150ms ease;
            }

            .metric-group-header {
                flex: 0 0 auto;
            }

            .metric-group-body {
                flex: 1 1 auto;
                min-height: 0;
            }

            @media (max-width: 767px) {
                .metric-group {
                    height: auto;
                    min-height: 12.5rem;
                }
            }

            .metric-cell:hover {
                background: rgba(37, 99, 235, 0.045);
                border-color: rgba(37, 99, 235, 0.18);
                transform: translateY(-1px);
            }

            .insight-tile {
                background: color-mix(in srgb, var(--surface-0, #ffffff) 94%, #f8fafc);
                padding: 1rem;
            }

            .dashboard-panel {
                min-height: 100%;
            }

            .panel-badge {
                background: rgba(37, 99, 235, 0.08);
                border: 1px solid rgba(37, 99, 235, 0.14);
                border-radius: 999px;
                color: #2563eb;
                font-size: 0.75rem;
                font-weight: 700;
                padding: 0.25rem 0.625rem;
                white-space: nowrap;
            }

            .funnel-stack {
                background: rgba(37, 99, 235, 0.035);
                border-radius: 10px;
            }

            .funnel-slice {
                clip-path: polygon(8% 0, 92% 0, 84% 100%, 16% 100%);
                min-width: 7.25rem;
            }

            .pipeline-track {
                box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.08);
            }

            .chart-box {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .list-row,
            .activity-row {
                transition:
                    background 150ms ease,
                    transform 150ms ease;
            }

            .list-row:hover,
            .activity-row:hover,
            .data-table tbody tr:hover {
                background: rgba(37, 99, 235, 0.045);
            }

            .list-row:hover {
                transform: translateX(2px);
            }

            .data-table thead th {
                background: rgba(248, 250, 252, 0.92);
                position: sticky;
                top: 0;
                z-index: 1;
            }

            :host-context(.app-dark) .crm-dashboard .card,
            :host-context(.dark) .crm-dashboard .card,
            :host-context(.app-dark) .insight-tile,
            :host-context(.dark) .insight-tile {
                border-color: rgba(148, 163, 184, 0.16);
                box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
            }

            :host-context(.app-dark) .insight-tile,
            :host-context(.dark) .insight-tile {
                background: rgba(15, 23, 42, 0.35);
            }

            :host-context(.app-dark) .metric-cell,
            :host-context(.dark) .metric-cell {
                background: rgba(15, 23, 42, 0.28);
                border-color: rgba(148, 163, 184, 0.12);
            }
        `
    ]
})
export class Dashboard implements OnInit {
    dashboard?: DashboardViewModel;
    isLoading = false;
    errorMessage = '';

    private readonly colors = ['#2563eb', '#38bdf8', '#14b8a6', '#22c55e', '#84cc16', '#f59e0b', '#e11d48'];

    doughnutOptions = {
        cutout: '62%',
        plugins: {
            legend: {
                position: 'right',
                labels: { boxWidth: 10, boxHeight: 10 }
            }
        },
        maintainAspectRatio: false,
        aspectRatio: 1.2
    };

    lineOptions = {
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { precision: 0 } }
        },
        maintainAspectRatio: false,
        aspectRatio: 1.25
    };

    constructor(
        private readonly dashboardApi: DashboardApiService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.loadDashboard();
    }

    get metricGroups() {
        const summary = this.dashboard?.summary;
        const lead = this.dashboard?.leadAnalytics;
        const opportunity = this.dashboard?.opportunityAnalytics;

        if (!summary || !lead || !opportunity) {
            return [];
        }

        return [
            {
                title: 'Lead Engine',
                subtitle: `${lead.leadsCreatedThisMonth} new this month`,
                icon: 'pi-users',
                color: '#2563eb',
                tint: 'rgba(37, 99, 235, 0.12)',
                metrics: [
                    { label: 'Total Leads', value: this.number(summary.totalLeads), context: `${lead.leadsCreatedThisMonth} this month`, trendIcon: 'pi-arrow-up', color: '#2563eb', route: '/pages/leads', query: {} },
                    { label: 'Qualified', value: this.number(summary.qualifiedLeads), context: `${lead.leadConversionRate}% conversion`, trendIcon: 'pi-arrow-up', color: '#16a34a', route: '/pages/leads', query: { status: 'Qualified' } }
                ]
            },
            {
                title: 'Client Coverage',
                subtitle: `${summary.activeClients} active accounts`,
                icon: 'pi-building',
                color: '#7c3aed',
                tint: 'rgba(124, 58, 237, 0.12)',
                metrics: [
                    { label: 'Clients', value: this.number(summary.totalClients), context: `${summary.activeClients} active`, trendIcon: 'pi-arrow-up', color: '#7c3aed', route: '/pages/clients', query: {} },
                    { label: 'Assigned Leads', value: this.number(summary.assignedLeads), context: `${lead.unassignedLeads} unassigned`, trendIcon: 'pi-arrow-up', color: '#0891b2', route: '/pages/leads', query: {} }
                ]
            },
            {
                title: 'Pipeline Value',
                subtitle: `${summary.openOpportunities} open opportunities`,
                icon: 'pi-briefcase',
                color: '#f59e0b',
                tint: 'rgba(245, 158, 11, 0.14)',
                metrics: [
                    { label: 'Opportunities', value: this.number(summary.totalOpportunities), context: `${summary.openOpportunities} open`, trendIcon: 'pi-arrow-up', color: '#f59e0b', route: '/pages/opportunities', query: {} },
                    { label: 'Expected Revenue', value: this.formatCurrencyAmounts(opportunity.expectedRevenues, opportunity.expectedRevenue), context: `${this.formatCurrencyAmounts(opportunity.openPipelineValues, opportunity.openPipelineValue)} open`, trendIcon: 'pi-arrow-up', color: '#2563eb', route: '/pages/opportunities', query: {} }
                ]
            },
            {
                title: 'Deal Outcomes',
                subtitle: compactPercent(opportunity.opportunityConversionRate),
                icon: 'pi-trophy',
                color: '#22c55e',
                tint: 'rgba(34, 197, 94, 0.14)',
                metrics: [
                    { label: 'Won Deals', value: this.number(summary.wonOpportunities), context: compactPercent(opportunity.opportunityConversionRate), trendIcon: 'pi-arrow-up', color: '#22c55e', route: '/pages/opportunities', query: { status: 'Won' } },
                    { label: 'Lost Deals', value: this.number(summary.lostOpportunities), context: `${this.formatCurrencyAmounts(opportunity.lostDealValues, opportunity.lostDealValue)} value`, trendIcon: 'pi-arrow-down', color: '#e11d48', route: '/pages/opportunities', query: { status: 'Lost' } }
                ]
            }
        ];
    }

    get operationalInsights() {
        const lead = this.dashboard?.leadAnalytics;
        const client = this.dashboard?.clientAnalytics;
        const opportunity = this.dashboard?.opportunityAnalytics;
        const activity = this.dashboard?.recentActivities;

        if (!lead || !client || !opportunity || !activity) {
            return [];
        }

        const assignmentTotal = lead.assignedLeads + lead.unassignedLeads;
        const assignmentCoverage = assignmentTotal === 0 ? 0 : Math.round((lead.assignedLeads / assignmentTotal) * 100);
        const activeClientRate = client.totalClients === 0 ? 0 : Math.round((client.activeClients / client.totalClients) * 100);
        const followUpLoad = Math.min(100, activity.pendingFollowUps.length * 12);

        return [
            { label: 'Lead Quality', value: `${lead.leadConversionRate}%`, detail: `${lead.qualifiedLeads} qualified leads`, color: '#2563eb', tint: 'rgba(37, 99, 235, 0.12)', icon: 'pi-verified', progress: this.clamp(lead.leadConversionRate) },
            { label: 'Assignment Coverage', value: `${assignmentCoverage}%`, detail: `${lead.unassignedLeads} unassigned leads`, color: '#0f766e', tint: 'rgba(15, 118, 110, 0.12)', icon: 'pi-user-plus', progress: assignmentCoverage },
            { label: 'Client Activity', value: `${activeClientRate}%`, detail: `${client.inactiveClients} inactive clients`, color: '#7c3aed', tint: 'rgba(124, 58, 237, 0.12)', icon: 'pi-building', progress: activeClientRate },
            { label: 'Follow-up Load', value: this.number(activity.pendingFollowUps.length), detail: `${this.number(activity.latestActivities.length)} recent activities`, color: '#d97706', tint: 'rgba(217, 119, 6, 0.14)', icon: 'pi-clock', progress: followUpLoad }
        ];
    }

    get salesFunnel() {
        const rows = this.dashboard?.leadAnalytics.salesFunnel ?? [];
        if (rows.length === 0) {
            return [];
        }

        const funnelColors = ['#2563eb', '#3b82f6', '#14b8a6', '#22c55e', '#84cc16'];
        const total = Math.max(rows[0]?.count ?? 0, 1);

        return rows.map((row, index) => ({
            ...row,
            color: funnelColors[index % funnelColors.length],
            width: Math.max(38, 100 - index * 13),
            rate: `${Math.round((row.count / total) * 100)}%`
        }));
    }

    get pipelineStages() {
        const stages = this.dashboard?.opportunityAnalytics.opportunitiesByStage ?? [];
        const max = Math.max(...stages.map((stage) => stage.count), 1);

        return stages.map((stage, index) => ({
            ...stage,
            color: this.colors[index % this.colors.length],
            width: Math.max(8, Math.round((stage.count / max) * 100))
        }));
    }

    loadDashboard(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.dashboardApi.getDashboard().subscribe({
            next: (dashboard) => {
                this.dashboard = dashboard;
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Unable to load dashboard data.';
                this.isLoading = false;
            }
        });
    }

    navigate(route: string, queryParams: Record<string, string | number | undefined> = {}): void {
        this.router.navigate([route], { queryParams });
    }

    pointChart(points: ChartPointViewModel[]) {
        return {
            labels: points.map((point) => point.label),
            datasets: [
                {
                    data: points.map((point) => point.count),
                    backgroundColor: this.colors,
                    borderWidth: 0
                }
            ]
        };
    }

    trendChart(points: MonthlyTrendViewModel[], label: string, color = '#2563eb') {
        return {
            labels: points.map((point) => point.month),
            datasets: [
                {
                    label,
                    data: points.map((point) => point.count),
                    borderColor: color,
                    backgroundColor: this.hexToRgba(color, 0.1),
                    tension: 0.35,
                    fill: true,
                    pointRadius: 2,
                    borderWidth: 2
                }
            ]
        };
    }

    opportunityBarWidth(item: OpportunityHighlightViewModel): number {
        const values = this.dashboard?.opportunityAnalytics.topOpportunitiesByValue.map((opportunity) => opportunity.estimatedValue) ?? [];
        const max = Math.max(...values, 1);

        return Math.max(20, Math.round((item.estimatedValue / max) * 100));
    }

    activityIcon(type: string): string {
        const normalized = type.toLowerCase();
        if (normalized.includes('email')) {
            return 'pi-envelope';
        }

        if (normalized.includes('meeting')) {
            return 'pi-calendar';
        }

        if (normalized.includes('follow')) {
            return 'pi-phone';
        }

        if (normalized.includes('opportunity')) {
            return 'pi-briefcase';
        }

        return 'pi-check';
    }

    activityIconStyle(type: string) {
        const normalized = type.toLowerCase();
        if (normalized.includes('email')) {
            return { background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' };
        }

        if (normalized.includes('meeting')) {
            return { background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed' };
        }

        if (normalized.includes('opportunity')) {
            return { background: 'rgba(245, 158, 11, 0.14)', color: '#d97706' };
        }

        return { background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' };
    }

    number(value: number): string {
        return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value ?? 0);
    }

    compact(value: number): string {
        return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value ?? 0);
    }

    formatCurrencyAmounts(amounts: CurrencyAmountViewModel[] | undefined, fallbackValue: number): string {
        const currencyAmounts = (amounts ?? []).filter((amount) => amount.currencyCode);
        if (currencyAmounts.length === 0) {
            return this.moneyCompact(fallbackValue, 'NPR');
        }

        return currencyAmounts.map((amount) => this.moneyCompact(amount.amount, amount.currencyCode)).join(', ');
    }

    moneyCompact(value: number, currencyCode = 'NPR'): string {
        const currency = currencyCode || 'NPR';
        try {
            return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1, style: 'currency', currency, currencyDisplay: 'code' }).format(value ?? 0);
        } catch {
            return `${currency} ${this.compact(value)}`;
        }
    }

    formatDate(value?: string): string {
        return value ? new Date(value).toLocaleDateString() : 'Not set';
    }

    private clamp(value: number): number {
        return Math.max(0, Math.min(100, value || 0));
    }

    private hexToRgba(hex: string, alpha: number): string {
        const value = hex.replace('#', '');
        const red = parseInt(value.substring(0, 2), 16);
        const green = parseInt(value.substring(2, 4), 16);
        const blue = parseInt(value.substring(4, 6), 16);

        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
}

function compactPercent(value: number): string {
    return `${value}% win rate`;
}
