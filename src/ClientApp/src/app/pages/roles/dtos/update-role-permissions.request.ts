import { PermissionMatrixItemViewModel } from '../view-models/permission-matrix-item.view-model';

export interface UpdateRolePermissionsRequest {
    roleId: string;
    permissions: PermissionMatrixItemViewModel[];
}
