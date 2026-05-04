import { Routes } from '@angular/router';

export default [
    { path: '', redirectTo: '/pages/leads', pathMatch: 'full' },
    { path: 'leads', loadChildren: () => import('./leads/leads.routes').then((m) => m.default) },
    { path: 'roles', loadChildren: () => import('./roles/roles.routes').then((m) => m.default) },
    { path: 'users', loadChildren: () => import('./users/users.routes').then((m) => m.default) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
