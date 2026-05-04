import { Routes } from '@angular/router';
import { permissionGuard } from '@/core/auth/auth.guard';
import { Permissions } from '@/core/auth/permissions';
import { UserList } from './components/user-list/user-list';

export default [{ path: '', component: UserList, canActivate: [permissionGuard(Permissions.users.view)] }] as Routes;
