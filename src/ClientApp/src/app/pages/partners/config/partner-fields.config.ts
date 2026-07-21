import { DynamicField, SelectOption } from '@/shared/dynamic-form/models/dynamicFields/field.model';
import { NEPAL_CONTACT_NUMBER_MESSAGE, NEPAL_CONTACT_NUMBER_PATTERN } from '@/shared/validation/nepal-contact-number.validation';

export interface PartnerFieldOptions {
    partnerTypes: SelectOption[];
    countries: SelectOption[];
    products: SelectOption[];
}

const partnerTypeCapabilities: Record<string, { canOwnProducts: boolean; canSellInHouseProducts: boolean }> = {
    RESELLER: { canOwnProducts: false, canSellInHouseProducts: true },
    VENDOR: { canOwnProducts: true, canSellInHouseProducts: false },
    SUPPLIER: { canOwnProducts: true, canSellInHouseProducts: false },
    AFFILIATE: { canOwnProducts: false, canSellInHouseProducts: false },
    SALES_AGENT: { canOwnProducts: false, canSellInHouseProducts: true },
    CONSULTANT: { canOwnProducts: false, canSellInHouseProducts: false },
    TECHNOLOGY_PARTNER: { canOwnProducts: true, canSellInHouseProducts: false },
    IMPLEMENTATION_PARTNER: { canOwnProducts: false, canSellInHouseProducts: false },
    SERVICE_PARTNER: { canOwnProducts: false, canSellInHouseProducts: false },
    STRATEGIC_PARTNER: { canOwnProducts: false, canSellInHouseProducts: false },
    OTHER: { canOwnProducts: false, canSellInHouseProducts: false }
};

const normalizePartnerTypeCode = (value: unknown): string => String(value ?? '').trim().replace(/-/g, '_').toUpperCase();

export function buildPartnerFields(options: PartnerFieldOptions): DynamicField[] {
    const canOwnProducts = (formValue: Record<string, unknown>): boolean => {
        const partnerType = options.partnerTypes.find((item) => item.value === formValue['partnerTypeId']);
        const code = normalizePartnerTypeCode(partnerType?.code ?? partnerType?.label);
        return partnerType?.canOwnProducts === true || partnerTypeCapabilities[code]?.canOwnProducts === true;
    };
    const countryDialingCode = (formValue: Record<string, unknown>): string => {
        const country = options.countries.find((item) => item.value === formValue['countryId']);
        return country?.dialingCode ?? '';
    };

    return [
        { key: 'name', label: 'Partner Name', type: 'text', required: true, colSpan: 4, section: 'Partner', placeholder: 'Partner organization or individual' },
        { key: 'partnerTypeId', label: 'Partner Type', type: 'select', required: true, options: options.partnerTypes, colSpan: 4, section: 'Partner', placeholder: 'Select partner type' },
        { key: 'countryId', label: 'Country', type: 'select', required: true, options: options.countries, colSpan: 4, section: 'Partner', placeholder: 'Select country' },
        { key: 'productIds', label: 'Owned Products', type: 'multiSelect', options: options.products, colSpan: 12, section: 'Products', placeholder: 'Select partner-owned products', visibleWhen: canOwnProducts, clearWhenHidden: true },
        { key: 'contactPerson', label: 'Contact Person', type: 'text', colSpan: 4, section: 'Contact', placeholder: 'Primary contact' },
        { key: 'phoneNumber', label: 'Phone Number', type: 'text', colSpan: 4, section: 'Contact', placeholder: 'Phone number', inputPrefix: countryDialingCode },
        { key: 'email', label: 'Email', type: 'email', colSpan: 4, section: 'Contact', placeholder: 'name@example.com' },
        { key: 'address', label: 'Address', type: 'textarea', colSpan: 6, section: 'Additional Details' },
        { key: 'remarks', label: 'Remarks', type: 'textarea', colSpan: 6, section: 'Additional Details' },
        { key: 'isActive', label: 'Active', type: 'checkbox', colSpan: 12, section: 'Status', defaultValue: true, visibleOn: 'update' }
    ];
}
