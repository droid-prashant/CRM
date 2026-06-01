export interface UpdateClientRequest {
    name: string;
    shortName?: string | null;
    clientTypeId?: string | null;
    industryId?: string | null;
    countryId: string;
    address?: string | null;
    website?: string | null;
    taxNumber?: string | null;
    registrationNumber?: string | null;
    accountOwnerUserId?: string | null;
    notes?: string | null;
    status: number;
    isActive: boolean;
}
