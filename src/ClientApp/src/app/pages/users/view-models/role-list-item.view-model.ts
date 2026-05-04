export interface RoleListItemViewModel {
    id: string;
    name: string;
    code?: string;
    description: string;
    isSystemRole: boolean;
    isActive: boolean;
    userCount: number;
    createdAt: string;
}
