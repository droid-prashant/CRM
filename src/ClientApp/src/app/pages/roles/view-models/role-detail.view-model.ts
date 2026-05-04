import { RoleUserListItemViewModel } from './role-user-list-item.view-model';

export interface RoleDetailViewModel {
    id: string;
    name: string;
    code?: string;
    description: string;
    isSystemRole: boolean;
    isActive: boolean;
    userCount: number;
    linkedUsers: RoleUserListItemViewModel[];
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}
