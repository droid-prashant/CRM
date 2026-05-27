import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '@/core/http/api-url';
import { CreateProductRequest } from '../dtos/create-product.request';
import { UpdateProductRequest } from '../dtos/update-product.request';
import { ProductDetailViewModel } from '../view-models/product-detail.view-model';
import { ProductListItemViewModel } from '../view-models/product-list-item.view-model';
import { ProductLookupBundleViewModel } from '../view-models/product-lookup-bundle.view-model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
    private readonly productsUrl = apiUrl('/products');

    constructor(private readonly http: HttpClient) {}

    getProducts() {
        return this.http.get<ProductListItemViewModel[]>(this.productsUrl);
    }

    getProduct(id: string) {
        return this.http.get<ProductDetailViewModel>(`${this.productsUrl}/${id}`);
    }

    getLookups() {
        return this.http.get<ProductLookupBundleViewModel>(`${this.productsUrl}/lookups`);
    }

    createProduct(request: CreateProductRequest) {
        return this.http.post<ProductDetailViewModel>(this.productsUrl, request);
    }

    updateProduct(id: string, request: UpdateProductRequest) {
        return this.http.put<ProductDetailViewModel>(`${this.productsUrl}/${id}`, request);
    }

    activateProduct(id: string) {
        return this.http.patch<void>(`${this.productsUrl}/${id}/activate`, {});
    }

    deactivateProduct(id: string) {
        return this.http.patch<void>(`${this.productsUrl}/${id}/deactivate`, {});
    }
}
