import { Routes } from '@angular/router';
import { roleGuard } from '@/core/auth/auth.guard';
import { UserList } from './components/user-list/user-list';

export default [{ path: '', component: UserList, canActivate: [roleGuard(['Admin', 'SuperAdmin'])] }] as Routes;
