import { Component, EventEmitter, Input, OnInit, Output, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';
import { FileDemo } from '../uikit/filedemo';
import { ApiService } from '../service/api.service';
import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';
import { DynamicField } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { RestaurantDTO } from '@/shared/dynamic-form/models/restaurants/restaurant.dto';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        FileDemo
    ],
    templateUrl: './crud.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class Crud implements OnInit {

    @Input({ required: true }) fields: DynamicField[] = [];
    @Input() title = 'Add New';
    visible = signal(false);
    form!: FormGroup;

    @Input({ required: true }) dataNotFound: boolean = false;
    @Input({ required: true }) errorMessage: string = "";

    @Input() columns: DynamicColumn[] = [];
    @Input() data: any[] = [];

    @Output() crudEvent = new EventEmitter<any>();

    selectedItem = signal<any>(null);

    dialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    selectedImage: any;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.setupFormValidation();
        this.loadDemoData();
        console.log(this.columns);
    }

    setupFormValidation() {
        const group: Record<string, any> = {};
        this.fields.forEach(field => {
            group[field.key] = (field.type === 'number' || field.type === 'decimalNumber') ? [null, Validators.required] : field.required ?  ['', Validators.required] : [''];
        });

        this.form = this.fb.group(group);
    }

    open() {
        this.visible.set(true);
    }

    buildForm() {
        const group: Record<string, any> = {};

        this.fields.forEach(field => {
            const defaultValue = this.getDefaultValue(field);
            group[field.key] = field.required
                ? [defaultValue, Validators.required]
                : [defaultValue];
        });

        return new FormGroup(group);
    }

    getDefaultValue(field: DynamicField): any {
        switch (field.type) {

            case 'text':
            case 'email':
            case 'textarea':
            case 'select':
            case 'radio':
                return '';

            case 'number':
                return null;

            case 'checkbox':
                return false;

            default:
                return '';
        }
    }

    loadDemoData() {
        this.productService.getProducts().then((data) => {
            this.products.set(data);
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.dialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.dialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.dialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => val.id !== product.id));
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    onImageSelect(event: any) {
        this.selectedImage = event;
    }

    saveForm() {
        this.submitted = true;

        if(this.form.invalid){
            return;
        }
        const formValue = this.form.value;

        if (this.selectedImage) {
            const formData = new FormData();

            Object.keys(formValue).forEach(key => {
                const value = (formValue as any)[key]
                formData.append(key, value);
            });

            formData.append("files", this.selectedImage);
            this.crudEvent.emit(formData);
        }
        else {
            this.crudEvent.emit(formValue);
        }
        this.dialog = false
    }
}
