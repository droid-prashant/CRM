import { LookupViewModel } from '../../leads/view-models/lookup.view-model';
import { ClientUserLookupViewModel } from './client-user-lookup.view-model';

export interface ClientLookupBundleViewModel {
    clientTypes: LookupViewModel[];
    countries: LookupViewModel[];
    industries: LookupViewModel[];
    accountOwners: ClientUserLookupViewModel[];
}
