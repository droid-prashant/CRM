import { PermissionMatrixItemViewModel } from './permission-matrix-item.view-model';

export interface RolePermissionViewModel {
    roleId: string;
    roleName: string;
    modules: PermissionMatrixItemViewModel[];
}
