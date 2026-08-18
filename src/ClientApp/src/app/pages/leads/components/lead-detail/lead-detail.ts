import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { forkJoin, of, Subscription } from 'rxjs';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { UserListItemViewModel } from '@/pages/users/view-models/user-list-item.view-model';
import { NEPAL_CONTACT_NUMBER_MESSAGE, NEPAL_CONTACT_NUMBER_PATTERN } from '@/shared/validation/nepal-contact-number.validation';
import { ConvertLeadRequest, CreateLeadInteractionRequest } from '../../dtos/lead-action.dto';
import { UpdateLeadRequest } from '../../dtos/update-lead.request';
import { LeadApiService } from '../../services/lead.api-service';
import { ClientLookupViewModel, ContactLookupViewModel, LeadConversionViewModel, LeadInteractionViewModel, LeadLookupBundle } from '../../view-models/lead-action.view-model';
import { LeadDetailViewModel } from '../../view-models/lead-detail.view-model';

@Component({
    selector: 'app-lead-detail',
    standalone: true,
    imports: [ButtonModule, CommonModule, ConfirmDialogModule, DatePickerModule, DialogModule, InputNumberModule, InputTextModule, MultiSelectModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, TextareaModule, ToastModule],
    templateUrl: './lead-detail.html',
    providers: [ConfirmationService, MessageService]
})
export class LeadDetail implements OnInit, OnDestroy {
    private readonly nonEditableStatuses = new Set(['assigned', 'converted']);
    private readonly qualificationStatuses = new Set(['new']);

    lead?: LeadDetailViewModel;
    isLoading = true;
    isSavingStatus = false;
    isAssigning = false;
    isConverting = false;
    isSavingLead = false;
    isSavingInteraction = false;
    isDeletingInteraction = false;
    errorMessage = '';
    canEditLead = false;
    canApproveLead = false;
    qualificationDialog = false;
    disqualificationDialog = false;
    assignmentDialog = false;
    editDialog = false;
    conversionDialog = false;
    interactionDialog = false;
    conversion?: LeadConversionViewModel;
    interactions: LeadInteractionViewModel[] = [];
    editingInteractionId: string | null = null;
    leadLookups?: LeadLookupBundle;
    users: UserListItemViewModel[] = [];
    readonly interactionTypeOptions = [
        { label: 'Call', value: 'Call' },
        { label: 'Meeting', value: 'Meeting' },
        { label: 'Note', value: 'Note' }
    ];
    readonly conversionModeOptions = [
        { label: 'Create New', value: 'new' },
        { label: 'Use Existing', value: 'existing' }
    ];
    readonly contactNumberValidationMessage = NEPAL_CONTACT_NUMBER_MESSAGE;
    readonly todayStart: Date = new Date(new Date().setHours(0, 0, 0, 0));

    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private sourceSubscription?: Subscription;
    private partnerSubscription?: Subscription;
    private clientSubscription?: Subscription;
    private contactModeSubscription?: Subscription;

    qualificationForm = this.fb.group({
        qualificationRemarks: ['', [Validators.maxLength(1000)]]
    });

    disqualificationForm = this.fb.group({
        disqualificationReason: ['', [Validators.required, Validators.maxLength(500)]],
        disqualificationRemarks: ['', [Validators.maxLength(1000)]]
    });

    assignmentForm = this.fb.group({
        assignedToUserId: ['', Validators.required],
        remarks: ['', [Validators.maxLength(1000)]]
    });

    interactionForm = this.fb.group({
        interactionType: ['Call', Validators.required],
        subject: ['', [Validators.maxLength(250)]],
        notes: ['', [Validators.required, Validators.maxLength(2000)]],
        interactionDate: [{ value: null as Date | null, disabled: true }],
        nextFollowUpDate: [null as Date | null]
    });

    editForm = this.fb.group({
        sourceId: ['', Validators.required],
        categoryId: ['', Validators.required],
        partnerId: [''],
        campaignName: [''],
        sourceStartDate: [''],
        sourceEndDate: [''],
        clientId: ['', Validators.required],
        clientContactId: ['', Validators.required],
        address: [''],
        notes: [''],
        leadScore: [null as number | null],
        productIds: [[] as string[], Validators.required]
    });

    conversionForm = this.fb.group({
        productId: ['', Validators.required],
        clientId: [''],
        contactMode: ['new', Validators.required],
        contactId: [''],
        newContactFirstName: [''],
        newContactLastName: [''],
        newContactEmail: [''],
        newContactPhone: ['', Validators.pattern(NEPAL_CONTACT_NUMBER_PATTERN)],
        opportunityTitle: ['', Validators.required],
        estimatedValue: [0, [Validators.required, Validators.min(0)]],
        currencyId: ['', Validators.required],
        expectedCloseDate: [''],
        ownerUserId: ['', Validators.required]
    });

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly leadApiService: LeadApiService,
        private readonly userApiService: UserApiService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canEditLead = this.authService.hasPermission(Permissions.leads.edit);
        this.canApproveLead = this.authService.hasPermission(Permissions.leads.approve);
        this.sourceSubscription = this.editForm.controls.sourceId.valueChanges.subscribe(() => this.applyEditSourceRules());
        this.partnerSubscription = this.editForm.controls.partnerId.valueChanges.subscribe(() => this.clearUnavailableEditProducts());
        this.clientSubscription = this.editForm.controls.clientId.valueChanges.subscribe(() => this.clearUnavailableEditContact());
        this.contactModeSubscription = this.conversionForm.controls.contactMode.valueChanges.subscribe(() => this.applyConversionContactRules());
        this.loadLead();
    }

    ngOnDestroy(): void {
        this.sourceSubscription?.unsubscribe();
        this.partnerSubscription?.unsubscribe();
        this.clientSubscription?.unsubscribe();
        this.contactModeSubscription?.unsubscribe();
    }

    loadLead(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.errorMessage = 'Lead id is missing.';
            this.isLoading = false;
            return;
        }

        forkJoin({
            lead: this.leadApiService.getLead(id),
            interactions: this.leadApiService.getLeadInteractions(id)
        }).subscribe({
            next: ({ lead, interactions }) => {
                this.lead = lead;
                this.interactions = interactions;
                this.isLoading = false;
                this.errorMessage = '';
            },
            error: (error) => {
                this.errorMessage = error.status === 403 ? 'You are not allowed to view this lead.' : 'Lead was not found.';
                this.isLoading = false;
            }
        });
    }

    get statusSeverity(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (this.lead?.status?.toLowerCase()) {
            case 'qualified':
                return 'success';
            case 'disqualified':
                return 'danger';
            case 'assigned':
                return 'info';
            case 'new':
                return 'secondary';
            default:
                return 'warn';
        }
    }

    get canShowConvert(): boolean {
        return this.canApproveLead && this.canAccessAssignedLead && this.lead?.status?.toLowerCase() === 'qualified' && !this.lead.convertedOpportunityId;
    }

    get canShowQualificationActions(): boolean {
        return this.canEditLead && this.qualificationStatuses.has(this.leadStatus);
    }

    get canShowEditActions(): boolean {
        return this.canEditLead && !this.nonEditableStatuses.has(this.leadStatus);
    }

    get canShowAssignAction(): boolean {
        return this.canEditLead && this.lead?.status?.toLowerCase() === 'qualified';
    }

    get canShowInteractionAction(): boolean {
        return this.canEditLead && this.leadStatus !== 'converted';
    }

    get editActionLabel(): string {
        return this.leadStatus === 'disqualified' ? 'Re-submit' : 'Edit';
    }

    private get leadStatus(): string {
        return this.lead?.status?.toLowerCase() ?? '';
    }

    private get canAccessAssignedLead(): boolean {
        if (this.authService.hasAnyRole(['Admin', 'SuperAdmin'])) {
            return true;
        }

        const assignedToUserId = this.lead?.assignedToUserId?.toLowerCase();
        const currentUserId = this.authService.currentUser()?.userId?.toLowerCase();
        return !!assignedToUserId && assignedToUserId === currentUserId;
    }

    get leadInitials(): string {
        return this.getInitials(this.lead?.clientName || this.lead?.companyName || '');
    }

    get latestInteraction(): LeadInteractionViewModel | undefined {
        return this.interactions[0];
    }

    get nextFollowUpDate(): string | undefined {
        return this.interactions
            .filter((interaction) => !!interaction.nextFollowUpDate)
            .map((interaction) => interaction.nextFollowUpDate!)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
    }

    get openActivityCount(): number {
        return this.interactions.filter((interaction) => !!interaction.nextFollowUpDate).length;
    }

    interactionSeverity(type?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (type?.toLowerCase()) {
            case 'call':
                return 'info';
            case 'meeting':
                return 'success';
            case 'note':
                return 'secondary';
            default:
                return 'warn';
        }
    }

    interactionIcon(type?: string): string {
        switch (type?.toLowerCase()) {
            case 'call':
                return 'pi pi-phone';
            case 'meeting':
                return 'pi pi-calendar';
            case 'note':
                return 'pi pi-file-edit';
            default:
                return 'pi pi-comments';
        }
    }

    timelineIcon(eventType?: string): string {
        const normalized = eventType?.toLowerCase() ?? '';
        if (normalized.includes('created')) return 'pi pi-plus';
        if (normalized.includes('assigned')) return 'pi pi-user-plus';
        if (normalized.includes('status') || normalized.includes('qualified')) return 'pi pi-check-circle';
        if (normalized.includes('converted')) return 'pi pi-arrow-right-arrow-left';
        if (normalized.includes('interaction')) return 'pi pi-comments';
        return 'pi pi-clock';
    }

    openQualificationDialog(): void {
        if (!this.canShowQualificationActions) {
            return;
        }

        this.qualificationForm.reset({ qualificationRemarks: '' });
        this.qualificationDialog = true;
    }

    openDisqualificationDialog(): void {
        if (!this.canShowQualificationActions) {
            return;
        }

        this.disqualificationForm.reset({ disqualificationReason: '', disqualificationRemarks: '' });
        this.disqualificationDialog = true;
    }

    openAssignmentDialog(): void {
        this.assignmentForm.reset({ assignedToUserId: this.lead?.assignedToUserId ?? '', remarks: '' });
        this.assignmentDialog = true;

        if (this.users.length) {
            return;
        }

        this.isAssigning = true;
        this.userApiService.getUsers().subscribe({
            next: (users) => {
                this.users = users.filter((user) => user.isActive);
                this.isAssigning = false;
            },
            error: (error) => {
                this.handleStatusError(error);
                this.isAssigning = false;
            }
        });
    }

    openEditDialog(): void {
        if (!this.lead || !this.canShowEditActions) {
            return;
        }

        this.isSavingLead = true;
        forkJoin({
            lookups: this.leadLookups ? of(this.leadLookups) : this.leadApiService.getLookupBundle(),
            lead: this.leadApiService.getLeadForEdit(this.lead.id)
        }).subscribe({
            next: ({ lookups, lead }) => {
                this.leadLookups = lookups;
                this.editForm.reset({
                    sourceId: lead.sourceId,
                    categoryId: lead.categoryId,
                    partnerId: lead.partnerId ?? '',
                    campaignName: lead.campaignName ?? '',
                    sourceStartDate: this.formatDateInput(lead.sourceStartDate),
                    sourceEndDate: this.formatDateInput(lead.sourceEndDate),
                    clientId: lead.clientId ?? '',
                    clientContactId: lead.clientContactId ?? '',
                    address: lead.address ?? '',
                    notes: '',
                    leadScore: lead.leadScore ?? null,
                    productIds: lead.selectedProductIds
                });
                this.applyEditSourceRules();
                this.clearUnavailableEditContact();
                this.editDialog = true;
                this.isSavingLead = false;
            },
            error: (error) => {
                this.handleStatusError(error);
                this.isSavingLead = false;
            }
        });
    }

    openInteractionDialog(interaction?: LeadInteractionViewModel): void {
        this.editingInteractionId = interaction?.id ?? null;
        this.interactionForm.reset({
            interactionType: interaction?.interactionType ?? 'Call',
            subject: interaction?.subject ?? '',
            notes: interaction?.notes ?? '',
            interactionDate: interaction ? new Date(interaction.interactionDate) : new Date(),
            nextFollowUpDate: interaction?.nextFollowUpDate ? new Date(interaction.nextFollowUpDate) : null
        });
        this.interactionDialog = true;
    }

    openConversionDialog(): void {
        if (!this.lead || !this.canShowConvert) {
            return;
        }

        this.isConverting = true;
        this.leadApiService.getLeadConversion(this.lead.id).subscribe({
            next: (conversion) => {
                this.conversion = conversion;
                const firstProduct = conversion.productInterests[0]?.productId ?? '';
                const firstCurrency = conversion.currencies[0]?.id ?? '';
                const defaultOwnerUserId = conversion.defaultOwnerUserId ?? conversion.ownerUsers[0]?.id ?? '';
                const selectedClientId = this.resolveConversionClientId(conversion);
                const selectedContactId = this.resolveConversionContactId(conversion, selectedClientId);
                this.conversionForm.reset({
                    productId: firstProduct,
                    clientId: selectedClientId,
                    contactMode: selectedContactId ? 'existing' : 'new',
                    contactId: selectedContactId,
                    newContactFirstName: this.firstName(conversion.contactPersonName),
                    newContactLastName: this.lastName(conversion.contactPersonName),
                    newContactEmail: conversion.email ?? '',
                    newContactPhone: conversion.phone ?? '',
                    opportunityTitle: `${conversion.companyName} Opportunity`,
                    estimatedValue: 0,
                    currencyId: firstCurrency,
                    expectedCloseDate: '',
                    ownerUserId: defaultOwnerUserId
                });
                this.applyConversionContactRules();
                this.conversionDialog = true;
                this.isConverting = false;
            },
            error: (error) => {
                this.handleStatusError(error);
                this.isConverting = false;
            }
        });
    }

    qualifyLead(): void {
        if (!this.lead) {
            return;
        }

        this.qualificationForm.markAllAsTouched();
        if (this.qualificationForm.invalid) {
            return;
        }

        const value = this.qualificationForm.getRawValue();
        this.isSavingStatus = true;
        this.leadApiService.qualifyLead(this.lead.id, { qualificationRemarks: value.qualificationRemarks ?? undefined }).subscribe({
            next: () => {
                this.qualificationDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Lead qualified', detail: 'Conversion is now available for this lead.', life: 4000 });
                this.loadLead();
                this.isSavingStatus = false;
            },
            error: (error) => this.handleStatusError(error)
        });
    }

    disqualifyLead(): void {
        if (!this.lead) {
            return;
        }

        this.disqualificationForm.markAllAsTouched();
        if (this.disqualificationForm.invalid) {
            return;
        }

        const value = this.disqualificationForm.getRawValue();
        this.isSavingStatus = true;
        this.leadApiService
            .disqualifyLead(this.lead.id, {
                disqualificationReason: value.disqualificationReason ?? '',
                disqualificationRemarks: value.disqualificationRemarks ?? undefined
            })
            .subscribe({
                next: () => {
                    this.disqualificationDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Lead disqualified', detail: 'The reason and timeline entry were recorded.', life: 4000 });
                    this.loadLead();
                    this.isSavingStatus = false;
                },
                error: (error) => this.handleStatusError(error)
            });
    }

    assignLead(): void {
        if (!this.lead) {
            return;
        }

        this.assignmentForm.markAllAsTouched();
        if (this.assignmentForm.invalid) {
            return;
        }

        const value = this.assignmentForm.getRawValue();
        this.isAssigning = true;
        this.leadApiService
            .assignLead(this.lead.id, {
                assignedToUserId: value.assignedToUserId ?? '',
                remarks: value.remarks ?? undefined
            })
            .subscribe({
                next: () => {
                    this.assignmentDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Lead assigned', detail: 'Assignment was updated.', life: 4000 });
                    this.loadLead();
                    this.isAssigning = false;
                },
                error: (error) => {
                    this.handleStatusError(error);
                    this.isAssigning = false;
                }
            });
    }

    saveInteraction(): void {
        if (!this.lead) {
            return;
        }

        this.interactionForm.markAllAsTouched();
        if (this.interactionForm.invalid) {
            return;
        }

        const request = this.buildInteractionRequest();
        const isEditing = !!this.editingInteractionId;
        const save$ = isEditing
            ? this.leadApiService.updateLeadInteraction(this.lead.id, this.editingInteractionId!, request)
            : this.leadApiService.createLeadInteraction(this.lead.id, request);

        this.isSavingInteraction = true;
        save$.subscribe({
            next: () => {
                this.interactionDialog = false;
                const summary = isEditing ? 'Interaction updated' : 'Interaction saved';
                const detail = isEditing ? 'The interaction was updated.' : 'The interaction was added to the lead timeline.';
                this.messageService.add({ severity: 'success', summary, detail, life: 4000 });
                this.loadLead();
                this.isSavingInteraction = false;
            },
            error: (error) => {
                this.handleActionError(error, 'Interaction failed', 'Lead interaction could not be saved.');
                this.isSavingInteraction = false;
            }
        });
    }

    confirmDeleteInteraction(interaction: LeadInteractionViewModel): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this interaction?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteInteraction(interaction.id)
        });
    }

    private deleteInteraction(interactionId: string): void {
        if (!this.lead) {
            return;
        }

        this.isDeletingInteraction = true;
        this.leadApiService.deleteLeadInteraction(this.lead.id, interactionId).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Interaction deleted', detail: 'The interaction was removed from the lead timeline.', life: 4000 });
                this.loadLead();
                this.isDeletingInteraction = false;
            },
            error: (error) => {
                this.handleActionError(error, 'Delete failed', 'Lead interaction could not be deleted.');
                this.isDeletingInteraction = false;
            }
        });
    }

    convertLead(): void {
        if (!this.lead) {
            return;
        }

        this.conversionForm.markAllAsTouched();
        if (this.conversionForm.invalid) {
            return;
        }

        const request = this.buildConversionRequest();
        this.isConverting = true;
        this.leadApiService.convertLead(this.lead.id, request).subscribe({
            next: (opportunity) => {
                this.conversionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Lead converted', detail: `${opportunity.opportunityNumber} was created.`, life: 5000 });
                this.loadLead();
                this.isConverting = false;
            },
            error: (error) => {
                this.handleStatusError(error);
                this.isConverting = false;
            }
        });
    }

    updateLead(): void {
        if (!this.lead) {
            return;
        }

        this.editForm.markAllAsTouched();
        if (this.editForm.invalid) {
            return;
        }

        this.isSavingLead = true;
        const wasDisqualified = this.lead.status?.toLowerCase() === 'disqualified';
        this.leadApiService.updateLead(this.lead.id, this.buildUpdateLeadRequest()).subscribe({
            next: (lead) => {
                this.editDialog = false;
                const summary = wasDisqualified ? 'Lead resubmitted' : 'Lead updated';
                const detail = wasDisqualified
                    ? `${lead.leadNumber} was moved back to the active qualification pipeline.`
                    : `${lead.leadNumber} was updated successfully.`;
                this.messageService.add({ severity: 'success', summary, detail, life: 4000 });
                this.loadLead();
                this.isSavingLead = false;
            },
            error: (error) => {
                this.handleStatusError(error);
                this.isSavingLead = false;
            }
        });
    }

    backToList(): void {
        this.router.navigate(['/pages/leads']);
    }

    formatDate(value?: string): string {
        return value ? new Date(value).toLocaleString() : 'Not set';
    }

    optional(value?: string | number | null): string {
        return value === undefined || value === null || value === '' ? 'Not set' : String(value);
    }

    formatDateOnly(value?: string): string {
        return value ? new Date(value).toLocaleDateString() : 'Not set';
    }

    closeDatePicker(picker: DatePicker): void {
        setTimeout(() => picker.hideOverlay(), 0);
    }

    normalizeNewContactPhone(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, '').slice(0, 10);
        if (input.value === value) {
            return;
        }

        input.value = value;
        this.conversionForm.controls.newContactPhone.setValue(value);
    }

    get filteredContacts() {
        const clientId = this.conversionForm.controls.clientId.value;
        return this.conversion?.existingContacts.filter((contact) => contact.clientId === clientId) ?? [];
    }

    get conversionClientName(): string {
        const clientId = this.conversionForm.controls.clientId.value;
        const client = this.conversion?.existingClients.find((item) => item.id === clientId);
        return client?.name ?? this.conversion?.companyName ?? 'Not set';
    }

    get conversionClientCountry(): string {
        const clientId = this.conversionForm.controls.clientId.value;
        return this.conversion?.existingClients.find((item) => item.id === clientId)?.country ?? '';
    }

    get useExistingContact(): boolean {
        return this.conversionForm.controls.contactMode.value === 'existing';
    }

    get isEditCampaignSource(): boolean {
        return this.selectedEditSourceCode() === 'campaign';
    }

    get isEditPartnerSource(): boolean {
        return this.selectedEditSourceCode() === 'partner';
    }

    get editProductOptions() {
        if (!this.leadLookups) {
            return [];
        }

        if (!this.isPartnerOwnedEditProductContext) {
            return this.leadLookups.products.filter((product) => !product.ownershipTypeCode || product.ownershipTypeCode === 'InHouse');
        }

        const assignedProductIds = this.selectedEditPartnerProductIds;
        return this.leadLookups.products.filter((product) => assignedProductIds.has(product.id));
    }

    get editContactOptions() {
        const clientId = this.editForm.controls.clientId.value;
        return this.leadLookups?.contacts.filter((contact) => contact.clientId === clientId) ?? [];
    }

    private get isPartnerOwnedEditProductContext(): boolean {
        if (!this.isEditPartnerSource) {
            return false;
        }

        const partnerTypeCode = this.selectedEditPartnerTypeCode();
        return partnerTypeCode === 'vendor' || partnerTypeCode === 'supplier';
    }

    private get selectedEditPartnerProductIds(): Set<string> {
        const partnerId = this.editForm.controls.partnerId.value;
        const partner = this.leadLookups?.partners.find((item) => item.id === partnerId);
        return new Set((partner?.productIds ?? []).map(String));
    }

    private buildInteractionRequest(): CreateLeadInteractionRequest {
        const value = this.interactionForm.getRawValue();
        return {
            leadId: this.lead?.id ?? '',
            interactionType: value.interactionType ?? '',
            subject: this.optionalFormString(value.subject) ?? undefined,
            notes: value.notes ?? '',
            interactionDate: this.toIsoDateTime(value.interactionDate),
            nextFollowUpDate: this.toIsoDateTime(value.nextFollowUpDate)
        };
    }

    private buildUpdateLeadRequest(): UpdateLeadRequest {
        const value = this.editForm.getRawValue();
        return {
            sourceId: value.sourceId ?? '',
            categoryId: value.categoryId ?? '',
            partnerId: this.optionalFormString(value.partnerId),
            campaignName: this.optionalFormString(value.campaignName),
            sourceStartDate: this.optionalFormString(value.sourceStartDate),
            sourceEndDate: this.optionalFormString(value.sourceEndDate),
            clientId: value.clientId ?? '',
            clientContactId: value.clientContactId ?? '',
            companyName: '',
            website: null,
            contactPersonName: '',
            jobTitle: null,
            email: null,
            phone: null,
            alternatePhone: null,
            countryId: '00000000-0000-0000-0000-000000000000',
            address: this.optionalFormString(value.address),
            industryId: null,
            notes: null,
            leadScore: value.leadScore,
            productIds: value.productIds ?? []
        };
    }

    private applyEditSourceRules(): void {
        this.setRequired('campaignName', this.isEditCampaignSource);
        this.setRequired('partnerId', this.isEditPartnerSource);
        this.setRequired('sourceStartDate', this.isEditCampaignSource);
        this.setRequired('sourceEndDate', this.isEditCampaignSource);
        this.setRequired('address', this.isEditCampaignSource);

        if (!this.isEditCampaignSource) {
            this.editForm.controls.campaignName.reset('', { emitEvent: false });
            this.editForm.controls.sourceStartDate.reset('', { emitEvent: false });
            this.editForm.controls.sourceEndDate.reset('', { emitEvent: false });
            this.editForm.controls.address.reset('', { emitEvent: false });
        }

        if (!this.isEditPartnerSource) {
            this.editForm.controls.partnerId.reset('', { emitEvent: false });
        }

        this.clearUnavailableEditProducts();
    }

    private setRequired(controlName: 'campaignName' | 'partnerId' | 'sourceStartDate' | 'sourceEndDate' | 'address', required: boolean): void {
        const control = this.editForm.controls[controlName];
        control.setValidators(required ? [Validators.required] : []);
        control.updateValueAndValidity({ emitEvent: false });
    }

    private selectedEditSourceCode(): string {
        const sourceId = this.editForm.controls.sourceId.value;
        const source = this.leadLookups?.sources.find((item) => item.id === sourceId);
        return String(source?.code ?? source?.name ?? '').trim().toLowerCase();
    }

    private selectedEditPartnerTypeCode(): string {
        const partnerId = this.editForm.controls.partnerId.value;
        const partner = this.leadLookups?.partners.find((item) => item.id === partnerId);
        return String(partner?.partnerTypeCode ?? '').trim().replace(/-/g, '_').toLowerCase();
    }

    private clearUnavailableEditProducts(): void {
        const allowedProductIds = new Set(this.editProductOptions.map((product) => product.id));
        const selectedProductIds = this.editForm.controls.productIds.value ?? [];
        const availableProductIds = selectedProductIds.filter((productId) => allowedProductIds.has(productId));

        if (availableProductIds.length !== selectedProductIds.length) {
            this.editForm.controls.productIds.reset(availableProductIds, { emitEvent: false });
        }
    }

    private clearUnavailableEditContact(): void {
        const contactId = this.editForm.controls.clientContactId.value;
        if (!contactId || this.editContactOptions.some((contact) => contact.id === contactId)) {
            return;
        }

        this.editForm.controls.clientContactId.reset('', { emitEvent: false });
    }

    private applyConversionContactRules(): void {
        const control = this.conversionForm.controls.newContactPhone;
        control.setValidators(this.useExistingContact ? [] : [Validators.pattern(NEPAL_CONTACT_NUMBER_PATTERN)]);
        control.updateValueAndValidity({ emitEvent: false });
    }

    private buildConversionRequest(): ConvertLeadRequest {
        const value = this.conversionForm.getRawValue();
        const request: ConvertLeadRequest = {
            productId: value.productId ?? '',
            opportunityTitle: value.opportunityTitle ?? '',
            estimatedValue: value.estimatedValue ?? 0,
            currencyId: value.currencyId ?? '',
            expectedCloseDate: value.expectedCloseDate ? new Date(value.expectedCloseDate).toISOString() : undefined,
            ownerUserId: value.ownerUserId ?? ''
        };

        return request;
    }

    private resolveConversionClientId(conversion: LeadConversionViewModel): string {
        const selectedClient = this.findClientById(conversion, conversion.selectedClientId);
        if (selectedClient) {
            return selectedClient.id;
        }

        const selectedContact = this.findContactById(conversion, conversion.selectedContactId);
        if (selectedContact) {
            return selectedContact.clientId;
        }

        return this.findMatchingClient(conversion)?.id ?? this.findMatchingContact(conversion)?.clientId ?? '';
    }

    private resolveConversionContactId(conversion: LeadConversionViewModel, clientId: string): string {
        const selectedContact = this.findContactById(conversion, conversion.selectedContactId, clientId);
        if (selectedContact) {
            return selectedContact.id;
        }

        return this.findMatchingContact(conversion, clientId)?.id ?? '';
    }

    private findClientById(conversion: LeadConversionViewModel, clientId?: string): ClientLookupViewModel | undefined {
        return clientId ? conversion.existingClients.find((client) => client.id === clientId) : undefined;
    }

    private findContactById(conversion: LeadConversionViewModel, contactId?: string, clientId?: string): ContactLookupViewModel | undefined {
        const contact = contactId ? conversion.existingContacts.find((item) => item.id === contactId) : undefined;
        return contact && (!clientId || contact.clientId === clientId) ? contact : undefined;
    }

    private findMatchingClient(conversion: LeadConversionViewModel): ClientLookupViewModel | undefined {
        const companyName = this.normalizeComparisonValue(conversion.companyName);
        return companyName ? conversion.existingClients.find((client) => this.normalizeComparisonValue(client.name) === companyName) : undefined;
    }

    private findMatchingContact(conversion: LeadConversionViewModel, clientId?: string): ContactLookupViewModel | undefined {
        const candidates = clientId ? conversion.existingContacts.filter((contact) => contact.clientId === clientId) : conversion.existingContacts;
        const email = this.normalizeComparisonValue(conversion.email);
        if (email) {
            const contactByEmail = candidates.find((contact) => this.normalizeComparisonValue(contact.email) === email);
            if (contactByEmail) {
                return contactByEmail;
            }
        }

        const contactName = this.normalizeComparisonValue(conversion.contactPersonName);
        return contactName ? candidates.find((contact) => this.normalizeComparisonValue(contact.fullName) === contactName) : undefined;
    }

    private normalizeComparisonValue(value?: string): string {
        return value?.trim().toLowerCase().replace(/[\W_]+/g, '') ?? '';
    }

    private firstName(fullName: string): string {
        return fullName.trim().split(/\s+/)[0] ?? '';
    }

    private lastName(fullName: string): string {
        const parts = fullName.trim().split(/\s+/);
        return parts.length > 1 ? parts.slice(1).join(' ') : '-';
    }

    private getInitials(value: string): string {
        const words = value.trim().split(/\s+/).filter(Boolean);
        if (!words.length) {
            return 'LD';
        }

        return words
            .slice(0, 2)
            .map((word) => word[0])
            .join('')
            .toUpperCase();
    }

    private formatDateInput(value?: string): string {
        return value ? new Date(value).toISOString().slice(0, 10) : '';
    }

    private toIsoDateTime(value?: Date | string | null): string | undefined {
        if (!value) {
            return undefined;
        }

        const date = value instanceof Date ? value : new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
    }

    private optionalFormString(value: string | null | undefined): string | null {
        return value?.trim() ? value : null;
    }

    private handleStatusError(error: { error?: { errors?: string[] }; status?: number }): void {
        const detail = error.error?.errors?.join(' ') ?? 'Lead status could not be updated.';
        this.messageService.add({ severity: 'error', summary: 'Status update failed', detail, life: 5000 });
        this.isSavingStatus = false;
    }

    private handleActionError(error: { error?: { errors?: string[] }; status?: number }, summary: string, fallback: string): void {
        const detail = error.error?.errors?.join(' ') ?? fallback;
        this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
    }
}
