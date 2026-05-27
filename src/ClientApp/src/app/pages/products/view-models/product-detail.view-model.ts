import { ProductListItemViewModel } from './product-list-item.view-model';

export interface ProductDetailViewModel extends ProductListItemViewModel {
    createdBy: string;
    updatedBy?: string | null;
    updatedAt?: string | null;
}
