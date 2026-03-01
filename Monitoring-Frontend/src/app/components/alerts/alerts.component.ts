import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringService } from '../../services/monitoring.service';
import { GlobalIncident } from '../../models/monitoring.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="alerts-container p-4 md:p-10 max-w-[1200px] mx-auto space-y-8 bg-bg min-h-screen text-text">
      
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text mb-2">Centre d'Alertes</h1>
          <p class="text-text-muted text-sm max-w-md">
            Historique chronologique de tous les incidents détectés sur votre infrastructure.
          </p>
        </div>

        <div class="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl shadow-sm">
           <span class="w-2 h-2 rounded-full bg-rose-500"></span>
           <span class="text-sm font-bold text-text tabular-nums">{{ service.alertesActivesCompte() }}</span>
           <span class="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Incidents Actifs</span>
        </div>
      </header>

      <!-- Filter Tabs -->
      <div class="flex items-center p-1 bg-surface border border-border rounded-xl w-fit">
        <button 
          (click)="filter.set('all')"
          class="px-6 py-2 rounded-lg text-xs font-bold"
          [class]="filter() === 'all' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text'"
        >
          Tous les Incidents
        </button>
        <button 
          (click)="filter.set('active')"
          class="px-6 py-2 rounded-lg text-xs font-bold"
          [class]="filter() === 'active' ? 'bg-rose-500 text-white shadow-md' : 'text-text-muted hover:text-text'"
        >
          En Cours
        </button>
      </div>

      <!-- Incidents List -->
      <div class="space-y-4">
        <div 
          *ngFor="let incident of filteredIncidents()"
          class="premium-card p-6 bg-surface border border-border rounded-2xl group"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-start gap-5">
              <!-- Icon Status -->
              <div 
                class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                [class]="incident.resoluLe ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'"
              >
                <svg *ngIf="!incident.resoluLe" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                <svg *ngIf="incident.resoluLe" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>

              <!-- Content -->
              <div class="space-y-1">
                <div class="flex items-center gap-3">
                  <h3 class="font-bold text-lg text-text leading-none tracking-tight">
                    {{ incident.raison || 'Incident non spécifié' }}
                  </h3>
                  <span 
                    class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border"
                    [class]="incident.resoluLe ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'"
                  >
                    {{ incident.resoluLe ? 'Résolu' : 'En Cours' }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <p class="text-[11px] font-bold text-primary uppercase tracking-widest">
                    Serveur :
                  </p>
                  <a 
                    [routerLink]="['/serveur', incident.serveurId]"
                    class="text-[11px] font-bold text-text-muted hover:text-primary underline decoration-dotted offset-2"
                  >
                    {{ incident.serverNom }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Timestamps -->
            <div class="flex flex-col md:text-right gap-1 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8 min-w-[180px]">
              <div class="flex items-center md:justify-end gap-2">
                <span class="text-[10px] font-black text-text-muted uppercase tracking-tighter">Début :</span>
                <span class="text-sm font-bold text-text tabular-nums">{{ incident.debutLe | date: 'dd MMM, HH:mm:ss' }}</span>
              </div>
              <div class="flex items-center md:justify-end gap-2" *ngIf="incident.resoluLe">
                <span class="text-[10px] font-black text-text-muted uppercase tracking-tighter">Fin :</span>
                <span class="text-sm font-bold text-emerald-500 tabular-nums">{{ incident.resoluLe | date: 'dd MMM, HH:mm:ss' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty States -->
        <div 
          *ngIf="filteredIncidents().length === 0"
          class="py-32 text-center bg-surface border-2 border-dashed border-border rounded-3xl"
        >
           <div class="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
           </div>
           <h3 class="text-xl font-bold text-text mb-2">
             {{ filter() === 'active' ? 'Aucune alerte en cours' : 'Historique vide' }}
           </h3>
           <p class="text-text-muted text-sm">
             Votre infrastructure semble fonctionner parfaitement.
           </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AlertsComponent implements OnInit {
  service = inject(MonitoringService);
  allIncidents = signal<any[]>([]);
  filter = signal<'all' | 'active'>('all');

  filteredIncidents = () => {
    const list = this.allIncidents();
    if (this.filter() === 'active') {
      return list.filter(i => !i.resoluLe);
    }
    return list;
  };

  ngOnInit() {
    this.service.getGlobalIncidents().subscribe(data => {
      // Transformation des noms de propriétés pour correspondre au DTO
      this.allIncidents.set(data.map(i => ({
        ...i,
        serverNom: (i as any).serveurNom // Adaptation si nécessaire
      })));
    });
  }
}
