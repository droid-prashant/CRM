import { Routes } from '@angular/router';

export default [
    { path: '', redirectTo: '/pages/leads', pathMatch: 'full' },
    { path: 'clients', loadChildren: () => import('./clients/clients.routes').then((m) => m.default) },
    { path: 'leads', loadChildren: () => import('./leads/leads.routes').then((m) => m.default) },
    { path: 'notifications', loadChildren: () => import('./notifications/notifications.routes').then((m) => m.default) },
    { path: 'opportunities', loadChildren: () => import('./opportunities/opportunities.routes').then((m) => m.default) },
    { path: 'partners', loadChildren: () => import('./partners/partners.routes').then((m) => m.default) },
    { path: 'products', loadChildren: () => import('./products/products.routes').then((m) => m.default) },
    { path: 'roles', loadChildren: () => import('./roles/roles.routes').then((m) => m.default) },
    { path: 'users', loadChildren: () => import('./users/users.routes').then((m) => m.default) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
