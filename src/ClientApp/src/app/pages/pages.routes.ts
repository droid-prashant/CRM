import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'users', loadChildren: () => import('./users/users.routes').then((m) => m.default) },
    {path:'inventory', loadChildren: () => import('./inventory/inventory.routes').then(m => m.default)},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
