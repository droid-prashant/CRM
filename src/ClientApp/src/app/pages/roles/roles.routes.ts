import { Routes } from '@angular/router';
import { permissionGuard } from '@/core/auth/auth.guard';
import { Permissions } from '@/core/auth/permissions';
import { RoleList } from './components/role-list/role-list';

export default [{ path: '', component: RoleList, canActivate: [permissionGuard(Permissions.roles.view)] }] as Routes;
