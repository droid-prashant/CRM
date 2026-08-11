export interface LookupListItemViewModel {
    id: string;
    lookupId: number;
    lookupName: string;
    name: string;
    description?: string | null;
    order: number;
    dialingCode?: string | null;
    isActive: boolean;
    createdOn: string;
}
