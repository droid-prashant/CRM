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
                    ...(this.authService.hasPermission(Permissions.clients.view) ? [{ label: 'Clients', icon: 'pi pi-fw pi-building', routerLink: ['/pages/clients'] }] : []),
                    ...(this.authService.hasPermission(Permissions.leads.view) ? [{ label: 'Leads', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pages/leads'] }] : []),
                    ...(this.authService.hasPermission(Permissions.opportunities.view) ? [{ label: 'Opportunities', icon: 'pi pi-fw pi-chart-line', routerLink: ['/pages/opportunities'] }] : []),
                    ...(this.authService.hasPermission(Permissions.partners.view) ? [{ label: 'Partners', icon: 'pi pi-fw pi-share-alt', routerLink: ['/pages/partners'] }] : []),
                    ...(this.authService.hasPermission(Permissions.products.view) ? [{ label: 'Products', icon: 'pi pi-fw pi-box', routerLink: ['/pages/products'] }] : [])
                ]
            },
            {
                label: 'Administration',
                items: [
                    ...(this.authService.hasPermission(Permissions.users.view) ? [{ label: 'Users', icon: 'pi pi-fw pi-users', routerLink: ['/pages/users'] }] : []),
                    ...(this.authService.hasPermission(Permissions.roles.view) ? [{ label: 'Roles', icon: 'pi pi-fw pi-shield', routerLink: ['/pages/roles'] }] : []),
                    ...(this.authService.hasPermission(Permissions.notifications.view) ? [{ label: 'Notifications', icon: 'pi pi-fw pi-bell', routerLink: ['/pages/notifications'] }] : [])
                ]
            }
        ].filter((group) => !!group.items?.length);
    }
}
