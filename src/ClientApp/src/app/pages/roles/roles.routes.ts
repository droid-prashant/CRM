import { Routes } from '@angular/router';
import { roleGuard } from '@/core/auth/auth.guard';
import { RoleList } from './components/role-list/role-list';

export default [{ path: '', component: RoleList, canActivate: [roleGuard(['Admin', 'SuperAdmin'])] }] as Routes;
