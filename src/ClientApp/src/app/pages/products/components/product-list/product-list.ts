import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { Crud, CrudSaveEvent } from '@/shared/components/crud/crud';
import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { ProductColumns } from '../../config/product-columns.config';
import { buildProductFields } from '../../config/product-fields.config';
import { CreateProductRequest } from '../../dtos/create-product.request';
import { UpdateProductRequest } from '../../dtos/update-product.request';
import { ProductApiService } from '../../services/product-api.service';
import { ProductListItemViewModel } from '../../view-models/product-list-item.view-model';
import { ProductOptionViewModel } from '../../view-models/product-option.view-model';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [Crud, ToastModule],
    templateUrl: './product-list.html',
    providers: [MessageService]
})
export class ProductList implements OnInit {
    title = 'Product';
    columns = ProductColumns;
    fields: DynamicField[] = [];
    data: Record<string, unknown>[] = [];
    isLoading = true;
    dataNotFound = false;
    errorMessage = 'No products found.';
    canCreate = false;
    canEdit = false;
    canDelete = false;
    canExport = false;
    bulkActionLabel = 'Deactivate';
    rowActionLabel = 'Deactivate';
    rowActionIcon = 'pi pi-ban';
    rowActionLabelResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'Deactivate' : 'Activate');
    rowActionIconResolver = (row: Record<string, unknown>) => (row['isActive'] === true ? 'pi pi-ban' : 'pi pi-check-circle');

    private readonly subscriptionBusinessModel = 'subscription';
    private readonly licenseBusinessModel = 'license';
    private productTypeNames = new Map<number, string>();
    private deploymentTypeNames = new Map<number, string>();
    private ownershipTypeNames = new Map<number, string>();

    constructor(
        private readonly productApiService: ProductApiService,
        private readonly messageService: MessageService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.canCreate = this.authService.hasPermission(Permissions.products.create);
        this.canEdit = this.authService.hasPermission(Permissions.products.edit);
        this.canDelete = this.authService.hasPermission(Permissions.products.delete);
        this.canExport = this.authService.hasPermission(Permissions.products.export);
        this.loadPage();
    }

    saveProduct(event: CrudSaveEvent): void {
        const value = event.value as Record<string, unknown>;

        if (event.mode === 'create') {
            this.productApiService.createProduct(this.toCreateRequest(value)).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Product created', detail: 'The product was created successfully.', life: 3000 });
                    this.loadProducts();
                },
                error: (error) => this.showError(error, 'Create failed')
            });
            return;
        }

        const id = this.getRowId(event.original);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Update failed', detail: 'Product id is missing.', life: 4000 });
            return;
        }

        this.productApiService.updateProduct(id, this.toUpdateRequest(value)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Product updated', detail: 'The product was updated successfully.', life: 3000 });
                this.loadProducts();
            },
            error: (error) => this.showError(error, 'Update failed')
        });
    }

    toggleProductStatus(row: Record<string, unknown>): void {
        const id = this.getRowId(row);
        if (!id) {
            this.messageService.add({ severity: 'error', summary: 'Status update failed', detail: 'Product id is missing.', life: 4000 });
            return;
        }

        const isActive = row['isActive'] === true;
        const request = isActive ? this.productApiService.deactivateProduct(id) : this.productApiService.activateProduct(id);
        const action = isActive ? 'deactivated' : 'activated';

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: `Product ${action}`, detail: `The product was ${action} successfully.`, life: 3000 });
                this.loadProducts();
            },
            error: (error) => this.showError(error, 'Status update failed')
        });
    }

    deactivateProducts(rows: Record<string, unknown>[]): void {
        const activeIds = rows.filter((row) => row['isActive'] === true).map((row) => this.getRowId(row)).filter((id): id is string => !!id);

        if (!activeIds.length) {
            this.messageService.add({ severity: 'info', summary: 'No active products', detail: 'The selected products are already inactive.', life: 3000 });
            return;
        }

        forkJoin(activeIds.map((id) => this.productApiService.deactivateProduct(id))).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Products deactivated', detail: `${activeIds.length} product(s) were deactivated.`, life: 3000 });
                this.loadProducts();
            },
            error: (error) => this.showError(error, 'Bulk deactivate failed')
        });
    }

    private loadPage(): void {
        this.isLoading = true;
        this.productApiService.getLookups().subscribe({
            next: (lookups) => {
                this.productTypeNames = this.toNameMap(lookups.productTypes);
                this.deploymentTypeNames = this.toNameMap(lookups.deploymentTypes);
                this.ownershipTypeNames = this.toNameMap(lookups.ownershipTypes);
                this.fields = buildProductFields({
                    productTypes: this.toOptions(lookups.productTypes),
                    deploymentTypes: this.toOptions(lookups.deploymentTypes),
                    ownershipTypes: this.toOptions(lookups.ownershipTypes),
                    ownerPartners: lookups.ownerPartners.map((partner) => ({ label: partner.name, value: partner.id, code: partner.code ?? undefined, partnerTypeCode: partner.partnerTypeCode ?? undefined }))
                });
                this.loadProducts();
            },
            error: () => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = 'Unable to load product lookups.';
            }
        });
    }

    private loadProducts(): void {
        this.productApiService.getProducts().subscribe({
            next: (products) => {
                this.data = products.map((product) => this.toGridRow(product));
                this.dataNotFound = products.length === 0;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.dataNotFound = true;
                this.errorMessage = error.status === 401 || error.status === 403 ? 'You are not allowed to manage products.' : 'Unable to load products.';
            }
        });
    }

    private toGridRow(product: ProductListItemViewModel): Record<string, unknown> {
        return {
            ...product,
            productTypeName: this.productTypeNames.get(product.productType) ?? product.productType,
            deploymentTypeName: this.deploymentTypeNames.get(product.deploymentType) ?? product.deploymentType,
            ownershipTypeName: product.ownershipTypeName || this.ownershipTypeNames.get(product.ownershipType) || product.ownershipType,
            ownerPartnerName: product.ownerPartnerName ?? '',
            businessModel: this.toBusinessModel(product.isSubscriptionBased, product.isLicenseBased),
            isActive: product.isActive === true
        };
    }

    private toCreateRequest(value: Record<string, unknown>): CreateProductRequest {
        return {
            code: String(value['code'] ?? ''),
            name: String(value['name'] ?? ''),
            productType: this.toNumber(value['productType']),
            deploymentType: this.toNumber(value['deploymentType']),
            ownershipType: this.toNumber(value['ownershipType']) || 1,
            ownerPartnerId: this.toNumber(value['ownershipType']) === 2 ? this.optionalString(value['ownerPartnerId']) : null,
            description: this.optionalString(value['description']),
            isSubscriptionBased: value['businessModel'] === this.subscriptionBusinessModel,
            isLicenseBased: value['businessModel'] === this.licenseBusinessModel,
            isActive: true
        };
    }

    private toUpdateRequest(value: Record<string, unknown>): UpdateProductRequest {
        return {
            code: String(value['code'] ?? ''),
            name: String(value['name'] ?? ''),
            productType: this.toNumber(value['productType']),
            deploymentType: this.toNumber(value['deploymentType']),
            ownershipType: this.toNumber(value['ownershipType']) || 1,
            ownerPartnerId: this.toNumber(value['ownershipType']) === 2 ? this.optionalString(value['ownerPartnerId']) : null,
            description: this.optionalString(value['description']),
            isSubscriptionBased: value['businessModel'] === this.subscriptionBusinessModel,
            isLicenseBased: value['businessModel'] === this.licenseBusinessModel,
            isActive: value['isActive'] === true
        };
    }

    private toOptions(values: ProductOptionViewModel[]): SelectOption[] {
        return values.map((value) => ({ label: value.name, value: value.value, code: value.code }));
    }

    private toNameMap(values: ProductOptionViewModel[]): Map<number, string> {
        return new Map(values.map((value) => [value.value, value.name]));
    }

    private getRowId(row?: Record<string, unknown>): string | null {
        return typeof row?.['id'] === 'string' && row['id'].trim() ? row['id'] : null;
    }

    private optionalString(value: unknown): string | null {
        return typeof value === 'string' && value.trim() ? value.trim() : null;
    }

    private toNumber(value: unknown): number {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    private toBusinessModel(isSubscriptionBased: boolean, isLicenseBased: boolean): string {
        if (isSubscriptionBased === true && isLicenseBased !== true) {
            return this.subscriptionBusinessModel;
        }

        if (isLicenseBased === true && isSubscriptionBased !== true) {
            return this.licenseBusinessModel;
        }

        return '';
    }

    private showError(error: { error?: { detail?: string; title?: string; errors?: string[] } }, summary: string): void {
        const detail = error.error?.errors?.join?.(' ') ?? error.error?.detail ?? error.error?.title ?? 'The operation could not be completed.';
        this.messageService.add({ severity: 'error', summary, detail, life: 6000 });
    }
}
