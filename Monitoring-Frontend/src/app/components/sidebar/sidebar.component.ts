import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MonitoringService } from '../../services/monitoring.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col z-[100] animate-fade-in">
      <!-- Header / Logo -->
      <div class="h-20 flex items-center px-8 border-b border-slate-50 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-200">
            M
          </div>
          <div>
            <h1 class="text-sm font-bold text-slate-900 leading-none tracking-tight">MONITORING</h1>
            <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Intranet Platform</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8">
        
        <!-- Action Principal -->
        <button
          (click)="service.montrerFormulaire.set(true)"
          class="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-100 group"
        >
          <span class="text-xl font-light group-hover:rotate-90 transition-transform duration-300">+</span>
          <span class="text-sm font-bold">Nouveau Client</span>
        </button>

        <!-- Navigation -->
        <div class="space-y-2 pt-4 border-t border-slate-50">
          <label class="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu</label>
          <nav class="flex flex-col gap-1">
            <a routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-600" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
               Tableau de Bord
            </a>
            <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-300 cursor-not-allowed">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
               Alertes
            </a>
          </nav>
        </div>
      </div>

      <!-- Footer / Refresh -->
      <div class="p-6 border-t border-slate-50 bg-slate-50/30">
        <button
          (click)="service.chargerServeurs()"
          [disabled]="service.estEnChargement()"
          class="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-900 transition-all disabled:opacity-50 group"
        >
          <div class="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              [class.animate-spin]="service.estEnChargement()"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            <span class="text-[11px] font-bold uppercase tracking-widest">{{ service.estEnChargement() ? 'En Cours...' : 'Actualiser' }}</span>
          </div>
          <span class="text-[9px] font-mono text-slate-400">v2.0.4</span>
        </button>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
  service = inject(MonitoringService);
}
