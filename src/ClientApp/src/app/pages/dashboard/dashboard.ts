import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    template: `
        <section class="grid grid-cols-12 gap-6">
            <div class="col-span-12">
                <div class="card">
                    <div class="text-sm text-surface-500 dark:text-surface-400 mb-2">CRM workspace</div>
                    <h1 class="text-2xl font-semibold m-0">Dashboard</h1>
                    <p class="text-surface-600 dark:text-surface-300 mt-3 mb-0">
                        This clean baseline is ready for the first real CRM user story.
                    </p>
                </div>
            </div>
        </section>
    `
})
export class Dashboard {}
