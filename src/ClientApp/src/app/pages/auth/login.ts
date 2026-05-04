import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/core/auth/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule, ToastModule, AppFloatingConfigurator],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast position="bottom-right"></p-toast>

        <main class="min-h-screen bg-surface-50 px-4 py-8 dark:bg-surface-950">
            <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
                <section class="w-full rounded-md border border-surface-200 bg-surface-0 p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <div class="mb-8">
                        <span class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-contrast">
                            <i class="pi pi-lock text-xl"></i>
                        </span>
                        <h1 class="m-0 text-2xl font-semibold text-surface-900 dark:text-surface-0">CRM Sign In</h1>
                        <p class="mt-2 mb-0 text-surface-600 dark:text-surface-300">Use your assigned CRM credentials.</p>
                    </div>

                    <form [formGroup]="form" class="flex flex-col gap-4" (ngSubmit)="submit()">
                        <div>
                            <label for="usernameOrEmail" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Username or Email</label>
                            <input id="usernameOrEmail" pInputText type="text" class="w-full" formControlName="usernameOrEmail" autocomplete="username" />
                        </div>

                        <div>
                            <label for="password" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Password</label>
                            <p-password inputId="password" formControlName="password" [toggleMask]="true" [feedback]="false" [fluid]="true" autocomplete="current-password" />
                        </div>

                        <p-button type="submit" label="Sign In" icon="pi pi-sign-in" styleClass="w-full" [loading]="isSubmitting" [disabled]="form.invalid || isSubmitting" />
                    </form>
                </section>
            </div>
        </main>
    `
})
export class Login {
    isSubmitting = false;
    form: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly messageService: MessageService
    ) {
        this.form = this.fb.nonNullable.group({
            usernameOrEmail: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        const value = this.form.getRawValue() as { usernameOrEmail: string; password: string };
        this.authService.login(value).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.isSubmitting = false;
                const detail = error.error?.error ?? 'Invalid username/email or password.';
                this.messageService.add({ severity: 'error', summary: 'Sign in failed', detail, life: 5000 });
            }
        });
    }
}
