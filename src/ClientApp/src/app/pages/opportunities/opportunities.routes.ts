import { Routes } from '@angular/router';
import { permissionGuard } from '@/core/auth/auth.guard';
import { Permissions } from '@/core/auth/permissions';
import { OpportunityList } from './components/opportunity-list/opportunity-list';

export default [{ path: '', component: OpportunityList, canActivate: [permissionGuard(Permissions.opportunities.view)] }] as Routes;
