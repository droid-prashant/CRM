import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
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

    ngOnInit() {
        this.model = [
            {
                label: 'CRM',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Leads', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pages/leads'] },
                    { label: 'User Management', icon: 'pi pi-fw pi-users', routerLink: ['/pages/users'] }
                ]
            }
        ];
    }
}
