export interface ClientListItemViewModel {
    id: string;
    clientCode: string;
    name: string;
    shortName?: string | null;
    clientTypeId?: string | null;
    clientTypeName?: string | null;
    industryId?: string | null;
    industryName?: string | null;
    countryId: string;
    countryName: string;
    address?: string | null;
    website?: string | null;
    taxNumber?: string | null;
    registrationNumber?: string | null;
    accountOwnerUserId?: string | null;
    accountOwnerUserName?: string | null;
    notes?: string | null;
    status: number;
    statusName: string;
    contactCount: number;
    productCount: number;
    isActive: boolean;
    createdAt: string;
}
