import { Routes } from '@angular/router';
import { roleGuard } from '@/core/auth/auth.guard';
import { LookupList } from './components/lookup-list/lookup-list';

export default [{ path: '', component: LookupList, canActivate: [roleGuard(['Admin', 'SuperAdmin'])] }] as Routes;
