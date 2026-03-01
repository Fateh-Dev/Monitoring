import {
  Component,
  OnInit,
  inject,
  signal,
  effect,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringService } from '../../services/monitoring.service';
import {
  Serveur,
  StatutSante,
  CreateServeur,
} from '../../models/monitoring.model';
import { Router } from '@angular/router';
import { ServerFormComponent } from '../server-form/server-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ServerFormComponent, ConfirmDialogComponent],
  template: `
    <div
      class="dashboard p-4 md:p-10 max-w-[1600px] mx-auto space-y-8 bg-bg min-h-screen text-text"
    >
      <app-server-form
        *ngIf="service.montrerFormulaire()"
        (ajouter)="onAjouterServeur($event)"
        (modifier)="onModifierServeur($event)"
        (annuler)="onFermerFormulaire()"
      ></app-server-form>

      <app-confirm-dialog
        *ngIf="serveurASupprimer()"
        title="Supprimer le serveur ?"
        message="Cette action supprimera définitivement le serveur de la liste de monitoring ainsi que tout son historique."
        (confirm)="confirmerSuppression()"
        (cancel)="annulerSuppression()"
      ></app-confirm-dialog>

      <!-- Stats Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="relative overflow-hidden bg-surface border border-border p-6 rounded-2xl shadow-sm group hover:shadow-md"
        >
          <div class="flex justify-between items-start">
            <div>
              <p
                class="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1"
              >
                Clients Totaux
              </p>
              <h2 class="text-4xl font-bold text-text">
                {{ totalServeurs() }}
              </h2>
            </div>
            <div
              class="p-3 bg-bg rounded-xl text-text-muted group-hover:bg-primary group-hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </div>
          </div>
        </div>

        <div
          class="relative overflow-hidden bg-surface border border-border p-6 rounded-2xl shadow-sm group hover:shadow-md"
        >
          <div class="flex justify-between items-start">
            <div>
              <p
                class="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1"
              >
                Services Sains
              </p>
              <h2 class="text-4xl font-bold text-emerald-500">
                {{ serveursSains() }}
              </h2>
            </div>
            <div
              class="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
        </div>

        <div
          class="relative overflow-hidden bg-surface border border-border p-6 rounded-2xl shadow-sm group hover:shadow-md"
        >
          <div class="flex justify-between items-start">
            <div>
              <p
                class="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1"
              >
                Incidents Critiques
              </p>
              <h2 class="text-4xl font-bold text-rose-500">
                {{ serveursEnPanne() }}
              </h2>
            </div>
            <div
              class="p-3 bg-rose-500/10 rounded-xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Controls -->
      <section class="space-y-6">
        <div class="flex flex-wrap justify-between items-center gap-6 px-1">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-bold text-text">
              Infrastructure Active
            </h2>
            <!-- Indicateur de Filtres Actifs -->
            <div *ngIf="service.hasActiveFilters()" class="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span class="text-[10px] font-bold text-primary uppercase tracking-widest">Filtres Actifs</span>
              <button 
                (click)="service.reinitialiserFiltres()"
                class="text-[10px] font-bold text-text-muted hover:text-rose-500 uppercase underline decoration-dotted offset-2 ml-1"
              >
                Effacer
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 flex-1 justify-end">
            <!-- Actualiser Dash -->
            <button
              (click)="service.chargerServeurs()"
              [disabled]="service.estEnChargement()"
              class="flex items-center justify-center p-2.5 bg-surface border border-border rounded-xl text-text-muted hover:text-text disabled:opacity-50 group hover:border-text-muted/30"
              title="Actualiser"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                [class.animate-none]="service.estEnChargement()"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </button>

            <!-- Recherche Dash -->
            <div class="relative w-full max-w-sm">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input
                type="text"
                [value]="service.recherche()"
                (input)="service.recherche.set($any($event.target).value)"
                placeholder="Rechercher par nom ou IP..."
                class="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none text-text"
              />
            </div>

            <!-- View Toggle -->
            <div class="flex items-center p-1 bg-surface border border-border rounded-xl">
              <button 
                (click)="service.dashboardView.set('list')"
                class="p-2 rounded-lg"
                [class]="service.dashboardView() === 'list' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
              </button>
              <button 
                (click)="service.dashboardView.set('grid')"
                class="p-2 rounded-lg"
                [class]="service.dashboardView() === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </button>
            </div>

            <!-- Filtres Statut Dash -->
            <div class="flex items-center p-1 bg-surface border border-border rounded-xl">
              <button
                (click)="service.filtreStatut.set('tous')"
                class="px-4 py-1.5 rounded-lg text-xs font-bold"
                [class]="service.filtreStatut() === 'tous' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text'"
              >
                Tous
              </button>
              <button
                (click)="service.filtreStatut.set('online')"
                class="px-4 py-1.5 rounded-lg text-xs font-bold"
                [class]="service.filtreStatut() === 'online' ? 'bg-emerald-500/10 text-emerald-600' : 'text-text-muted hover:text-text'"
              >
                Online
              </button>
              <button
                (click)="service.filtreStatut.set('offline')"
                class="px-4 py-1.5 rounded-lg text-xs font-bold"
                [class]="service.filtreStatut() === 'offline' ? 'bg-rose-500/10 text-rose-600' : 'text-text-muted hover:text-text'"
              >
                Offline
              </button>
            </div>
          </div>
        </div>

        <!-- Clients Display -->
        <div 
          [class]="service.dashboardView() === 'list' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'"
        >
          <ng-container *ngFor="let s of service.filteredServeurs()">
            
            <!-- List Mode -->
            <div
              *ngIf="service.dashboardView() === 'list'"
              class="group relative bg-surface border border-border rounded-2xl p-4 flex flex-wrap md:flex-nowrap items-center gap-6 hover:border-text-muted/30 hover:shadow-lg hover:shadow-black/5"
            >
              <div
                class="w-1.5 h-12 rounded-full shrink-0"
                [class.bg-emerald-500]="estEnLigne(s)"
                [class.bg-rose-500]="!estEnLigne(s)"
              ></div>

              <div class="flex-1 min-w-[200px]">
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="font-bold text-text tracking-tight uppercase text-sm">
                    {{ s.nom }}
                  </h3>
                  <span
                    class="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                    [ngClass]="
                      estEnLigne(s)
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                    "
                  >
                    {{ estEnLigne(s) ? 'En Ligne' : 'Hors Ligne' }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-[11px] font-mono text-text-muted">{{ s.adresseIp }}</span>
                  <span class="text-[11px] text-border">/</span>
                  <span class="text-[11px] text-text-muted truncate max-w-[150px]">{{ s.urlSante }}</span>
                </div>
              </div>

              <!-- List Mode Stats -->
              <div class="hidden lg:grid grid-cols-2 gap-8 px-8 border-l border-border">
                <div class="space-y-2">
                  <p class="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Disponibilité</p>
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-bold tabular-nums">{{ s.pourcentageUptime | number: '1.1-1' }}%</span>
                    <div class="w-20 h-1.5 bg-bg rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" [style.width.%]="s.pourcentageUptime"></div>
                    </div>
                  </div>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Latence</p>
                  <div class="flex items-baseline gap-1">
                    <span class="text-sm font-bold tabular-nums" [ngClass]="s.dernierTempsReponseMs > 500 ? 'text-rose-500' : s.dernierTempsReponseMs > 200 ? 'text-amber-500' : 'text-text'">
                      {{ s.dernierTempsReponseMs }}
                    </span>
                    <span class="text-[10px] font-bold text-text-muted">ms</span>
                  </div>
                </div>
              </div>

                <button
                  (click)="toggleActif(s)"
                  class="w-10 h-10 flex items-center justify-center rounded-xl border border-border"
                  [class]="s.estActif ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-text-muted hover:bg-bg-accent'"
                  [title]="s.estActif ? 'Désactiver le monitoring' : 'Activer le monitoring'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="6"/><circle cx="12" cy="12" r="3" [attr.cx]="s.estActif ? '16' : '8'"/></svg>
                </button>
                <button
                  (click)="ouvrirEdition(s)"
                  class="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-muted hover:bg-bg-accent hover:text-primary"
                  title="Modifier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button
                  (click)="demanderSuppression(s.id)"
                  class="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-muted hover:bg-rose-500/10 hover:text-rose-500"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
                <button
                  (click)="voirDetails(s.id)"
                  class="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-muted hover:bg-primary hover:text-white hover:border-primary"
                  title="Détails"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>

            <!-- Grid Mode Card -->
            <div 
              *ngIf="service.dashboardView() === 'grid'"
              class="group bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5 hover:border-text-muted/30 hover:shadow-xl hover:shadow-black/5 relative overflow-hidden"
            >
              <!-- Card Header -->
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-text tracking-tight uppercase truncate mb-1" [title]="s.nom">
                    {{ s.nom }}
                  </h3>
                  <p class="text-[11px] font-mono text-text-muted">{{ s.adresseIp }}</p>
                </div>
                <div 
                  class="w-3 h-3 rounded-full shadow-sm shrink-0 mt-1"
                  [class.bg-emerald-500]="estEnLigne(s)"
                  [class.bg-rose-500]="!estEnLigne(s)"
                ></div>
              </div>

              <!-- Card Body / Stats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-bg rounded-xl border border-border/50">
                  <p class="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2">Disponibilité</p>
                  <div class="flex flex-col gap-1.5">
                    <span class="text-base font-bold tabular-nums">{{ s.pourcentageUptime | number: '1.1-1' }}%</span>
                    <div class="w-full h-1 bg-border/30 rounded-full overflow-hidden">
                       <div class="h-full bg-emerald-500 rounded-full" [style.width.%]="s.pourcentageUptime"></div>
                    </div>
                  </div>
                </div>
                <div class="p-3 bg-bg rounded-xl border border-border/50">
                  <p class="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2">Latence</p>
                  <div class="flex items-baseline gap-1 mt-1">
                    <span class="text-xl font-bold tabular-nums" [ngClass]="s.dernierTempsReponseMs > 500 ? 'text-rose-500' : s.dernierTempsReponseMs > 200 ? 'text-amber-500' : 'text-text'">
                      {{ s.dernierTempsReponseMs }}
                    </span>
                    <span class="text-[10px] font-bold text-text-muted">ms</span>
                  </div>
                </div>
              </div>

              <!-- Card Footer -->
              <div class="flex items-center justify-between mt-1 pt-1 border-t border-border/30">
                <div class="flex items-center gap-2">
                  <button 
                    (click)="toggleActif(s)"
                    class="p-1.5 rounded-lg hover:bg-bg"
                    [class]="s.estActif ? 'text-emerald-500' : 'text-text-muted'"
                    [title]="s.estActif ? 'Désactiver' : 'Activer'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="6"/><circle cx="12" cy="12" r="3" [attr.cx]="s.estActif ? '16' : '8'"/></svg>
                  </button>
                  <button 
                    (click)="ouvrirEdition(s)"
                    class="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-bg"
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                  <button 
                    (click)="demanderSuppression(s.id)"
                    class="p-1.5 text-text-muted hover:text-rose-500 rounded-lg hover:bg-bg"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                  <span class="text-[10px] text-text-muted font-medium">Vérifié à: {{ s.derniereVerification | date: 'HH:mm:ss' }}</span>
                </div>
                <button 
                  (click)="voirDetails(s.id)"
                  class="text-primary hover:text-primary-hover font-bold text-xs flex items-center gap-1 group/btn"
                >
                  Détails
                  <svg class="group-hover/btn:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

          </ng-container>
        </div>

        <!-- État vide : Aucun client du tout -->
        <div
          *ngIf="service.serveurs().length === 0 && !service.estEnChargement()"
          class="py-24 text-center bg-surface border-2 border-dashed border-border rounded-3xl mt-10 shadow-sm"
        >
          <div
            class="w-16 h-16 bg-bg text-text-muted rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
          </div>
          <h3 class="text-xl font-bold text-text mb-2">
            Aucun client supervisé
          </h3>
          <p class="text-text-muted text-sm max-w-xs mx-auto">
            Commencez par ajouter votre premier serveur pour activer le
            monitoring en temps réel.
          </p>
        </div>

        <!-- État vide : Aucun résultat avec filtres -->
        <div
          *ngIf="service.serveurs().length > 0 && service.filteredServeurs().length === 0"
          class="py-24 text-center bg-surface border-2 border-dashed border-border rounded-3xl mt-10 shadow-sm"
        >
          <div class="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 class="text-xl font-bold text-text mb-2">
            Aucun résultat trouvé
          </h3>
          <p class="text-text-muted text-sm max-w-xs mx-auto">
            Il n'y a aucun client correspondant à vos filtres actuels.
          </p>
          <button 
            (click)="service.reinitialiserFiltres()"
            class="mt-6 px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 active:scale-95"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  StatutSante = StatutSante;
  service = inject(MonitoringService);
  router = inject(Router);

  estEnLigne(s: any): boolean {
    if (!s) return false;
    const val = s.dernierStatut;
    // Gère 0, "0", StatutSante.Sain
    return val === 0 || val === '0' || val === 'Sain' || Number(val) === 0;
  }

  totalServeurs = signal(0);
  serveursSains = signal(0);
  serveursEnPanne = signal(0);

  constructor() {
    effect(
      () => {
        const all = this.service.serveurs();
        this.totalServeurs.set(all.length);
        this.serveursSains.set(all.filter((s) => this.estEnLigne(s)).length);
        this.serveursEnPanne.set(all.filter((s) => !this.estEnLigne(s)).length);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.service.chargerServeurs();
  }

  getStatutClass(statut: StatutSante): string {
    switch (statut) {
      case StatutSante.Sain:
        return 'statut-sain';
      case StatutSante.Lent:
        return 'statut-lent';
      case StatutSante.EnPanne:
        return 'statut-panne';
      default:
        return 'statut-injoignable';
    }
  }

  getStatutLabel(statut: StatutSante): string {
    switch (statut) {
      case StatutSante.Sain:
        return 'Sain';
      case StatutSante.Lent:
        return 'Lent';
      case StatutSante.EnPanne:
        return 'En Panne';
      default:
        return 'Injoignable';
    }
  }

  voirDetails(id: string) {
    this.router.navigate(['/serveur', id]);
  }

  onAjouterServeur(serveur: CreateServeur) {
    this.service.ajouterServeur(serveur).subscribe({
      next: () => {
        this.service.montrerFormulaire.set(false);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du serveur", err);
        alert("Erreur lors de l'ajout du serveur. Vérifiez les informations.");
      },
    });
  }

  onModifierServeur(event: { id: string; serveur: CreateServeur }) {
    this.service.modifierServeur(event.id, event.serveur).subscribe({
      next: () => {
        this.service.montrerFormulaire.set(false);
      },
      error: (err) => {
        console.error("Erreur lors de la modification du serveur", err);
        alert("Erreur lors de la modification du serveur.");
      },
    });
  }

  ouvrirEdition(s: Serveur) {
    this.service.serveurAModifier.set(s);
    this.service.montrerFormulaire.set(true);
  }

  onFermerFormulaire() {
    this.service.montrerFormulaire.set(false);
    this.service.serveurAModifier.set(null);
  }

  serveurASupprimer = signal<string | null>(null);

  demanderSuppression(id: string) {
    this.serveurASupprimer.set(id);
  }

  annulerSuppression() {
    this.serveurASupprimer.set(null);
  }

  confirmerSuppression() {
    const id = this.serveurASupprimer();
    if (id) {
      this.service.supprimerServeur(id).subscribe({
        next: () => this.serveurASupprimer.set(null),
        error: (err) => {
          console.error("Erreur suppression", err);
          alert("Erreur lors de la suppression.");
          this.serveurASupprimer.set(null);
        }
      });
    }
  }

  toggleActif(s: Serveur) {
    this.service.basculerActivation(s.id, !s.estActif).subscribe({
      error: (err) => {
        console.error("Erreur toggle", err);
        alert("Erreur lors de la modification du statut.");
      }
    });
  }
}
