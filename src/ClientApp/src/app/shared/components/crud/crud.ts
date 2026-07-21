import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { Subscription } from 'rxjs';
import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';
import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export type CrudMode = 'create' | 'update';

export interface CrudSaveEvent {
    mode: CrudMode;
    value: Record<string, unknown> | FormData;
    original?: Record<string, unknown>;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        ConfirmDialogModule,
        DatePickerModule,
        DialogModule,
        IconFieldModule,
        InputIconModule,
        InputNumberModule,
        InputTextModule,
        MenuModule,
        MultiSelectModule,
        RadioButtonModule,
        RippleModule,
        SelectModule,
        TableModule,
        TextareaModule,
        ToolbarModule
    ],
    templateUrl: './crud.html',
    providers: [ConfirmationService]
})
export class Crud implements OnChanges, OnDestroy {
    @Input({ required: true }) fields: DynamicField[] = [];
    @Input({ required: true }) columns: DynamicColumn[] = [];
    @Input() data: Record<string, unknown>[] = [];
    @Input() title = 'Record';
    @Input() dataNotFound = false;
    @Input() errorMessage = 'No records found.';
    @Input() bulkActionLabel = 'Delete';
    @Input() rowActionLabel = 'Delete';
    @Input() rowActionIcon = 'pi pi-trash';
    @Input() rowActionSeverity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined = undefined;
    @Input() rowActionLabelResolver?: (row: Record<string, unknown>) => string;
    @Input() rowActionIconResolver?: (row: Record<string, unknown>) => string;
    @Input() enableViewAction = false;
    @Input() canCreate = true;
    @Input() canEdit = true;
    @Input() canRowAction = true;
    @Input() canBulkAction = true;
    @Input() canExport = true;
    @Input() canEditRowResolver?: (row: Record<string, unknown>) => boolean;
    @Input() editActionLabelResolver?: (row: Record<string, unknown>) => string;
    @Input() lazy = false;
    @Input() lazyLoadOnInit = false;
    @Input() totalRecords = 0;
    @Input() first = 0;
    @Input() rows = 10;
    @Input() rowsPerPageOptions: number[] = [10, 20, 30];
    @Input() showGlobalSearch = true;

    @Output() save = new EventEmitter<CrudSaveEvent>();
    @Output() delete = new EventEmitter<Record<string, unknown>>();
    @Output() bulkDelete = new EventEmitter<Record<string, unknown>[]>();
    @Output() view = new EventEmitter<Record<string, unknown>>();
    @Output() lazyLoad = new EventEmitter<{ first?: number | null; rows?: number | null; sortField?: string | string[] | null; sortOrder?: number | null }>();

    @ViewChild('dt') dt!: Table;

    dialog = false;
    submitted = false;
    form!: FormGroup;
    selectedRows: Record<string, unknown>[] = [];
    activeRowActionItems: MenuItem[] = [];

    private mode: CrudMode = 'create';
    private editingRow?: Record<string, unknown>;
    private selectedFiles: Record<string, File> = {};
    private formSubscription?: Subscription;

    constructor(
        private readonly fb: FormBuilder,
        private readonly confirmationService: ConfirmationService
    ) {
        this.form = this.fb.group({});
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['fields']) {
            this.form = this.buildForm();
            this.registerFormStateHandler();
        }

        if (changes['data']) {
            this.selectedRows = this.selectedRows.filter((selectedRow) => this.data.some((row) => this.rowKey(row) === this.rowKey(selectedRow)));
        }
    }

    ngOnDestroy(): void {
        this.formSubscription?.unsubscribe();
    }

    get globalFilterFields(): string[] {
        return this.columns.map((column) => column.field);
    }

    get fieldSections(): { title: string; fields: DynamicField[] }[] {
        const sections = new Map<string, DynamicField[]>();
        this.fields.filter((field) => this.isFieldVisible(field)).forEach((field) => {
            const title = field.section ?? 'Details';
            sections.set(title, [...(sections.get(title) ?? []), field]);
        });

        return Array.from(sections.entries()).map(([title, fields]) => ({ title, fields }));
    }

    openNew(): void {
        this.mode = 'create';
        this.editingRow = undefined;
        this.selectedFiles = {};
        this.submitted = false;
        this.form.reset(this.getDefaultFormValue());
        this.applyConditionalFieldState();
        this.dialog = true;
    }

    openEdit(row: Record<string, unknown>): void {
        this.mode = 'update';
        this.editingRow = row;
        this.selectedFiles = {};
        this.submitted = false;
        this.form.reset({ ...this.getDefaultFormValue(), ...row });
        this.applyConditionalFieldState();
        this.dialog = true;
    }

    hideDialog(): void {
        this.dialog = false;
        this.submitted = false;
    }

    saveForm(): void {
        this.submitted = true;
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        this.save.emit({
            mode: this.mode,
            value: this.buildPayload(),
            original: this.editingRow
        });

        this.dialog = false;
    }

    confirmDelete(row: Record<string, unknown>): void {
        const action = (this.rowActionLabelResolver?.(row) ?? this.rowActionLabel).toLowerCase();
        this.confirmationService.confirm({
            message: `Are you sure you want to ${action} this ${this.title.toLowerCase()}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.delete.emit(row)
        });
    }

    confirmBulkDelete(): void {
        if (!this.selectedRows.length) {
            return;
        }

        const action = this.bulkActionLabel.toLowerCase();
        this.confirmationService.confirm({
            message: `Are you sure you want to ${action} the selected ${this.title.toLowerCase()} records?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.bulkDelete.emit(this.selectedRows)
        });
    }

    exportCSV(): void {
        const rowsToExport = (this.dt?.filteredValue as Record<string, unknown>[] | null) ?? this.data;
        if (!rowsToExport.length) return;

        const header = this.columns.map((column) => this.csvEscape(column.header)).join(',');
        const rows = rowsToExport.map((row) => this.columns.map((column) => this.csvEscape(row[column.field])).join(','));
        const blob = new Blob([`\uFEFF${[header, ...rows].join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.fileSafeName(this.title)}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onFileSelected(fieldKey: string, event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.item(0);

        if (file) {
            this.selectedFiles[fieldKey] = file;
        }
    }

    onTextInput(field: DynamicField, event: Event): void {
        if (!field.digitsOnly) {
            return;
        }

        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, '').slice(0, field.maxLength ?? undefined);
        if (input.value === value) {
            return;
        }

        input.value = value;
        this.form.get(field.key)?.setValue(value);
    }

    closeDatePicker(picker: DatePicker): void {
        setTimeout(() => picker.hideOverlay(), 0);
    }

    toggleRowActions(menu: Menu, row: Record<string, unknown>, event: Event): void {
        this.activeRowActionItems = this.buildRowActionItems(row);
        menu.toggle(event);
    }

    private buildRowActionItems(row: Record<string, unknown>): MenuItem[] {
        const items: MenuItem[] = [];

        if (this.enableViewAction) {
            items.push({
                label: 'View',
                icon: 'pi pi-eye',
                command: () => this.view.emit(row)
            });
        }

        if (this.canEdit && (this.canEditRowResolver?.(row) ?? true)) {
            items.push({
                label: this.editActionLabelResolver?.(row) ?? 'Edit',
                icon: 'pi pi-pencil',
                command: () => this.openEdit(row)
            });
        }

        if (this.canRowAction) {
            items.push({
                label: this.rowActionLabelResolver?.(row) ?? this.rowActionLabel,
                icon: this.rowActionIconResolver?.(row) ?? this.rowActionIcon,
                command: () => this.confirmDelete(row)
            });
        }

        return items;
    }

    fieldGridClass(field: DynamicField): string {
        switch (field.colSpan) {
            case 3:
                return 'col-span-12 md:col-span-6 xl:col-span-3';
            case 4:
                return 'col-span-12 md:col-span-6 xl:col-span-4';
            case 6:
                return 'col-span-12 md:col-span-6 xl:col-span-6';
            case 8:
                return 'col-span-12 md:col-span-8';
            case 12:
                return 'col-span-12';
            default:
                return 'col-span-12 md:col-span-6 xl:col-span-4';
        }
    }

    isFieldVisible(field: DynamicField): boolean {
        const modeVisible = !field.visibleOn || field.visibleOn === 'both' || field.visibleOn === this.mode;
        if (!modeVisible) {
            return false;
        }

        return field.visibleWhen ? field.visibleWhen(this.currentFormValue(), this.mode) : true;
    }

    isFieldRequired(field: DynamicField): boolean {
        if (!this.isFieldVisible(field)) {
            return false;
        }

        return field.required === true || (field.requiredWhen ? field.requiredWhen(this.currentFormValue(), this.mode) : false);
    }

    fieldOptions(field: DynamicField): SelectOption[] {
        const options = field.options ?? [];
        return field.optionFilter ? options.filter((option) => field.optionFilter?.(option, this.currentFormValue(), this.mode) === true) : options;
    }

    fieldErrorMessage(field: DynamicField): string {
        const control = this.form.get(field.key);
        if (!control?.errors || (!control.touched && !this.submitted)) {
            return '';
        }

        if (control.hasError('required')) {
            return `${field.label} is required`;
        }

        if (control.hasError('pattern')) {
            return field.patternMessage ?? `${field.label} format is invalid`;
        }

        return `${field.label} is invalid`;
    }

    private buildForm(): FormGroup {
        const group: Record<string, unknown[]> = {};

        this.fields.forEach((field) => {
            group[field.key] = [this.getDefaultValue(field), []];
        });

        const form = this.fb.group(group);
        this.applyConditionalFieldState(form);
        return form;
    }

    private registerFormStateHandler(): void {
        this.formSubscription?.unsubscribe();
        this.formSubscription = this.form.valueChanges.subscribe(() => this.applyConditionalFieldState());
    }

    private applyConditionalFieldState(form = this.form): void {
        this.fields.forEach((field) => {
            const control = form.get(field.key);
            if (!control) {
                return;
            }

            control.setValidators(this.fieldValidators(field));

            if (!this.isFieldVisible(field) && field.clearWhenHidden !== false) {
                control.reset(this.getDefaultValue(field), { emitEvent: false });
            }

            this.clearUnavailableOptions(field, control);

            control.updateValueAndValidity({ emitEvent: false });
        });
    }

    private fieldValidators(field: DynamicField): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (this.isFieldRequired(field)) {
            validators.push(Validators.required);
        }

        if (field.pattern) {
            validators.push(Validators.pattern(field.pattern));
        }

        return validators;
    }

    private clearUnavailableOptions(field: DynamicField, control: { value: unknown; reset: (value?: unknown, options?: { emitEvent?: boolean }) => void }): void {
        if (!field.optionFilter || (field.type !== 'select' && field.type !== 'multiSelect')) {
            return;
        }

        const allowedValues = new Set(this.fieldOptions(field).map((option) => option.value));
        if (field.type === 'multiSelect') {
            const selectedValues = Array.isArray(control.value) ? control.value : [];
            const validValues = selectedValues.filter((value) => allowedValues.has(value));
            if (validValues.length !== selectedValues.length) {
                control.reset(validValues, { emitEvent: false });
            }
            return;
        }

        if (control.value && !allowedValues.has(control.value)) {
            control.reset(this.getDefaultValue(field), { emitEvent: false });
        }
    }

    private buildPayload(): Record<string, unknown> | FormData {
        const formValue = this.form.getRawValue() as Record<string, unknown>;
        const fileKeys = Object.keys(this.selectedFiles);

        if (!fileKeys.length) {
            return formValue;
        }

        const formData = new FormData();
        Object.entries(formValue).forEach(([key, value]) => formData.append(key, String(value ?? '')));
        fileKeys.forEach((key) => formData.append(key, this.selectedFiles[key]));

        return formData;
    }

    private getDefaultFormValue(): Record<string, unknown> {
        return this.fields.reduce<Record<string, unknown>>((accumulator, field) => {
            accumulator[field.key] = this.getDefaultValue(field);
            return accumulator;
        }, {});
    }

    private currentFormValue(): Record<string, unknown> {
        return this.form?.getRawValue?.() as Record<string, unknown>;
    }

    private getDefaultValue(field: DynamicField): unknown {
        if (field.defaultValue !== undefined) {
            return field.defaultValue;
        }

        switch (field.type) {
            case 'checkbox':
                return false;
            case 'number':
            case 'decimalNumber':
            case 'currency':
                return null;
            case 'multiSelect':
                return [];
            default:
                return '';
        }
    }

    private rowKey(row: Record<string, unknown>): unknown {
        return row['id'] ?? row;
    }

    private csvEscape(value: unknown): string {
        return `"${String(value ?? '').replace(/"/g, '""')}"`;
    }

    private fileSafeName(value: string): string {
        return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'export';
    }
}
