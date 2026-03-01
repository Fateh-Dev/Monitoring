import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MonitoringService } from '../../services/monitoring.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      class="fixed inset-y-0 left-0 bg-surface border-r border-border flex flex-col z-[100]"
      [class.w-72]="!service.sidebarCollapsed()"
      [class.w-20]="service.sidebarCollapsed()"
    >
      <!-- Header / Logo -->
      <div
        class="h-20 flex items-center px-5 border-b border-border/50 shrink-0 relative"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <div
            class="w-10 h-10 bg-text rounded-xl flex items-center justify-center text-surface font-bold text-xl shadow-lg shadow-black/5 shrink-0"
          >
            M
          </div>
          <div
            [class.hidden]="service.sidebarCollapsed()"
            class="whitespace-nowrap"
          >
            <h1 class="text-sm font-bold text-text leading-none tracking-tight">
              MONITORING
            </h1>
            <p
              class="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5"
            >
              Plateforme Intranet
            </p>
          </div>
        </div>

        <!-- Toggle Button -->
        <button
          (click)="service.sidebarCollapsed.set(!service.sidebarCollapsed())"
          class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-text-muted hover:text-text shadow-sm hover:scale-110 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            [class.rotate-180]="service.sidebarCollapsed()"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-8 overflow-x-hidden">
        <!-- Navigation -->
        <div class="space-y-2 pt-4">
          <label
            *ngIf="!service.sidebarCollapsed()"
            class="px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest block"
          >
            Menu
          </label>
          <nav class="flex flex-col gap-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-primary/10 text-primary"
              class="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-text-muted hover:bg-bg outline-none"
              [title]="service.sidebarCollapsed() ? 'Tableau de Bord' : ''"
            >
              <svg
                class="shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span
                *ngIf="!service.sidebarCollapsed()"
                class="whitespace-nowrap"
                >Tableau de Bord</span
              >
            </a>
            <a
              routerLink="/alerts"
              routerLinkActive="bg-rose-500/10 text-rose-600"
              class="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-text-muted hover:bg-bg outline-none group relative"
              [title]="service.sidebarCollapsed() ? 'Alertes' : ''"
            >
              <div class="relative">
                <svg
                  class="shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <!-- Collapsed Badge -->
                <span
                  *ngIf="
                    service.sidebarCollapsed() &&
                    service.alertesActivesCompte() > 0
                  "
                  class="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"
                ></span>
              </div>
              <span
                *ngIf="!service.sidebarCollapsed()"
                class="whitespace-nowrap flex items-center justify-between flex-1"
              >
                Alertes
                <span
                  *ngIf="service.alertesActivesCompte() > 0"
                  class="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center"
                >
                  {{ service.alertesActivesCompte() }}
                </span>
              </span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Footer / Action -->
      <div
        class="p-4 border-t border-border bg-surface/30 flex flex-col gap-3 justify-center"
      >
        <!-- Theme Toggle -->
        <!-- <button 
          (click)="service.modeSombre.set(!service.modeSombre())"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold hover:bg-surface border border-transparent hover:border-border text-text-muted hover:text-text cursor-pointer outline-none"
          [title]="service.modeSombre() ? 'Mode Clair' : 'Mode Sombre'"
        >
          <div class="shrink-0 w-6 flex justify-center">
            <svg *ngIf="!service.modeSombre()" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            <svg *ngIf="service.modeSombre()" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </div>
          <span *ngIf="!service.sidebarCollapsed()" class="whitespace-nowrap">
            {{ service.modeSombre() ? 'Mode Clair' : 'Mode Sombre' }}
          </span>
        </button> -->

        <!-- Action Button -->
        <button
          (click)="service.montrerFormulaire.set(true)"
          class="flex items-center justify-center bg-primary text-white rounded-xl active:scale-95 hover:bg-primary-hover focus:ring-2 focus:ring-primary/20 group shadow-sm overflow-hidden"
          [class.w-full]="!service.sidebarCollapsed()"
          [class.h-11]="!service.sidebarCollapsed()"
          [class.w-12]="service.sidebarCollapsed()"
          [class.h-12]="service.sidebarCollapsed()"
          [title]="service.sidebarCollapsed() ? 'Nouveau Client' : ''"
        >
          <span class="text-xl font-light shrink-0">+</span>
          <span
            *ngIf="!service.sidebarCollapsed()"
            class="text-[13px] font-bold tracking-tight whitespace-nowrap ml-2"
            >Nouveau Client</span
          >
        </button>
      </div>
    </aside>
  `,
  styles: [],
})
export class SidebarComponent {
  service = inject(MonitoringService);
}
