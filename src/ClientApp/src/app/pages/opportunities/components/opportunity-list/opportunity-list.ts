import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, merge, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
import { CreateOpportunityActivityRequest, CreateOpportunityRequest, OpportunityListQuery, SaveOpportunityCommercialBreakdownRequest, UpdateOpportunityRequest } from '../../dtos/opportunity.dto';
import {
    ClientLookupViewModel,
    ContactLookupViewModel,
    CurrencyLookupViewModel,
    LeadLookupViewModel,
    LookupViewModel,
    OpportunityActivityViewModel,
    OpportunityCommercialBreakdownViewModel,
    OpportunityCommercialDocumentViewModel,
    OpportunityListItemViewModel,
    OpportunityLookupBundle,
    OpportunityPipelineStageViewModel,
    OpportunityStageHistoryViewModel,
    OpportunityUserLookupViewModel,
    ProductLookupViewModel
} from '../../view-models/opportunity.view-model';
import { OpportunityApiService } from '../../services/opportunity-api.service';
import { NotificationApiService } from '../../../notifications/services/notification-api.service';

@Component({
    selector: 'app-opportunity-list',
    standalone: true,
    imports: [ButtonModule, CommonModule, ConfirmDialogModule, DatePickerModule, DialogModule, InputNumberModule, InputTextModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, ToastModule],
    templateUrl: './opportunity-list.html',
    styleUrls: ['./opportunity-list.scss'],
    providers: [ConfirmationService, MessageService]
})
export class OpportunityList implements OnInit, OnDestroy {
    private readonly proposalSentStageName = 'proposal sent';
    private readonly maxProposalDocumentBytes = 10 * 1024 * 1024;
    private readonly maxCommercialDocumentBytes = 10 * 1024 * 1024;
    private readonly allowedProposalDocumentExtensions = new Set(['.pdf', '.doc', '.docx']);
    private readonly allowedCommercialDocumentExtensions = new Set(['.pdf', '.doc', '.docx']);

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
    commercialDocumentTypes = [
        { label: 'Agreement', value: 'Agreement' },
        { label: 'Purchase Order', value: 'PurchaseOrder' }
    ];
    subscriptionBillingFrequencies = [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Quarterly', value: 'Quarterly' },
        { label: 'Semi Annual', value: 'SemiAnnual' },
        { label: 'Annual', value: 'Annual' }
    ];

    viewMode: 'pipeline' | 'list' = 'pipeline';
    isLoading = true;
    isSaving = false;
    createDialog = false;
    editDialog = false;
    closeDialog = false;
    activityDialog = false;
    stageChangeDialog = false;
    commercialDialog = false;
    closingMode: 'won' | 'lost' = 'won';
    canCreate = false;
    canEdit = false;
    canApprove = false;
    errorMessage = '';
    selectedOpportunity?: OpportunityListItemViewModel;
    pendingStageOpportunity?: OpportunityListItemViewModel;
    pendingStageId = '';
    pendingStageName = '';
    selectedProposalDocument?: File;
    proposalDocumentError = '';
    draggedOpportunity?: OpportunityListItemViewModel;
    dragOverStageId = '';
    stageHistory: OpportunityStageHistoryViewModel[] = [];
    activities: OpportunityActivityViewModel[] = [];
    commercialDocuments: OpportunityCommercialDocumentViewModel[] = [];
    commercialBreakdown?: OpportunityCommercialBreakdownViewModel | null;
    selectedCommercialDocument?: File;
    commercialDocumentError = '';
    commercialError = '';
    isLoadingCommercial = false;
    isSavingCommercial = false;
    isResolvingCommercialReminder = false;
    totalRecords = 0;
    first = 0;
    pageNumber = 1;
    pageSize = 10;
    sortField = '';
    sortDirection: 'asc' | 'desc' = 'desc';

    private readonly fb = inject(FormBuilder);
    private readonly subscriptions = new Subscription();

    filterForm = this.fb.group({
        searchTerm: [''],
        clientId: [''],
        stageId: [''],
        ownerUserId: [''],
        status: ['']
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

    commercialUploadForm = this.fb.group({
        documentType: ['Agreement' as 'Agreement' | 'PurchaseOrder', Validators.required],
        remarks: ['', Validators.maxLength(1000)]
    });

    commercialForm = this.fb.group({
        currencyId: ['', Validators.required],
        finalPayableAmount: [0, [Validators.required, Validators.min(0)]],
        agreementDocumentId: [''],
        agreementDate: [''],
        agreementExpiryDate: [''],
        purchaseOrderDocumentId: [''],
        purchaseOrderDate: [''],
        amcApplicable: [false],
        amcAmount: [0],
        amcStartDate: [''],
        amcRenewalDate: [''],
        amcExpiryDate: [''],
        subscriptionApplicable: [false],
        subscriptionAmount: [0],
        subscriptionBillingFrequency: [''],
        subscriptionStartDate: [''],
        nextSubscriptionBillingDate: [''],
        remarks: ['', Validators.maxLength(1000)]
    });

    constructor(
        private readonly opportunityApiService: OpportunityApiService,
        private readonly notificationApiService: NotificationApiService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.opportunities.create);
        this.canEdit = this.authService.hasPermission(Permissions.opportunities.edit);
        this.canApprove = this.authService.hasPermission(Permissions.opportunities.approve);
        this.registerCommercialFormHandlers();
        this.loadPage();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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

    openCommercialDialog(opportunity: OpportunityListItemViewModel): void {
        this.selectedOpportunity = opportunity;
        this.commercialDialog = true;
        this.commercialDocuments = [];
        this.commercialBreakdown = undefined;
        this.commercialError = '';
        this.selectedCommercialDocument = undefined;
        this.commercialDocumentError = '';
        this.commercialUploadForm.reset({ documentType: 'Agreement', remarks: '' });
        this.resetCommercialForm(opportunity);
        this.loadCommercialFinalization(opportunity.id);
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

    get isProposalSentTarget(): boolean {
        return this.normalizeStageName(this.pendingStageName) === this.proposalSentStageName;
    }

    get isProposalDocumentRequired(): boolean {
        return this.isProposalSentTarget && this.pendingStageOpportunity?.hasProposalDocument !== true;
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
        this.selectedProposalDocument = undefined;
        this.proposalDocumentError = '';
        this.stageChangeForm.reset({ remarks: '' });
        this.stageChangeDialog = true;
    }

    confirmStageChange(): void {
        this.stageChangeForm.markAllAsTouched();
        if (this.stageChangeForm.invalid || !this.pendingStageOpportunity || !this.pendingStageId) {
            return;
        }

        if (this.isProposalDocumentRequired && !this.selectedProposalDocument) {
            this.proposalDocumentError = 'Final proposal document is required when moving an opportunity to Proposal Sent.';
            return;
        }

        if (this.selectedProposalDocument && !this.isValidProposalDocument(this.selectedProposalDocument)) {
            return;
        }

        const opportunity = this.pendingStageOpportunity;
        const value = this.stageChangeForm.getRawValue();
        this.isSaving = true;
        this.opportunityApiService.changeStage(opportunity.id, { stageId: this.pendingStageId, remarks: value.remarks?.trim() || undefined, proposalDocument: this.selectedProposalDocument }).subscribe({
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

    onProposalDocumentSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.item(0) ?? undefined;
        this.selectedProposalDocument = file;
        this.proposalDocumentError = '';

        if (file) {
            this.isValidProposalDocument(file);
        }
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
            currency: currencyCode || 'NPR',
            currencyDisplay: 'code',
            maximumFractionDigits: 2
        }).format(value ?? 0);
    }

    formatDate(value?: string): string {
        return value ? new Date(value).toLocaleDateString() : 'Not set';
    }

    closeDatePicker(picker: DatePicker): void {
        setTimeout(() => picker.hideOverlay(), 0);
    }

    downloadProposalDocument(opportunity: OpportunityListItemViewModel): void {
        if (!opportunity.hasProposalDocument) {
            return;
        }

        this.opportunityApiService.downloadProposalDocument(opportunity.id).subscribe({
            next: (blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = opportunity.proposalDocumentFileName || `${opportunity.opportunityNumber}-proposal`;
                link.click();
                URL.revokeObjectURL(url);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Download failed', detail: 'Proposal document could not be downloaded.', life: 5000 });
            }
        });
    }

    onCommercialDocumentSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.item(0) ?? undefined;
        this.selectedCommercialDocument = file;
        this.commercialDocumentError = '';

        if (file) {
            this.isValidCommercialDocument(file);
        }
    }

    uploadCommercialDocument(): void {
        this.commercialUploadForm.markAllAsTouched();
        if (this.commercialUploadForm.invalid || !this.selectedOpportunity) {
            return;
        }

        if (!this.selectedCommercialDocument) {
            this.commercialDocumentError = 'Agreement or PO document is required.';
            return;
        }

        if (!this.isValidCommercialDocument(this.selectedCommercialDocument)) {
            return;
        }

        const value = this.commercialUploadForm.getRawValue();
        this.isSavingCommercial = true;
        this.opportunityApiService
            .uploadCommercialDocument(this.selectedOpportunity.id, {
                documentType: value.documentType ?? 'Agreement',
                remarks: value.remarks?.trim() || undefined,
                commercialDocument: this.selectedCommercialDocument
            })
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Document uploaded', detail: 'Agreement/PO document was saved.', life: 3000 });
                    this.selectedCommercialDocument = undefined;
                    this.commercialUploadForm.reset({ documentType: value.documentType ?? 'Agreement', remarks: '' });
                    this.loadCommercialFinalization(this.selectedOpportunity!.id);
                    this.isSavingCommercial = false;
                },
                error: (error) => {
                    const detail = error.error?.errors?.join?.(' ') ?? 'Agreement/PO document could not be uploaded.';
                    this.messageService.add({ severity: 'error', summary: 'Upload failed', detail, life: 5000 });
                    this.isSavingCommercial = false;
                }
            });
    }

    previewCommercialDocument(document: OpportunityCommercialDocumentViewModel): void {
        if (!this.selectedOpportunity) {
            return;
        }

        const previewWindow = window.open('', '_blank');
        if (!previewWindow) {
            this.messageService.add({ severity: 'warn', summary: 'Preview blocked', detail: 'Allow pop-ups for this site and try preview again.', life: 5000 });
            return;
        }

        previewWindow.opener = null;
        previewWindow.document.write('<p>Loading document preview...</p>');
        this.opportunityApiService.previewCommercialDocument(this.selectedOpportunity.id, document.id).subscribe({
            next: (blob) => {
                const url = URL.createObjectURL(blob);
                previewWindow.location.href = url;
                setTimeout(() => URL.revokeObjectURL(url), 60000);
            },
            error: (error) => {
                previewWindow.close();
                this.showBlobError(error, 'Preview failed', 'Document preview is unavailable.');
            }
        });
    }

    downloadCommercialDocument(commercialDocument: OpportunityCommercialDocumentViewModel): void {
        if (!this.selectedOpportunity) {
            return;
        }

        this.opportunityApiService.downloadCommercialDocument(this.selectedOpportunity.id, commercialDocument.id).subscribe({
            next: (blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = commercialDocument.fileName;
                link.rel = 'noopener';
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            },
            error: (error) => {
                this.showBlobError(error, 'Download failed', 'Document could not be downloaded.');
            }
        });
    }

    confirmDeleteCommercialDocument(commercialDocument: OpportunityCommercialDocumentViewModel): void {
        this.confirmationService.confirm({
            message: `Delete ${commercialDocument.fileName}?`,
            header: 'Delete Document',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteCommercialDocument(commercialDocument)
        });
    }

    deleteCommercialDocument(commercialDocument: OpportunityCommercialDocumentViewModel): void {
        if (!this.selectedOpportunity) {
            return;
        }

        this.isSavingCommercial = true;
        this.opportunityApiService.deleteCommercialDocument(this.selectedOpportunity.id, commercialDocument.id).subscribe({
            next: () => {
                this.commercialDocuments = this.commercialDocuments.filter((document) => document.id !== commercialDocument.id);
                this.clearDeletedCommercialDocumentSelection(commercialDocument);
                this.messageService.add({ severity: 'success', summary: 'Document deleted', detail: 'Agreement/PO document was removed.', life: 3000 });
                this.isSavingCommercial = false;
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Agreement/PO document could not be deleted.';
                this.messageService.add({ severity: 'error', summary: 'Delete failed', detail, life: 6000 });
                this.isSavingCommercial = false;
            }
        });
    }

    saveCommercialBreakdown(): void {
        this.commercialForm.markAllAsTouched();
        this.commercialError = '';

        if (this.commercialForm.invalid || !this.selectedOpportunity) {
            return;
        }

        const request = this.buildCommercialBreakdownRequest();
        const errors = this.validateCommercialBreakdownRequest(request);
        if (errors.length) {
            this.commercialError = errors.join(' ');
            return;
        }

        this.isSavingCommercial = true;
        this.opportunityApiService.saveCommercialBreakdown(this.selectedOpportunity.id, request).subscribe({
            next: (breakdown) => {
                this.commercialBreakdown = breakdown;
                this.patchCommercialForm(breakdown);
                this.commercialDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Commercial breakdown saved', detail: 'Final commercial details were recorded.', life: 3000 });
                this.isSavingCommercial = false;
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Commercial breakdown could not be saved.';
                this.messageService.add({ severity: 'error', summary: 'Save failed', detail, life: 6000 });
                this.isSavingCommercial = false;
            }
        });
    }

    commercialReminderEvents(): { label: string; eventType: string; dueDate?: string }[] {
        const breakdown = this.commercialBreakdown;
        if (!breakdown) {
            return [];
        }

        const events = [
            { label: 'Agreement expiry', eventType: 'AgreementExpiry', dueDate: breakdown.agreementExpiryDate },
            { label: 'AMC renewal', eventType: 'AmcRenewal', dueDate: breakdown.amcApplicable ? breakdown.amcRenewalDate : undefined },
            { label: 'AMC expiry', eventType: 'AmcExpiry', dueDate: breakdown.amcApplicable ? breakdown.amcExpiryDate : undefined },
            { label: 'Subscription billing', eventType: 'SubscriptionBilling', dueDate: breakdown.subscriptionApplicable ? breakdown.nextSubscriptionBillingDate : undefined }
        ];

        return events.filter((event) => !!event.dueDate);
    }

    resolveCommercialReminder(eventType: string, sourceDueDate?: string): void {
        if (!this.commercialBreakdown || !sourceDueDate) {
            return;
        }

        this.isResolvingCommercialReminder = true;
        this.notificationApiService
            .resolveEvent({
                eventType,
                sourceRecordType: 'OpportunityCommercialBreakdown',
                sourceRecordId: this.commercialBreakdown.id,
                sourceDueDate,
                resolutionRemarks: 'Resolved from opportunity commercial breakdown.'
            })
            .subscribe({
                next: () => {
                    this.isResolvingCommercialReminder = false;
                    this.messageService.add({ severity: 'success', summary: 'Reminder resolved', detail: 'Future reminders for this event will stop.', life: 3000 });
                },
                error: (error) => {
                    const detail = error.error?.errors?.join?.(' ') ?? 'Reminder event could not be resolved.';
                    this.isResolvingCommercialReminder = false;
                    this.messageService.add({ severity: 'error', summary: 'Resolve failed', detail, life: 6000 });
                }
            });
    }

    canManageCommercial(opportunity: OpportunityListItemViewModel): boolean {
        return this.canEdit && this.isWonOpportunity(opportunity);
    }

    isWonOpportunity(opportunity?: OpportunityListItemViewModel): boolean {
        return opportunity?.status?.toLowerCase() === 'won';
    }

    documentTypeLabel(value?: string): string {
        return value === 'PurchaseOrder' ? 'Purchase Order' : 'Agreement';
    }

    formatFileSize(bytes?: number): string {
        if (!bytes) {
            return '0 KB';
        }

        return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
    }

    get agreementDocuments(): OpportunityCommercialDocumentViewModel[] {
        return this.commercialDocuments.filter((document) => document.documentType === 'Agreement');
    }

    get purchaseOrderDocuments(): OpportunityCommercialDocumentViewModel[] {
        return this.commercialDocuments.filter((document) => document.documentType === 'PurchaseOrder');
    }

    get hasCommercialDocument(): boolean {
        return this.commercialDocuments.length > 0;
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

    showCreateError(controlName: string, errorName?: string): boolean {
        const control = this.opportunityForm.get(controlName);
        if (!control || !(control.touched || control.dirty)) {
            return false;
        }

        return errorName ? control.hasError(errorName) : control.invalid;
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
            status: ''
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

    private loadCommercialFinalization(opportunityId: string): void {
        this.isLoadingCommercial = true;
        forkJoin({
            documents: this.opportunityApiService.getCommercialDocuments(opportunityId),
            breakdown: this.opportunityApiService.getCommercialBreakdown(opportunityId)
        }).subscribe({
            next: (result) => {
                this.commercialDocuments = result.documents;
                this.commercialBreakdown = result.breakdown;
                if (result.breakdown) {
                    this.patchCommercialForm(result.breakdown);
                } else if (this.selectedOpportunity) {
                    this.resetCommercialForm(this.selectedOpportunity);
                }
                this.isLoadingCommercial = false;
            },
            error: () => {
                this.commercialError = 'Commercial finalization details could not be loaded.';
                this.isLoadingCommercial = false;
            }
        });
    }

    private showBlobError(error: unknown, summary: string, fallback: string): void {
        const errorBlob = (error as { error?: unknown })?.error;
        if (errorBlob instanceof Blob && errorBlob.type.includes('application/json')) {
            errorBlob
                .text()
                .then((text) => {
                    try {
                        const parsed = JSON.parse(text) as { errors?: string[]; message?: string };
                        const detail = parsed.errors?.join(' ') || parsed.message || fallback;
                        this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
                    } catch {
                        this.messageService.add({ severity: 'error', summary, detail: fallback, life: 5000 });
                    }
                })
                .catch(() => this.messageService.add({ severity: 'error', summary, detail: fallback, life: 5000 }));
            return;
        }

        this.messageService.add({ severity: 'error', summary, detail: fallback, life: 5000 });
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
            expectedCloseDate: value.expectedCloseDate ? new Date(value.expectedCloseDate).toISOString() : undefined
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
        this.selectedProposalDocument = undefined;
        this.proposalDocumentError = '';
    }

    private resetCommercialForm(opportunity: OpportunityListItemViewModel): void {
        this.commercialForm.reset({
            currencyId: opportunity.currencyId,
            finalPayableAmount: opportunity.finalAmount ?? opportunity.estimatedValue ?? 0,
            agreementDocumentId: '',
            agreementDate: '',
            agreementExpiryDate: '',
            purchaseOrderDocumentId: '',
            purchaseOrderDate: '',
            amcApplicable: false,
            amcAmount: 0,
            amcStartDate: '',
            amcRenewalDate: '',
            amcExpiryDate: '',
            subscriptionApplicable: false,
            subscriptionAmount: 0,
            subscriptionBillingFrequency: '',
            subscriptionStartDate: '',
            nextSubscriptionBillingDate: '',
            remarks: ''
        });
    }

    private patchCommercialForm(breakdown: OpportunityCommercialBreakdownViewModel): void {
        this.commercialForm.reset({
            currencyId: breakdown.currencyId,
            finalPayableAmount: breakdown.finalPayableAmount,
            agreementDocumentId: breakdown.agreementDocumentId ?? '',
            agreementDate: this.formatDateInput(breakdown.agreementDate),
            agreementExpiryDate: this.formatDateInput(breakdown.agreementExpiryDate),
            purchaseOrderDocumentId: breakdown.purchaseOrderDocumentId ?? '',
            purchaseOrderDate: this.formatDateInput(breakdown.purchaseOrderDate),
            amcApplicable: breakdown.amcApplicable,
            amcAmount: breakdown.amcAmount ?? 0,
            amcStartDate: this.formatDateInput(breakdown.amcStartDate),
            amcRenewalDate: this.formatDateInput(breakdown.amcRenewalDate),
            amcExpiryDate: this.formatDateInput(breakdown.amcExpiryDate),
            subscriptionApplicable: breakdown.subscriptionApplicable,
            subscriptionAmount: breakdown.subscriptionAmount ?? 0,
            subscriptionBillingFrequency: breakdown.subscriptionBillingFrequency ?? '',
            subscriptionStartDate: this.formatDateInput(breakdown.subscriptionStartDate),
            nextSubscriptionBillingDate: this.formatDateInput(breakdown.nextSubscriptionBillingDate),
            remarks: breakdown.remarks ?? ''
        });
    }

    private clearDeletedCommercialDocumentSelection(commercialDocument: OpportunityCommercialDocumentViewModel): void {
        if (commercialDocument.documentType === 'Agreement' && this.commercialForm.controls.agreementDocumentId.value === commercialDocument.id) {
            this.commercialForm.patchValue({ agreementDocumentId: '', agreementDate: '', agreementExpiryDate: '' });
        }

        if (commercialDocument.documentType === 'PurchaseOrder' && this.commercialForm.controls.purchaseOrderDocumentId.value === commercialDocument.id) {
            this.commercialForm.patchValue({ purchaseOrderDocumentId: '', purchaseOrderDate: '' });
        }
    }

    private registerCommercialFormHandlers(): void {
        const controls = this.commercialForm.controls;
        this.subscriptions.add(
            merge(
                controls.subscriptionApplicable.valueChanges,
                controls.subscriptionBillingFrequency.valueChanges,
                controls.subscriptionStartDate.valueChanges
            ).subscribe(() => this.updateNextSubscriptionBillingDate())
        );
    }

    private updateNextSubscriptionBillingDate(): void {
        const controls = this.commercialForm.controls;
        if (!controls.subscriptionApplicable.value) {
            if (controls.nextSubscriptionBillingDate.value) {
                controls.nextSubscriptionBillingDate.patchValue('', { emitEvent: false });
            }
            return;
        }

        const nextBillingDate = this.calculateNextSubscriptionBillingDate(
            controls.subscriptionStartDate.value,
            controls.subscriptionBillingFrequency.value
        );

        if (controls.nextSubscriptionBillingDate.value !== nextBillingDate) {
            controls.nextSubscriptionBillingDate.patchValue(nextBillingDate, { emitEvent: false });
        }
    }

    private buildCommercialBreakdownRequest(): SaveOpportunityCommercialBreakdownRequest {
        const value = this.commercialForm.getRawValue();
        return {
            currencyId: value.currencyId ?? '',
            finalPayableAmount: value.finalPayableAmount ?? 0,
            agreementDocumentId: value.agreementDocumentId || undefined,
            agreementDate: this.toIsoDate(value.agreementDate),
            agreementExpiryDate: this.toIsoDate(value.agreementExpiryDate),
            purchaseOrderDocumentId: value.purchaseOrderDocumentId || undefined,
            purchaseOrderDate: this.toIsoDate(value.purchaseOrderDate),
            amcApplicable: value.amcApplicable ?? false,
            amcAmount: value.amcApplicable ? (value.amcAmount ?? 0) : undefined,
            amcStartDate: value.amcApplicable ? this.toIsoDate(value.amcStartDate) : undefined,
            amcRenewalDate: value.amcApplicable ? this.toIsoDate(value.amcRenewalDate) : undefined,
            amcExpiryDate: value.amcApplicable ? this.toIsoDate(value.amcExpiryDate) : undefined,
            subscriptionApplicable: value.subscriptionApplicable ?? false,
            subscriptionAmount: value.subscriptionApplicable ? (value.subscriptionAmount ?? 0) : undefined,
            subscriptionBillingFrequency: value.subscriptionApplicable ? value.subscriptionBillingFrequency || undefined : undefined,
            subscriptionStartDate: value.subscriptionApplicable ? this.toIsoDate(value.subscriptionStartDate) : undefined,
            nextSubscriptionBillingDate: undefined,
            remarks: value.remarks?.trim() || undefined
        };
    }

    private validateCommercialBreakdownRequest(request: SaveOpportunityCommercialBreakdownRequest): string[] {
        const errors: string[] = [];

        if (!this.hasCommercialDocument) {
            errors.push('Upload an Agreement or PO document before saving commercial breakdown.');
        }

        if (!request.agreementDocumentId && !request.purchaseOrderDocumentId) {
            errors.push('Select at least one Agreement or PO document reference.');
        }

        if (request.agreementDocumentId && (!request.agreementDate || !request.agreementExpiryDate)) {
            errors.push('Agreement date and expiry date are required.');
        }

        if (request.purchaseOrderDocumentId && !request.purchaseOrderDate) {
            errors.push('PO date is required.');
        }

        if (request.amcApplicable && (request.amcAmount == null || !request.amcStartDate || !request.amcRenewalDate || !request.amcExpiryDate)) {
            errors.push('AMC amount, start date, renewal date, and expiry date are required.');
        }

        if (request.subscriptionApplicable && (request.subscriptionAmount == null || !request.subscriptionBillingFrequency || !request.subscriptionStartDate)) {
            errors.push('Subscription amount, billing frequency, and start date are required.');
        }

        return errors;
    }

    private isValidProposalDocument(file: File): boolean {
        const extension = this.fileExtension(file.name);
        if (!this.allowedProposalDocumentExtensions.has(extension)) {
            this.proposalDocumentError = 'Proposal document must be a PDF, DOC, or DOCX file.';
            return false;
        }

        if (file.size > this.maxProposalDocumentBytes) {
            this.proposalDocumentError = 'Proposal document must be 10 MB or smaller.';
            return false;
        }

        this.proposalDocumentError = '';
        return true;
    }

    private isValidCommercialDocument(file: File): boolean {
        const extension = this.fileExtension(file.name);
        if (!this.allowedCommercialDocumentExtensions.has(extension)) {
            this.commercialDocumentError = 'Agreement or PO document must be a PDF, DOC, or DOCX file.';
            return false;
        }

        if (file.size > this.maxCommercialDocumentBytes) {
            this.commercialDocumentError = 'Agreement or PO document must be 10 MB or smaller.';
            return false;
        }

        this.commercialDocumentError = '';
        return true;
    }

    private fileExtension(fileName: string): string {
        const index = fileName.lastIndexOf('.');
        return index >= 0 ? fileName.slice(index).toLowerCase() : '';
    }

    private normalizeStageName(value?: string): string {
        return (value ?? '').trim().toLowerCase();
    }

    private formatDateInput(value?: string): string {
        return value ? new Date(value).toISOString().slice(0, 10) : '';
    }

    private toIsoDate(value?: string | null): string | undefined {
        return value ? new Date(value).toISOString() : undefined;
    }

    private calculateNextSubscriptionBillingDate(startDate?: string | null, frequency?: string | null): string {
        if (!startDate || !frequency) {
            return '';
        }

        const months = this.billingFrequencyMonths(frequency);
        if (!months) {
            return '';
        }

        const parsedDate = this.parseDateOnly(startDate);
        if (!parsedDate) {
            return '';
        }

        const target = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth() + months, 1));
        const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
        target.setUTCDate(Math.min(parsedDate.getUTCDate(), lastDay));
        return target.toISOString().slice(0, 10);
    }

    private billingFrequencyMonths(frequency: string): number {
        switch (frequency) {
            case 'Monthly':
                return 1;
            case 'Quarterly':
                return 3;
            case 'SemiAnnual':
                return 6;
            case 'Annual':
                return 12;
            default:
                return 0;
        }
    }

    private parseDateOnly(value: string): Date | undefined {
        const parts = value.split('-').map(Number);
        if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
            return undefined;
        }

        return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    }
}
