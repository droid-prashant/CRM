import { Routes } from '@angular/router';
import { permissionGuard } from '@/core/auth/auth.guard';
import { Permissions } from '@/core/auth/permissions';
import { LeadDetail } from './components/lead-detail/lead-detail';
import { LeadList } from './components/lead-list/lead-list';

export default [
    { path: '', component: LeadList, canActivate: [permissionGuard(Permissions.leads.view)] },
    { path: ':id', component: LeadDetail, canActivate: [permissionGuard(Permissions.leads.view)] }
] as Routes;
