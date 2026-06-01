export interface ClientUpdatedViewModel {
    id: string;
    clientCode: string;
    name: string;
    countryName: string;
    industryName?: string | null;
    status: number;
    statusName: string;
    accountOwnerUserName?: string | null;
    updatedAt?: string | null;
}
