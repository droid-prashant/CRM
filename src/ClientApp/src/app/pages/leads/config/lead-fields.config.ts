import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export interface LeadFieldOptions {
    sources: SelectOption[];
    categories: SelectOption[];
    partners: SelectOption[];
    countries: SelectOption[];
    industries: SelectOption[];
    products: SelectOption[];
    clients: SelectOption[];
    contacts: SelectOption[];
}

export function buildLeadFields(options: LeadFieldOptions): DynamicField[] {
    const isCampaignSource = (formValue: Record<string, unknown>) => selectedSourceCode(formValue, options.sources) === 'campaign';
    const isPartnerSource = (formValue: Record<string, unknown>) => selectedSourceCode(formValue, options.sources) === 'partner';
    const isPartnerOwnedProductContext = (formValue: Record<string, unknown>): boolean => {
        if (!isPartnerSource(formValue)) {
            return false;
        }

        const partnerTypeCode = selectedPartnerTypeCode(formValue, options.partners);
        return partnerTypeCode === 'vendor' || partnerTypeCode === 'supplier';
    };
    const availableProductInterest = (option: SelectOption, formValue: Record<string, unknown>): boolean => {
        if (!isPartnerOwnedProductContext(formValue)) {
            return isInHouseProduct(option);
        }

        return selectedPartnerProductIds(formValue, options.partners).has(String(option.value));
    };
    const contactBelongsToSelectedClient = (option: SelectOption, formValue: Record<string, unknown>): boolean => {
        const selectedClientId = formValue['clientId'];
        return !!selectedClientId && option.clientId === selectedClientId;
    };

    return [
        { key: 'sourceId', label: 'Source', type: 'select', required: true, options: options.sources, colSpan: 3, section: 'Lead Classification', placeholder: 'Select lead source' },
        { key: 'categoryId', label: 'Category', type: 'select', required: true, options: options.categories, colSpan: 3, section: 'Lead Classification', placeholder: 'Select lead category' },
        { key: 'partnerId', label: 'Partner', type: 'select', options: options.partners, colSpan: 3, section: 'Lead Classification', placeholder: 'Select lead partner', visibleWhen: isPartnerSource, requiredWhen: isPartnerSource },
        { key: 'leadScore', label: 'Lead Score', type: 'number', colSpan: 3, section: 'Lead Classification' },
        { key: 'clientId', label: 'Client', type: 'select', required: true, options: options.clients, colSpan: 6, section: 'Client', placeholder: 'Select existing client' },
        { key: 'clientContactId', label: 'Contact', type: 'select', required: true, options: options.contacts, colSpan: 6, section: 'Client', placeholder: 'Select client contact', optionFilter: contactBelongsToSelectedClient },
        { key: 'productIds', label: 'Product Interests', type: 'multiSelect', required: true, options: options.products, colSpan: 12, section: 'Product Interest', placeholder: 'Select products', optionFilter: availableProductInterest },
        { key: 'campaignName', label: 'Campaign Name', type: 'text', colSpan: 3, section: 'Source Details', visibleWhen: isCampaignSource, requiredWhen: isCampaignSource },
        { key: 'sourceStartDate', label: 'Start Date', type: 'date', colSpan: 3, section: 'Source Details', visibleWhen: isCampaignSource, requiredWhen: isCampaignSource },
        { key: 'sourceEndDate', label: 'End Date', type: 'date', colSpan: 3, section: 'Source Details', visibleWhen: isCampaignSource, requiredWhen: isCampaignSource },
        { key: 'address', label: 'Address', type: 'textarea', colSpan: 3, section: 'Source Details', visibleWhen: isCampaignSource, requiredWhen: isCampaignSource }
    ];
}

function selectedSourceCode(formValue: Record<string, unknown>, sources: SelectOption[]): string {
    const selectedSourceId = formValue['sourceId'];
    const source = sources.find((option) => option.value === selectedSourceId);
    return String(source?.code ?? source?.label ?? '').trim().toLowerCase();
}

function selectedPartnerTypeCode(formValue: Record<string, unknown>, partners: SelectOption[]): string {
    const selectedPartnerId = formValue['partnerId'];
    const partner = partners.find((option) => option.value === selectedPartnerId);
    return String(partner?.partnerTypeCode ?? '').trim().replace(/-/g, '_').toLowerCase();
}

function selectedPartnerId(formValue: Record<string, unknown>): string | null {
    const selectedPartnerId = formValue['partnerId'];
    return typeof selectedPartnerId === 'string' && selectedPartnerId.trim() ? selectedPartnerId : null;
}

function selectedPartnerProductIds(formValue: Record<string, unknown>, partners: SelectOption[]): Set<string> {
    const partnerId = selectedPartnerId(formValue);
    const partner = partners.find((option) => option.value === partnerId);
    return new Set((partner?.productIds ?? []).map(String));
}

function isInHouseProduct(option: SelectOption): boolean {
    return !option.ownershipType || option.ownershipType === 1;
}
