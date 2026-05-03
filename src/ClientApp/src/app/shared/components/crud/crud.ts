import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';
import { DynamicField } from '@/shared/dynamic-form/models/dynamicFields/field.model';

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
        DialogModule,
        IconFieldModule,
        InputIconModule,
        InputNumberModule,
        InputTextModule,
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
export class Crud implements OnChanges {
    @Input({ required: true }) fields: DynamicField[] = [];
    @Input({ required: true }) columns: DynamicColumn[] = [];
    @Input() data: Record<string, unknown>[] = [];
    @Input() title = 'Record';
    @Input() dataNotFound = false;
    @Input() errorMessage = 'No records found.';

    @Output() save = new EventEmitter<CrudSaveEvent>();
    @Output() delete = new EventEmitter<Record<string, unknown>>();
    @Output() bulkDelete = new EventEmitter<Record<string, unknown>[]>();

    @ViewChild('dt') dt!: Table;

    dialog = false;
    submitted = false;
    form: FormGroup = this.fb.group({});
    selectedRows: Record<string, unknown>[] = [];

    private mode: CrudMode = 'create';
    private editingRow?: Record<string, unknown>;
    private selectedFiles: Record<string, File> = {};

    constructor(
        private readonly fb: FormBuilder,
        private readonly confirmationService: ConfirmationService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['fields']) {
            this.form = this.buildForm();
        }
    }

    get globalFilterFields(): string[] {
        return this.columns.map((column) => column.field);
    }

    openNew(): void {
        this.mode = 'create';
        this.editingRow = undefined;
        this.selectedFiles = {};
        this.submitted = false;
        this.form.reset(this.getDefaultFormValue());
        this.dialog = true;
    }

    openEdit(row: Record<string, unknown>): void {
        this.mode = 'update';
        this.editingRow = row;
        this.selectedFiles = {};
        this.submitted = false;
        this.form.reset({ ...this.getDefaultFormValue(), ...row });
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
        this.confirmationService.confirm({
            message: `Are you sure you want to delete this ${this.title.toLowerCase()}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.delete.emit(row)
        });
    }

    confirmBulkDelete(): void {
        if (!this.selectedRows.length) {
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to delete the selected ${this.title.toLowerCase()} records?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.bulkDelete.emit(this.selectedRows)
        });
    }

    exportCSV(): void {
        this.dt.exportCSV();
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

    fieldGridClass(field: DynamicField): string {
        const span = field.colSpan ?? 12;
        return `col-span-12 md:col-span-${span}`;
    }

    private buildForm(): FormGroup {
        const group: Record<string, unknown[]> = {};

        this.fields.forEach((field) => {
            const validators = field.required ? [Validators.required] : [];
            group[field.key] = [this.getDefaultValue(field), validators];
        });

        return this.fb.group(group);
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

    private getDefaultValue(field: DynamicField): unknown {
        switch (field.type) {
            case 'checkbox':
                return false;
            case 'number':
            case 'decimalNumber':
            case 'currency':
                return null;
            default:
                return '';
        }
    }
}
