export interface ClientEditViewModel {
    id: string;
    clientCode: string;
    name: string;
    shortName?: string | null;
    clientTypeId?: string | null;
    industryId?: string | null;
    countryId: string;
    address?: string | null;
    website?: string | null;
    taxNumber?: string | null;
    registrationNumber?: string | null;
    status: number;
    accountOwnerUserId?: string | null;
    notes?: string | null;
    isActive: boolean;
}
