import { Crud } from '@/pages/crud/crud';
import { Component, OnInit, signal } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ProductDto } from '../../dtos/product.dto';
import { InventoryApiService } from '../../services/inventory.api-service';
import { MessageService } from 'primeng/api';
import { ProductColumnTypeMap } from '../../config/product/product-columns.config';
import { DynamicColumn } from '@/shared/dynamic-form/models/dynamicFields/column.model';
import { ProductFields } from '../../config/product/product-fields.config';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [Crud, ToastModule],
  templateUrl: './product.html',
  styleUrl: './product.scss',
  providers: [InventoryApiService, MessageService]
})
export class Product implements OnInit {
  data: ProductDto[] = [];

  fields = ProductFields;
  title: string = "Product";
  errorMessage: string = "";

  dataNotFound: boolean = false;
  isLoading: boolean = true;
  submitted: boolean = false;

  constructor(private _inventoryApiService: InventoryApiService, private _messageService: MessageService) { }
  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this._inventoryApiService.getAllProducts().subscribe({
      next: (res) => {
        this.data = res;
        if(this.data.length === 0) {
          this.dataNotFound = true;
          this.errorMessage = "No products found.";
        }
        this.isLoading = false
      },
      error: (err) => {
        if (err.status === 404) {
          this.dataNotFound = true;
          this.errorMessage = err.error.message;
          this.isLoading = false
          this._messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage, life: 5000 });
        }
      }
    });
  }

  saveForm(productData: FormData) {
    this.submitted = true;

    this._inventoryApiService.postProduct(productData).subscribe({
      next: (res) => {
        this.getAllProducts();
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: `${this.title} added successfully`, life: 3000 });
      },
      error: (err) => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: `failed to add ${this.title}`, life: 3000 });
      }
    });
  }

  columns = signal(Object.keys(ProductColumnTypeMap).map(key => {
    const col = ProductColumnTypeMap[key];
    return {
      field: key,
      header: col.label,
      type: col.type,
      width: col.width ?? '200px',
      sortable: col.sortable ?? false
    } as DynamicColumn;
  }));

}
