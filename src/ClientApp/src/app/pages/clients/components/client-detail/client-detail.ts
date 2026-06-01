import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { ClientApiService } from '../../services/client-api.service';
import { ClientContactViewModel } from '../../view-models/client-contact.view-model';
import { ClientDetailViewModel, ClientTimelineEntryViewModel } from '../../view-models/client-detail.view-model';
import { ClientLookupBundleViewModel } from '../../view-models/client-lookup-bundle.view-model';

@Component({
    selector: 'app-client-detail',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, InputTextModule, ReactiveFormsModule, SelectModule, TableModule, TagModule, TextareaModule, ToastModule],
    templateUrl: './client-detail.html',
    providers: [MessageService]
})
export class ClientDetail implements OnInit {
    client?: ClientDetailViewModel;
    contacts: ClientContactViewModel[] = [];
    lookups?: ClientLookupBundleViewModel;
    isLoading = true;
    isSavingStatus = false;
    isSavingClient = false;
    isSavingContact = false;
    isLoadingEdit = false;
    editDialog = false;
    contactDialog = false;
    contactMode: 'create' | 'update' = 'create';
    selectedContact?: ClientContactViewModel;
    errorMessage = '';
    canEditClient = false;
    canDeleteClient = false;
    readonly statusOptions = [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 2 }
    ];

    private readonly fb = inject(FormBuilder);

    editForm = this.fb.group({
        clientCode: [{ value: '', disabled: true }],
        name: ['', Validators.required],
        shortName: [''],
        clientTypeId: [''],
        countryId: ['', Validators.required],
        industryId: [''],
        accountOwnerUserId: [''],
        website: [''],
        taxNumber: [''],
        registrationNumber: [''],
        address: [''],
        notes: [''],
        status: [1, Validators.required]
    });

    contactForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        fullName: ['', Validators.required],
        designation: [''],
        department: [''],
        email: ['', Validators.email],
        phone: [''],
        mobile: [''],
        isPrimary: [false],
        status: [1, Validators.required],
        notes: ['']
    });

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly clientApiService: ClientApiService,
        private readonly authService: AuthService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.canEditClient = this.authService.hasPermission(Permissions.clients.edit);
        this.canDeleteClient = this.authService.hasPermission(Permissions.clients.delete);
        this.loadClient();
    }

    loadClient(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.errorMessage = 'Client id is missing.';
            this.isLoading = false;
            return;
        }

        forkJoin({
            client: this.clientApiService.getClient(id),
            contacts: this.clientApiService.getClientContacts(id)
        }).subscribe({
            next: ({ client, contacts }) => {
                this.client = client;
                this.contacts = contacts;
                this.errorMessage = '';
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = error.status === 403 ? 'You are not allowed to view this client.' : 'Client was not found.';
                this.isLoading = false;
            }
        });
    }

    toggleStatus(): void {
        if (!this.client || !this.canShowStatusAction) {
            return;
        }

        const request = this.client.isActive ? this.clientApiService.deactivateClient(this.client.id) : this.clientApiService.activateClient(this.client.id);
        const action = this.client.isActive ? 'deactivated' : 'activated';
        this.isSavingStatus = true;

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `Client ${action}`, detail: `The client was ${action} successfully.`, life: 3000 });
                this.loadClient();
                this.isSavingStatus = false;
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Client status could not be updated.';
                this.messageService.add({ severity: 'error', summary: 'Status update failed', detail, life: 5000 });
                this.isSavingStatus = false;
            }
        });
    }

    openEditDialog(): void {
        if (!this.client || !this.canEditClient) {
            return;
        }

        this.isLoadingEdit = true;
        this.clientApiService.getClientForEdit(this.client.id).subscribe({
            next: (client) => {
                this.editForm.reset({
                    clientCode: client.clientCode,
                    name: client.name,
                    shortName: client.shortName ?? '',
                    clientTypeId: client.clientTypeId ?? '',
                    countryId: client.countryId,
                    industryId: client.industryId ?? '',
                    accountOwnerUserId: client.accountOwnerUserId ?? '',
                    website: client.website ?? '',
                    taxNumber: client.taxNumber ?? '',
                    registrationNumber: client.registrationNumber ?? '',
                    address: client.address ?? '',
                    notes: client.notes ?? '',
                    status: client.status || (client.isActive ? 1 : 2)
                });
                this.editDialog = true;
                this.isLoadingEdit = false;
                this.loadLookups();
            },
            error: (error) => {
                const detail = error.status === 403 ? 'You are not allowed to edit this client.' : 'Client edit data could not be loaded.';
                this.messageService.add({ severity: 'error', summary: 'Edit unavailable', detail, life: 5000 });
                this.isLoadingEdit = false;
            }
        });
    }

    updateClient(): void {
        if (!this.client) {
            return;
        }

        this.editForm.markAllAsTouched();
        if (this.editForm.invalid) {
            return;
        }

        this.isSavingClient = true;
        const value = this.editForm.getRawValue();
        const status = value.status ?? 1;

        this.clientApiService
            .updateClient(this.client.id, {
                name: value.name ?? '',
                shortName: this.optionalFormString(value.shortName),
                clientTypeId: this.optionalFormString(value.clientTypeId),
                industryId: this.optionalFormString(value.industryId),
                countryId: value.countryId ?? '',
                address: this.optionalFormString(value.address),
                website: this.optionalFormString(value.website),
                taxNumber: this.optionalFormString(value.taxNumber),
                registrationNumber: this.optionalFormString(value.registrationNumber),
                accountOwnerUserId: this.optionalFormString(value.accountOwnerUserId),
                notes: this.optionalFormString(value.notes),
                status,
                isActive: status === 1
            })
            .subscribe({
                next: (client) => {
                    this.messageService.add({ severity: 'success', summary: 'Client updated', detail: `${client.clientCode} was updated successfully.`, life: 3000 });
                    this.editDialog = false;
                    this.loadClient();
                    this.isSavingClient = false;
                },
                error: (error) => {
                    const detail = error.error?.errors?.join?.(' ') ?? 'Client could not be updated.';
                    this.messageService.add({ severity: 'error', summary: 'Update failed', detail, life: 6000 });
                    this.isSavingClient = false;
                }
            });
    }

    openAddContactDialog(): void {
        if (!this.client || !this.canEditClient) {
            return;
        }

        this.contactMode = 'create';
        this.selectedContact = undefined;
        this.contactForm.reset({
            firstName: '',
            lastName: '',
            fullName: '',
            designation: '',
            department: '',
            email: '',
            phone: '',
            mobile: '',
            isPrimary: false,
            status: 1,
            notes: ''
        });
        this.contactForm.controls.isPrimary.enable();
        this.contactDialog = true;
    }

    openEditContactDialog(contact: ClientContactViewModel): void {
        if (!this.canEditClient) {
            return;
        }

        this.contactMode = 'update';
        this.selectedContact = contact;
        this.contactForm.reset({
            firstName: contact.firstName ?? '',
            lastName: contact.lastName ?? '',
            fullName: contact.fullName,
            designation: contact.designation ?? '',
            department: contact.department ?? '',
            email: contact.email ?? '',
            phone: contact.phone ?? '',
            mobile: contact.mobile ?? '',
            isPrimary: contact.isPrimary,
            status: contact.status || (contact.isActive ? 1 : 2),
            notes: contact.notes ?? ''
        });
        this.contactForm.controls.isPrimary.disable();
        this.contactDialog = true;
    }

    saveContact(): void {
        if (!this.client) {
            return;
        }

        this.contactForm.markAllAsTouched();
        if (this.contactForm.invalid) {
            return;
        }

        const value = this.contactForm.getRawValue();
        this.isSavingContact = true;
        const request = this.contactMode === 'create'
            ? this.clientApiService.createClientContact({
                  clientId: this.client.id,
                  firstName: value.firstName ?? '',
                  lastName: value.lastName ?? '',
                  fullName: value.fullName ?? '',
                  designation: this.optionalFormString(value.designation),
                  department: this.optionalFormString(value.department),
                  email: this.optionalFormString(value.email),
                  phone: this.optionalFormString(value.phone),
                  mobile: this.optionalFormString(value.mobile),
                  isPrimary: value.isPrimary === true,
                  notes: this.optionalFormString(value.notes)
              })
            : this.clientApiService.updateClientContact(this.selectedContact?.id ?? '', {
                  contactId: this.selectedContact?.id ?? '',
                  firstName: value.firstName ?? '',
                  lastName: value.lastName ?? '',
                  fullName: value.fullName ?? '',
                  designation: this.optionalFormString(value.designation),
                  department: this.optionalFormString(value.department),
                  email: this.optionalFormString(value.email),
                  phone: this.optionalFormString(value.phone),
                  mobile: this.optionalFormString(value.mobile),
                  status: value.status ?? 1,
                  notes: this.optionalFormString(value.notes)
              });

        request.subscribe({
            next: () => {
                const summary = this.contactMode === 'create' ? 'Contact added' : 'Contact updated';
                this.messageService.add({ severity: 'success', summary, detail: 'Client contact details were saved.', life: 3000 });
                this.contactDialog = false;
                this.loadClient();
                this.isSavingContact = false;
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Contact could not be saved.';
                this.messageService.add({ severity: 'error', summary: 'Contact save failed', detail, life: 6000 });
                this.isSavingContact = false;
            }
        });
    }

    toggleContactStatus(contact: ClientContactViewModel): void {
        if (!this.canEditClient) {
            return;
        }

        const isActive = contact.isActive !== true;
        const action = isActive ? 'activated' : 'deactivated';
        this.clientApiService.updateClientContactStatus(contact.id, { isActive }).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `Contact ${action}`, detail: `${contact.fullName} was ${action}.`, life: 3000 });
                this.loadClient();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Contact status could not be updated.';
                this.messageService.add({ severity: 'error', summary: 'Status update failed', detail, life: 5000 });
            }
        });
    }

    setPrimaryContact(contact: ClientContactViewModel): void {
        if (!this.canEditClient || contact.isPrimary || !contact.isActive) {
            return;
        }

        this.clientApiService.setPrimaryContact(contact.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Primary contact updated', detail: `${contact.fullName} is now the primary contact.`, life: 3000 });
                this.loadClient();
            },
            error: (error) => {
                const detail = error.error?.errors?.join?.(' ') ?? 'Primary contact could not be updated.';
                this.messageService.add({ severity: 'error', summary: 'Primary update failed', detail, life: 5000 });
            }
        });
    }

    backToList(): void {
        this.router.navigate(['/pages/clients']);
    }

    get statusSeverity(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        if (!this.client?.isActive) {
            return 'secondary';
        }

        switch (this.client.statusName?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'secondary';
            default:
                return 'info';
        }
    }

    get canShowStatusAction(): boolean {
        return this.client?.isActive === true ? this.canDeleteClient : this.canEditClient;
    }

    get statusActionLabel(): string {
        return this.client?.isActive === true ? 'Deactivate' : 'Activate';
    }

    get statusActionIcon(): string {
        return this.client?.isActive === true ? 'pi pi-ban' : 'pi pi-check-circle';
    }

    get statusActionSeverity(): 'success' | 'secondary' | 'danger' {
        return this.client?.isActive === true ? 'danger' : 'success';
    }

    get initials(): string {
        const words = (this.client?.name ?? '').trim().split(/\s+/).filter(Boolean);
        if (!words.length) {
            return 'CL';
        }

        return words
            .slice(0, 2)
            .map((word) => word[0])
            .join('')
            .toUpperCase();
    }

    get timeline(): ClientTimelineEntryViewModel[] {
        return this.client?.timeline?.length ? this.client.timeline : (this.client?.timelineEntries ?? []);
    }

    timelineIcon(eventType?: string): string {
        const normalized = eventType?.toLowerCase() ?? '';
        if (normalized.includes('created')) return 'pi pi-plus';
        if (normalized.includes('updated')) return 'pi pi-pencil';
        if (normalized.includes('activated')) return 'pi pi-check-circle';
        if (normalized.includes('deactivated') || normalized.includes('deleted')) return 'pi pi-ban';
        return 'pi pi-clock';
    }

    formatDate(value?: string | null): string {
        return value ? new Date(value).toLocaleString() : 'Not set';
    }

    formatDateOnly(value?: string | null): string {
        return value ? new Date(value).toLocaleDateString() : 'Not set';
    }

    formatCurrency(value?: number | null): string {
        return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value ?? 0);
    }

    optional(value?: string | number | null): string {
        return value === undefined || value === null || value === '' ? 'Not set' : String(value);
    }

    private loadLookups(): void {
        if (this.lookups) {
            return;
        }

        this.clientApiService.getLookups().subscribe({
            next: (lookups) => {
                this.lookups = lookups;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Lookups unavailable', detail: 'Client lookup values could not be loaded.', life: 5000 });
            }
        });
    }

    private optionalFormString(value: string | null | undefined): string | null {
        return value?.trim() ? value.trim() : null;
    }
}
