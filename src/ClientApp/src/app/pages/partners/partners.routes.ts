import { Routes } from '@angular/router';
import { permissionGuard } from '@/core/auth/auth.guard';
import { Permissions } from '@/core/auth/permissions';
import { PartnerList } from './components/partner-list/partner-list';

export default [{ path: '', component: PartnerList, canActivate: [permissionGuard(Permissions.partners.view)] }] as Routes;
