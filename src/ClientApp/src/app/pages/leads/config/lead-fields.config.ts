import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';

export interface LeadFieldOptions {
    sources: SelectOption[];
    categories: SelectOption[];
    partners: SelectOption[];
    countries: SelectOption[];
    industries: SelectOption[];
    products: SelectOption[];
}

export function buildLeadFields(options: LeadFieldOptions): DynamicField[] {
    const isCampaignSource = (formValue: Record<string, unknown>) => selectedSourceCode(formValue, options.sources) === 'campaign';
    const isPartnerSource = (formValue: Record<string, unknown>) => selectedSourceCode(formValue, options.sources) === 'partner';

    return [
        { key: 'sourceId', label: 'Source', type: 'select', required: true, options: options.sources, colSpan: 3, section: 'Lead Classification', placeholder: 'Select lead source' },
        { key: 'categoryId', label: 'Category', type: 'select', required: true, options: options.categories, colSpan: 3, section: 'Lead Classification', placeholder: 'Select lead category' },
        { key: 'partnerId', label: 'Partner', type: 'select', options: options.partners, colSpan: 3, section: 'Lead Classification', placeholder: 'Select lead partner', visibleWhen: isPartnerSource, requiredWhen: isPartnerSource },
        { key: 'leadScore', label: 'Lead Score', type: 'number', colSpan: 3, section: 'Lead Classification' },
        { key: 'companyName', label: 'Company Name', type: 'text', required: true, colSpan: 4, section: 'Company & Contact', placeholder: 'Prospect company' },
        { key: 'website', label: 'Website', type: 'text', colSpan: 4, section: 'Company & Contact', placeholder: 'https://example.com' },
        { key: 'countryId', label: 'Country', type: 'select', required: true, options: options.countries, colSpan: 4, section: 'Company & Contact', placeholder: 'Select country' },
        { key: 'contactPersonName', label: 'Contact Person', type: 'text', required: true, colSpan: 4, section: 'Company & Contact', placeholder: 'Full name' },
        { key: 'jobTitle', label: 'Job Title', type: 'text', colSpan: 4, section: 'Company & Contact', placeholder: 'Job title' },
        { key: 'industryId', label: 'Industry', type: 'select', options: options.industries, colSpan: 4, section: 'Company & Contact', placeholder: 'Select industry' },
        { key: 'email', label: 'Email', type: 'email', colSpan: 4, section: 'Company & Contact', placeholder: 'name@company.com' },
        { key: 'phone', label: 'Phone', type: 'text', colSpan: 4, section: 'Company & Contact', placeholder: 'Phone number' },
        { key: 'alternatePhone', label: 'Alternate Phone', type: 'text', colSpan: 4, section: 'Company & Contact', placeholder: 'Alternate phone number' },
        { key: 'productIds', label: 'Product Interests', type: 'multiSelect', required: true, options: options.products, colSpan: 12, section: 'Product Interest', placeholder: 'Select products' },
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
