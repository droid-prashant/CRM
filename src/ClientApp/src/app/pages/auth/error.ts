import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [ButtonModule, RouterModule, AppFloatingConfigurator],
    template: ` <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="card w-full max-w-xl text-center">
                <div class="flex justify-center items-center border-2 border-pink-500 rounded-full mx-auto mb-6" style="height: 3.2rem; width: 3.2rem">
                    <i class="pi pi-fw pi-exclamation-circle text-2xl! text-pink-500"></i>
                </div>
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl mb-3">Something Went Wrong</h1>
                <p class="text-muted-color mb-8">The requested resource is not available.</p>
                <p-button label="Go to Dashboard" routerLink="/" severity="danger" />
            </div>
        </div>`
})
export class Error {}
