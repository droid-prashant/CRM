import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { forkJoin, of } from 'rxjs';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { UserListItemViewModel } from '@/pages/users/view-models/user-list-item.view-model';
import { UpdateLeadRequest } from '../../dtos/update-lead.request';
import { ConvertLeadRequest, CreateLeadInteractionRequest, LeadApiService, LeadConversionViewModel, LeadInteractionViewModel, LeadLookupBundle } from '../../services/lead.api-service';
import { LeadDetailViewModel } from '../../view-models/lead-detail.view-model';

@Component({
    selector: 'app-lead-detail',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, InputNumberModule, InputTextModule, MultiSelectModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, TextareaModule, ToastModule],
    templateUrl: './lead-detail.html',
    providers: [MessageService]
})
export class LeadDetail implements OnInit {
    lead?: LeadDetailViewModel;
    isLoading = true;
    isSavingStatus = false;
    isAssigning = false;
    isConverting = false;
    isSavingLead = false;
    isSavingInteraction = false;
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

    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageService);

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
        interactionDate: [''],
        nextFollowUpDate: ['']
    });

    editForm = this.fb.group({
        sourceId: ['', Validators.required],
        categoryId: ['', Validators.required],
        partnerId: [''],
        campaignName: [''],
        companyName: ['', Validators.required],
        website: [''],
        contactPersonName: ['', Validators.required],
        jobTitle: [''],
        email: [''],
        phone: [''],
        alternatePhone: [''],
        countryId: ['', Validators.required],
        address: [''],
        industryId: [''],
        notes: [''],
        leadScore: [null as number | null],
        productIds: [[] as string[], Validators.required]
    });

    conversionForm = this.fb.group({
        productId: ['', Validators.required],
        clientMode: ['new', Validators.required],
        clientId: [''],
        newClientName: [''],
        newClientCountryId: [''],
        newClientIndustryId: [''],
        contactMode: ['new', Validators.required],
        contactId: [''],
        newContactFirstName: [''],
        newContactLastName: [''],
        newContactEmail: [''],
        newContactPhone: [''],
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
        this.loadLead();
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
        return this.canApproveLead && this.lead?.status?.toLowerCase() === 'qualified' && !this.lead.convertedOpportunityId;
    }

    get canShowQualificationActions(): boolean {
        return this.canEditLead && ['new', 'assigned'].includes(this.lead?.status?.toLowerCase() ?? '');
    }

    get canShowEditActions(): boolean {
        return this.canEditLead && this.lead?.status?.toLowerCase() !== 'converted';
    }

    get canShowInteractionAction(): boolean {
        return this.canShowEditActions;
    }

    get leadInitials(): string {
        return this.getInitials(this.lead?.companyName ?? '');
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
        this.qualificationForm.reset({ qualificationRemarks: '' });
        this.qualificationDialog = true;
    }

    openDisqualificationDialog(): void {
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
        if (!this.lead) {
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
                    companyName: lead.companyName,
                    website: lead.website ?? '',
                    contactPersonName: lead.contactPersonName,
                    jobTitle: lead.jobTitle ?? '',
                    email: lead.email ?? '',
                    phone: lead.phone ?? '',
                    alternatePhone: lead.alternatePhone ?? '',
                    countryId: lead.countryId,
                    address: lead.address ?? '',
                    industryId: lead.industryId ?? '',
                    notes: lead.notes ?? '',
                    leadScore: lead.leadScore ?? null,
                    productIds: lead.selectedProductIds
                });
                this.editDialog = true;
                this.isSavingLead = false;
            },
            error: (error) => {
                this.handleStatusError(error);
                this.isSavingLead = false;
            }
        });
    }

    openInteractionDialog(): void {
        this.interactionForm.reset({
            interactionType: 'Call',
            subject: '',
            notes: '',
            interactionDate: this.formatDateTimeInput(new Date()),
            nextFollowUpDate: ''
        });
        this.interactionDialog = true;
    }

    openConversionDialog(): void {
        if (!this.lead) {
            return;
        }

        this.isConverting = true;
        this.leadApiService.getLeadConversion(this.lead.id).subscribe({
            next: (conversion) => {
                this.conversion = conversion;
                const firstProduct = conversion.productInterests[0]?.productId ?? '';
                const firstCurrency = conversion.currencies[0]?.id ?? '';
                const defaultOwnerUserId = conversion.defaultOwnerUserId ?? conversion.ownerUsers[0]?.id ?? '';
                this.conversionForm.reset({
                    productId: firstProduct,
                    clientMode: 'new',
                    clientId: '',
                    newClientName: conversion.companyName,
                    newClientCountryId: conversion.countries[0]?.id ?? '',
                    newClientIndustryId: '',
                    contactMode: 'new',
                    contactId: '',
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

    addInteraction(): void {
        if (!this.lead) {
            return;
        }

        this.interactionForm.markAllAsTouched();
        if (this.interactionForm.invalid) {
            return;
        }

        this.isSavingInteraction = true;
        this.leadApiService.createLeadInteraction(this.lead.id, this.buildInteractionRequest()).subscribe({
            next: () => {
                this.interactionDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Interaction saved', detail: 'The interaction was added to the lead timeline.', life: 4000 });
                this.loadLead();
                this.isSavingInteraction = false;
            },
            error: (error) => {
                this.handleActionError(error, 'Interaction failed', 'Lead interaction could not be saved.');
                this.isSavingInteraction = false;
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
        this.leadApiService.updateLead(this.lead.id, this.buildUpdateLeadRequest()).subscribe({
            next: (lead) => {
                this.editDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Lead updated', detail: `${lead.leadNumber} was updated successfully.`, life: 4000 });
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

    get filteredContacts() {
        const clientId = this.conversionForm.controls.clientId.value;
        return this.conversion?.existingContacts.filter((contact) => contact.clientId === clientId) ?? [];
    }

    get useExistingClient(): boolean {
        return this.conversionForm.controls.clientMode.value === 'existing';
    }

    get useExistingContact(): boolean {
        return this.conversionForm.controls.contactMode.value === 'existing';
    }

    private buildInteractionRequest(): CreateLeadInteractionRequest {
        const value = this.interactionForm.getRawValue();
        return {
            leadId: this.lead?.id ?? '',
            interactionType: value.interactionType ?? '',
            subject: this.optionalFormString(value.subject) ?? undefined,
            notes: value.notes ?? '',
            interactionDate: value.interactionDate ? new Date(value.interactionDate).toISOString() : undefined,
            nextFollowUpDate: value.nextFollowUpDate ? new Date(value.nextFollowUpDate).toISOString() : undefined
        };
    }

    private buildUpdateLeadRequest(): UpdateLeadRequest {
        const value = this.editForm.getRawValue();
        return {
            sourceId: value.sourceId ?? '',
            categoryId: value.categoryId ?? '',
            partnerId: this.optionalFormString(value.partnerId),
            campaignName: this.optionalFormString(value.campaignName),
            companyName: value.companyName ?? '',
            website: this.optionalFormString(value.website),
            contactPersonName: value.contactPersonName ?? '',
            jobTitle: this.optionalFormString(value.jobTitle),
            email: this.optionalFormString(value.email),
            phone: this.optionalFormString(value.phone),
            alternatePhone: this.optionalFormString(value.alternatePhone),
            countryId: value.countryId ?? '',
            address: this.optionalFormString(value.address),
            industryId: this.optionalFormString(value.industryId),
            notes: this.optionalFormString(value.notes),
            leadScore: value.leadScore,
            productIds: value.productIds ?? []
        };
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

        if (value.clientMode === 'existing') {
            request.clientId = value.clientId ?? undefined;
        } else {
            request.newClient = {
                name: value.newClientName ?? '',
                countryId: value.newClientCountryId ?? '',
                industryId: value.newClientIndustryId ?? undefined
            };
        }

        if (value.contactMode === 'existing') {
            request.contactId = value.contactId ?? undefined;
        } else {
            request.newContact = {
                firstName: value.newContactFirstName ?? '',
                lastName: value.newContactLastName ?? '',
                email: value.newContactEmail ?? undefined,
                phone: value.newContactPhone ?? undefined
            };
        }

        return request;
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

    private formatDateTimeInput(value: Date): string {
        const offsetMs = value.getTimezoneOffset() * 60_000;
        return new Date(value.getTime() - offsetMs).toISOString().slice(0, 16);
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
