import { LookupViewModel } from '../../leads/view-models/lookup.view-model';
import { ClientUserLookupViewModel } from './client-user-lookup.view-model';

export interface ClientFilterLookupViewModel {
    countries: LookupViewModel[];
    industries: LookupViewModel[];
    statuses: LookupViewModel[];
    accountOwners: ClientUserLookupViewModel[];
}
