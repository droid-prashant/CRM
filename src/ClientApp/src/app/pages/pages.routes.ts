import { Routes } from '@angular/router';

export default [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
