import { Routes } from '@angular/router';
import { Product } from './components/product/product';

export default [
    { path: 'product', component: Product },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
