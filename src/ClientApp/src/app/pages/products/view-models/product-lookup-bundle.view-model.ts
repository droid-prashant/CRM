import { ProductOptionViewModel } from './product-option.view-model';

export interface ProductOwnerPartnerLookupViewModel {
    id: string;
    name: string;
    code?: string | null;
    partnerTypeCode?: string | null;
}

export interface ProductLookupBundleViewModel {
    productTypes: ProductOptionViewModel[];
    deploymentTypes: ProductOptionViewModel[];
    ownershipTypes: ProductOptionViewModel[];
    ownerPartners: ProductOwnerPartnerLookupViewModel[];
}
