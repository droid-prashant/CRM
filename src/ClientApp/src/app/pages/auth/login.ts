import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="card w-full max-w-lg">
                <div class="text-center mb-8">
                    <div class="flex justify-center items-center rounded-full bg-primary text-primary-contrast mx-auto mb-6" style="width: 3.5rem; height: 3.5rem">
                        <i class="pi pi-briefcase text-2xl"></i>
                    </div>
                    <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-3">CRM Login</h1>
                    <span class="text-muted-color font-medium">Sign in to continue</span>
                </div>

                <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                <input pInputText id="email1" type="text" placeholder="Email address" class="w-full mb-8" [(ngModel)]="email" />

                <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                    <div class="flex items-center">
                        <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                        <label for="rememberme1">Remember me</label>
                    </div>
                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                </div>

                <p-button label="Sign In" styleClass="w-full" routerLink="/"></p-button>
            </div>
        </div>
    `
})
export class Login {
    email = '';
    password = '';
    checked = false;
}
