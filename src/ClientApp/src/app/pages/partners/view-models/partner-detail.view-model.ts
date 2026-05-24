import { PartnerListItemViewModel } from './partner-list-item.view-model';

export interface PartnerDetailViewModel extends PartnerListItemViewModel {
    createdBy: string;
    updatedBy?: string;
    updatedAt?: string;
}
