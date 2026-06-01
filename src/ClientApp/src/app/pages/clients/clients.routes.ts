import { Routes } from '@angular/router';
import { permissionGuard } from '@/core/auth/auth.guard';
import { Permissions } from '@/core/auth/permissions';
import { ClientDetail } from './components/client-detail/client-detail';
import { ClientList } from './components/client-list/client-list';

export default [
    { path: '', component: ClientList, canActivate: [permissionGuard(Permissions.clients.view)] },
    { path: ':id', component: ClientDetail, canActivate: [permissionGuard(Permissions.clients.view)] }
] as Routes;
