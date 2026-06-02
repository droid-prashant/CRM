import { LookupViewModel } from '../../leads/view-models/lookup.view-model';
import { ClientUserLookupViewModel } from './client-user-lookup.view-model';

export interface ClientOpportunityLookupViewModel {
    id: string;
    clientId: string;
    productId: string;
    opportunityNumber: string;
    title: string;
    displayName: string;
}

export interface ClientProductLookupBundleViewModel {
    products: LookupViewModel[];
    owners: ClientUserLookupViewModel[];
    opportunities: ClientOpportunityLookupViewModel[];
    relationshipStatuses: LookupViewModel[];
}
