import { ClientListItemViewModel } from './client-list-item.view-model';

export interface ClientListResponseViewModel {
    items: ClientListItemViewModel[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
