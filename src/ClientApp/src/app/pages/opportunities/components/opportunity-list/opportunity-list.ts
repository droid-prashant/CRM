import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import {
    ClientLookupViewModel,
    ContactLookupViewModel,
    CreateOpportunityActivityRequest,
    CreateOpportunityRequest,
    CurrencyLookupViewModel,
    LeadLookupViewModel,
    LookupViewModel,
    OpportunityActivityViewModel,
    OpportunityApiService,
    OpportunityListItemViewModel,
    OpportunityListQuery,
    OpportunityLookupBundle,
    OpportunityPipelineStageViewModel,
    OpportunityStageHistoryViewModel,
    OpportunityUserLookupViewModel,
    ProductLookupViewModel,
    UpdateOpportunityRequest
} from '../../services/opportunity-api.service';

@Component({
    selector: 'app-opportunity-list',
    standalone: true,
    imports: [ButtonModule, CommonModule, DatePickerModule, DialogModule, InputNumberModule, InputTextModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, ToastModule],
    templateUrl: './opportunity-list.html',
    providers: [MessageService]
})
export class OpportunityList implements OnInit {
    opportunities: OpportunityListItemViewModel[] = [];
    pipelineStages: OpportunityPipelineStageViewModel[] = [];
    clients: ClientLookupViewModel[] = [];
    allContacts: ContactLookupViewModel[] = [];
    contacts: ContactLookupViewModel[] = [];
    products: ProductLookupViewModel[] = [];
    leads: LeadLookupViewModel[] = [];
    users: OpportunityUserLookupViewModel[] = [];
    currencies: CurrencyLookupViewModel[] = [];
    stages: LookupViewModel[] = [];
    statuses: LookupViewModel[] = [];
    activityTypes = [
        { label: 'Note', value: 'Note' },
        { label: 'Call', value: 'Call' },
        { label: 'Meeting', value: 'Meeting' },
        { label: 'Follow-up', value: 'FollowUp' }
    ];

    viewMode: 'pipeline' | 'list' = 'pipeline';
    isLoading = true;
    isSaving = false;
    createDialog = false;
    editDialog = false;
    closeDialog = false;
    activityDialog = false;
    stageChangeDialog = false;
    closingMode: 'won' | 'lost' = 'won';
    canCreate = false;
    canEdit = false;
    canApprove = false;
    errorMessage = '';
    selectedOpportunity?: OpportunityListItemViewModel;
    pendingStageOpportunity?: OpportunityListItemViewModel;
    pendingStageId = '';
    pendingStageName = '';
    draggedOpportunity?: OpportunityListItemViewModel;
    dragOverStageId = '';
    stageHistory: OpportunityStageHistoryViewModel[] = [];
    activities: OpportunityActivityViewModel[] = [];
    totalRecords = 0;
    first = 0;
    pageNumber = 1;
    pageSize = 10;
    sortField = '';
    sortDirection: 'asc' | 'desc' = 'desc';

    private readonly fb = inject(FormBuilder);

    filterForm = this.fb.group({
        searchTerm: [''],
        clientId: [''],
        stageId: [''],
        ownerUserId: [''],
        status: ['Open']
    });

    opportunityForm = this.fb.group({
        clientId: ['', Validators.required],
        contactId: ['', Validators.required],
        leadId: [''],
        productId: ['', Validators.required],
        title: ['', [Validators.required, Validators.maxLength(250)]],
        estimatedValue: [0, [Validators.required, Validators.min(0)]],
        currencyId: ['', Validators.required],
        expectedCloseDate: [''],
        ownerUserId: ['', Validators.required],
        licenseFee: [0],
        amcFee: [0],
        implementationFee: [0],
        subscriptionFee: [0]
    });

    editForm = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(250)]],
        estimatedValue: [0, [Validators.required, Validators.min(0)]],
        ownerUserId: ['', Validators.required]
    });

    activityForm = this.fb.group({
        activityType: ['Note', Validators.required],
        subject: [''],
        notes: ['', [Validators.required, Validators.maxLength(2000)]],
        activityDate: [''],
        followUpDate: ['']
    });

    stageChangeForm = this.fb.group({
        remarks: ['', Validators.maxLength(1000)]
    });

    closeForm = this.fb.group({
        finalAmount: [0],
        lostReason: [''],
        closedDate: [new Date().toISOString().slice(0, 10), Validators.required],
        note: ['']
    });

    constructor(
        private readonly opportunityApiService: OpportunityApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.opportunities.create);
        this.canEdit = this.authService.hasPermission(Permissions.opportunities.edit);
        this.canApprove = this.authService.hasPermission(Permissions.opportunities.approve);
        this.loadPage();
    }

    setViewMode(mode: 'pipeline' | 'list'): void {
        this.viewMode = mode;
    }

    openCreateDialog(): void {
        const defaultCurrencyId = this.currencies[0]?.id ?? '';
        const defaultOwnerUserId = this.users[0]?.id ?? '';
        this.contacts = [];
        this.selectedProduct = undefined;
        this.opportunityForm.reset({
            clientId: '',
            contactId: '',
            leadId: '',
            productId: '',
            title: '',
            estimatedValue: 0,
            currencyId: defaultCurrencyId,
            expectedCloseDate: '',
            ownerUserId: defaultOwnerUserId,
            licenseFee: 0,
            amcFee: 0,
            implementationFee: 0,
            subscriptionFee: 0
        });
        this.createDialog = true;
    }

    openEditDialog(opportunity: OpportunityListItemViewModel): void {
        this.selectedOpportunity = opportunity;
        this.editForm.reset({
            title: opportunity.title,
            estimatedValue: opportunity.estimatedValue,
            ownerUserId: opportunity.ownerUserId
        });
        this.editDialog = true;
    }

    openCloseDialog(opportunity: OpportunityListItemViewModel, mode: 'won' | 'lost'): void {
        this.selectedOpportunity = opportunity;
        this.closingMode = mode;
        this.closeForm.reset({
            finalAmount: opportunity.estimatedValue,
            lostReason: '',
            closedDate: new Date().toISOString().slice(0, 10),
            note: ''
        });
        this.closeDialog = true;
    }

    openActivityDialog(opportunity: OpportunityListItemViewModel): void {
        this.selectedOpportunity = opportunity;
        this.activityForm.reset({
            activityType: 'Note',
            subject: '',
            notes: '',
            activityDate: '',
            followUpDate: ''
        });
        this.activityDialog = true;
        forkJoin({
            activities: this.opportunityApiService.getActivities(opportunity.id),
            history: this.opportunityApiService.getStageHistory(opportunity.id)
        }).subscribe({
            next: (result) => {
                this.activities = result.activities;
                this.stageHistory = result.history;
            },
            error: () => {
                this.activities = [];
                this.stageHistory = [];
                this.messageService.add({ severity: 'error', summary: 'Unable to load timeline', detail: 'Activity and stage history could not be loaded.', life: 5000 });
            }
        });
    }

    onClientChange(clientId: string): void {
        this.opportunityForm.patchValue({ contactId: '' });
        this.contacts = clientId ? this.allContacts.filter((contact) => contact.clientId === clientId) : [];
    }

    selectedProduct: ProductLookupViewModel | undefined;

    onProductChange(productId: string): void {
        this.selectedProduct = this.products.find((p) => p.id === productId);
        if (!this.selectedProduct) {
            return;
        }

        if (!this.selectedProduct.isLicenseBased) {
            this.opportunityForm.patchValue({ licenseFee: 0, amcFee: 0, implementationFee: 0 });
        }

        if (!this.selectedProduct.isSubscriptionBased) {
            this.opportunityForm.patchValue({ subscriptionFee: 0 });
        }
    }

    onStageChange(opportunity: OpportunityListItemViewModel, event: Event): void {
        const select = event.target as HTMLSelectElement;
        const stageId = select.value;
        select.value = opportunity.stageId;

        if (!stageId || stageId === opportunity.stageId) {
            return;
        }

        this.prepareStageChange(opportunity, stageId);
    }

    onOpportunityDragStart(opportunity: OpportunityListItemViewModel, event: DragEvent): void {
        if (!this.canMoveOpportunity(opportunity)) {
            event.preventDefault();
            return;
        }

        this.draggedOpportunity = opportunity;
        event.dataTransfer?.setData('text/plain', opportunity.id);
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    onOpportunityDragEnd(): void {
        this.draggedOpportunity = undefined;
        this.dragOverStageId = '';
    }

    onStageDragOver(stage: OpportunityPipelineStageViewModel, event: DragEvent): void {
        if (!this.canDropOnStage(stage)) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'none';
            }
            return;
        }

        event.preventDefault();
        this.dragOverStageId = stage.stageId;
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    }

    onStageDragLeave(stage: OpportunityPipelineStageViewModel): void {
        if (this.dragOverStageId === stage.stageId) {
            this.dragOverStageId = '';
        }
    }

    onStageDrop(stage: OpportunityPipelineStageViewModel, event: DragEvent): void {
        event.preventDefault();
        this.dragOverStageId = '';

        if (!this.draggedOpportunity || !this.canDropOnStage(stage)) {
            return;
        }

        this.prepareStageChange(this.draggedOpportunity, stage.stageId);
    }

    canMoveOpportunity(opportunity: OpportunityListItemViewModel): boolean {
        return this.canEdit && !opportunity.isFinalStage && opportunity.status === 'Open';
    }

    canDropOnStage(stage: OpportunityPipelineStageViewModel): boolean {
        return !!this.draggedOpportunity && !stage.isFinal && stage.sequence > this.draggedOpportunity.stageSequence && stage.stageId !== this.draggedOpportunity.stageId;
    }

    isStageDragTarget(stage: OpportunityPipelineStageViewModel): boolean {
        return this.dragOverStageId === stage.stageId && this.canDropOnStage(stage);
    }

    private prepareStageChange(opportunity: OpportunityListItemViewModel, stageId: string): void {
        const targetStage = this.stages.find((stage) => stage.id === stageId);
        this.pendingStageOpportunity = opportunity;
        this.pendingStageId = stageId;
        this.pendingStageName = targetStage?.name ?? 'selected stage';
        this.stageChangeForm.reset({ remarks: '' });
        this.stageChangeDialog = true;
    }

    confirmStageChange(): void {
        this.stageChangeForm.markAllAsTouched();
        if (this.stageChangeForm.invalid || !this.pendingStageOpportunity || !this.pendingStageId) {
            return;
        }

        const opportunity = this.pendingStageOpportunity;
        const value = this.stageChangeForm.getRawValue();
        this.isSaving = true;
        this.opportunityApiService.changeStage(opportunity.id, { stageId: this.pendingStageId, remarks: value.remarks?.trim() || undefined }).subscribe({
            next: () => {
                this.stageChangeDialog = false;
                this.clearPendingStageChange();
                this.messageService.add({ severity: 'success', summary: 'Stage updated', detail: `${opportunity.opportunityNumber} moved successfully.`, life: 3000 });
                this.refreshData();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Stage could not be updated.';
                this.messageService.add({ severity: 'error', summary: 'Stage update failed', detail, life: 5000 });
                this.isSaving = false;
            }
        });
    }

    cancelStageChange(): void {
        this.stageChangeDialog = false;
        this.clearPendingStageChange();
    }

    createOpportunity(): void {
        this.opportunityForm.markAllAsTouched();
        if (this.opportunityForm.invalid) {
            return;
        }

        this.isSaving = true;
        this.opportunityApiService.createOpportunity(this.buildCreateRequest()).subscribe({
            next: (opportunity) => {
                this.createDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Opportunity created', detail: `${opportunity.opportunityNumber} was created successfully.`, life: 4000 });
                this.refreshData();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Failed to create opportunity.';
                this.messageService.add({ severity: 'error', summary: 'Validation failed', detail, life: 6000 });
                this.isSaving = false;
            }
        });
    }

    updateOpportunity(): void {
        this.editForm.markAllAsTouched();
        if (this.editForm.invalid || !this.selectedOpportunity) {
            return;
        }

        this.isSaving = true;
        this.opportunityApiService.updateOpportunity(this.selectedOpportunity.id, this.buildUpdateRequest()).subscribe({
            next: (opportunity) => {
                this.editDialog = false;
                this.selectedOpportunity = undefined;
                this.messageService.add({ severity: 'success', summary: 'Opportunity updated', detail: `${opportunity.opportunityNumber} was updated successfully.`, life: 4000 });
                this.refreshData();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Failed to update opportunity.';
                this.messageService.add({ severity: 'error', summary: 'Validation failed', detail, life: 6000 });
                this.isSaving = false;
            }
        });
    }

    addActivity(): void {
        this.activityForm.markAllAsTouched();
        if (this.activityForm.invalid || !this.selectedOpportunity) {
            return;
        }

        this.isSaving = true;
        this.opportunityApiService.createActivity(this.selectedOpportunity.id, this.buildActivityRequest()).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Activity added', detail: 'Opportunity activity was saved.', life: 3000 });
                this.openActivityDialog(this.selectedOpportunity!);
                this.isSaving = false;
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Activity could not be saved.';
                this.messageService.add({ severity: 'error', summary: 'Activity failed', detail, life: 5000 });
                this.isSaving = false;
            }
        });
    }

    closeOpportunity(): void {
        this.closeForm.markAllAsTouched();
        if (this.closeForm.invalid || !this.selectedOpportunity) {
            return;
        }

        const value = this.closeForm.getRawValue();
        if (this.closingMode === 'won' && value.finalAmount == null) {
            this.messageService.add({ severity: 'warn', summary: 'Final amount required', detail: 'Enter the final won amount.', life: 4000 });
            return;
        }

        if (this.closingMode === 'lost' && !value.lostReason?.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Lost reason required', detail: 'Enter why the opportunity was lost.', life: 4000 });
            return;
        }

        this.isSaving = true;
        const request = {
            finalAmount: value.finalAmount ?? undefined,
            lostReason: value.lostReason?.trim() || undefined,
            closedDate: new Date(value.closedDate ?? '').toISOString(),
            note: value.note?.trim() || undefined
        };
        const action = this.closingMode === 'won' ? this.opportunityApiService.closeAsWon(this.selectedOpportunity.id, request) : this.opportunityApiService.closeAsLost(this.selectedOpportunity.id, request);

        action.subscribe({
            next: () => {
                this.closeDialog = false;
                this.messageService.add({ severity: 'success', summary: `Opportunity ${this.closingMode}`, detail: `${this.selectedOpportunity?.opportunityNumber} was closed.`, life: 4000 });
                this.refreshData();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Opportunity could not be closed.';
                this.messageService.add({ severity: 'error', summary: 'Close failed', detail, life: 6000 });
                this.isSaving = false;
            }
        });
    }

    formatCurrency(value: number, currencyCode?: string): string {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currencyCode || 'USD',
            maximumFractionDigits: 2
        }).format(value ?? 0);
    }

    formatDate(value?: string): string {
        return value ? new Date(value).toLocaleDateString() : 'Not set';
    }

    closeDatePicker(picker: DatePicker): void {
        setTimeout(() => picker.hideOverlay(), 0);
    }

    statusSeverity(status?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const normalized = status?.toLowerCase();
        if (normalized === 'won') return 'success';
        if (normalized === 'lost') return 'danger';
        return 'info';
    }

    stageOptionsFor(opportunity: OpportunityListItemViewModel): LookupViewModel[] {
        return this.stages.filter((stage) => !stage.isFinal && (stage.sequence ?? 0) > opportunity.stageSequence);
    }

    get pipelineGridTemplate(): string {
        return `repeat(${Math.max(this.pipelineStages.length, 1)}, minmax(14rem, 1fr))`;
    }

    get pipelineMinWidth(): string {
        return `${Math.max(this.pipelineStages.length, 1) * 16}rem`;
    }

    applyFilters(): void {
        this.first = 0;
        this.pageNumber = 1;
        this.refreshData();
    }

    clearFilters(): void {
        this.filterForm.reset({
            searchTerm: '',
            clientId: '',
            stageId: '',
            ownerUserId: '',
            status: 'Open'
        });
        this.applyFilters();
    }

    onLazyLoad(event: { first?: number | null; rows?: number | null; sortField?: string | string[] | null; sortOrder?: number | null }): void {
        this.first = event.first ?? 0;
        this.pageSize = event.rows ?? this.pageSize;
        this.pageNumber = Math.floor(this.first / this.pageSize) + 1;
        this.sortField = Array.isArray(event.sortField) ? (event.sortField[0] ?? '') : (event.sortField ?? '');
        this.sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
        this.loadOpportunities();
    }

    private loadPage(): void {
        this.isLoading = true;
        this.opportunityApiService.getLookupBundle().subscribe({
            next: (lookups) => {
                this.applyLookups(lookups);
                this.refreshData();
            },
            error: () => {
                this.errorMessage = 'Unable to load opportunity lookups.';
                this.isLoading = false;
            }
        });
    }

    private refreshData(): void {
        this.isLoading = true;
        forkJoin({
            list: this.opportunityApiService.getOpportunities(this.buildListQuery()),
            pipeline: this.opportunityApiService.getPipeline(this.buildPipelineQuery())
        }).subscribe({
            next: (result) => {
                this.opportunities = result.list.items;
                this.totalRecords = result.list.totalCount;
                this.pageNumber = result.list.pageNumber;
                this.pageSize = result.list.pageSize;
                this.pipelineStages = result.pipeline;
                this.errorMessage = '';
                this.isSaving = false;
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Unable to load opportunities.';
                this.isSaving = false;
                this.isLoading = false;
            }
        });
    }

    private loadOpportunities(): void {
        this.isLoading = true;
        this.opportunityApiService.getOpportunities(this.buildListQuery()).subscribe({
            next: (result) => {
                this.opportunities = result.items;
                this.totalRecords = result.totalCount;
                this.pageNumber = result.pageNumber;
                this.pageSize = result.pageSize;
                this.errorMessage = '';
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Unable to load opportunities.';
                this.isLoading = false;
            }
        });
    }

    private applyLookups(lookups: OpportunityLookupBundle): void {
        this.clients = lookups.clients;
        this.allContacts = lookups.contacts;
        this.products = lookups.products;
        this.leads = lookups.leads.filter((lead) => lead.status.toLowerCase() !== 'converted');
        this.users = lookups.ownerUsers.filter((user) => user.isActive !== false);
        this.currencies = lookups.currencies;
        this.stages = lookups.stages;
        this.statuses = lookups.statuses;
    }

    private buildListQuery(): OpportunityListQuery {
        return {
            ...this.buildPipelineQuery(),
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sortField: this.sortField || undefined,
            sortDirection: this.sortField ? this.sortDirection : undefined
        };
    }

    private buildPipelineQuery(): OpportunityListQuery {
        const filters = this.filterForm.getRawValue();
        return {
            searchTerm: filters.searchTerm?.trim() || undefined,
            clientId: filters.clientId || undefined,
            stageId: filters.stageId || undefined,
            ownerUserId: filters.ownerUserId || undefined
        };
    }

    private buildCreateRequest(): CreateOpportunityRequest {
        const value = this.opportunityForm.getRawValue();
        return {
            clientId: value.clientId ?? '',
            contactId: value.contactId ?? '',
            leadId: value.leadId || undefined,
            productId: value.productId ?? '',
            title: value.title ?? '',
            estimatedValue: value.estimatedValue ?? 0,
            currencyId: value.currencyId ?? '',
            ownerUserId: value.ownerUserId ?? '',
            expectedCloseDate: value.expectedCloseDate ? new Date(value.expectedCloseDate).toISOString() : undefined,
            licenseFee: value.licenseFee || undefined,
            amcFee: value.amcFee || undefined,
            implementationFee: value.implementationFee || undefined,
            subscriptionFee: value.subscriptionFee || undefined
        };
    }

    private buildUpdateRequest(): UpdateOpportunityRequest {
        const value = this.editForm.getRawValue();
        return {
            id: this.selectedOpportunity?.id ?? '',
            title: value.title ?? '',
            estimatedValue: value.estimatedValue ?? 0,
            ownerUserId: value.ownerUserId ?? ''
        };
    }

    private buildActivityRequest(): CreateOpportunityActivityRequest {
        const value = this.activityForm.getRawValue();
        return {
            activityType: value.activityType ?? 'Note',
            subject: value.subject?.trim() || undefined,
            notes: value.notes ?? '',
            activityDate: value.activityDate ? new Date(value.activityDate).toISOString() : undefined,
            followUpDate: value.followUpDate ? new Date(value.followUpDate).toISOString() : undefined
        };
    }

    private clearPendingStageChange(): void {
        this.pendingStageOpportunity = undefined;
        this.pendingStageId = '';
        this.pendingStageName = '';
    }
}
