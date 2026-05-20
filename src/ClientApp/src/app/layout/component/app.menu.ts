import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@/core/auth/auth.service';
import { Permissions } from '@/core/auth/permissions';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track $index) {
            <ng-container>
                @if (!item.separator) {
                    <li app-menuitem [item]="item" [index]="$index" [root]="true"></li>
                    <li class="menu-separator"></li>
                }
            </ng-container>
        }
    </ul>`
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private readonly authService: AuthService) {}

    ngOnInit() {
        this.model = [
            {
                label: 'CRM',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    ...(this.authService.hasPermission(Permissions.leads.view) ? [{ label: 'Leads', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pages/leads'] }] : []),
                    ...(this.authService.hasPermission(Permissions.opportunities.view) ? [{ label: 'Opportunities', icon: 'pi pi-fw pi-chart-line', routerLink: ['/pages/opportunities'] }] : [])
                ]
            },
            {
                label: 'Administration',
                items: [
                    ...(this.authService.hasPermission(Permissions.users.view) ? [{ label: 'Users', icon: 'pi pi-fw pi-users', routerLink: ['/pages/users'] }] : []),
                    ...(this.authService.hasPermission(Permissions.roles.view) ? [{ label: 'Roles', icon: 'pi pi-fw pi-shield', routerLink: ['/pages/roles'] }] : [])
                ]
            }
        ].filter((group) => !!group.items?.length);
    }
}
