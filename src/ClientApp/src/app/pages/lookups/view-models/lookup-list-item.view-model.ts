export interface LookupListItemViewModel {
    id: string;
    lookupId: number;
    lookupName: string;
    name: string;
    description?: string | null;
    order: number;
    isActive: boolean;
    createdOn: string;
}
