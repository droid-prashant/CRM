import { Routes } from '@angular/router';
import { permissionGuard } from '@/core/auth/auth.guard';
import { Permissions } from '@/core/auth/permissions';
import { ProductList } from './components/product-list/product-list';

export default [{ path: '', component: ProductList, canActivate: [permissionGuard(Permissions.products.view)] }] as Routes;
