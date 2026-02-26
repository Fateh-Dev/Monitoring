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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ServerFormComponent],
  template: `
    <div
      class="dashboard animate-fade-in p-4 md:p-10 max-w-[1600px] mx-auto space-y-8 bg-[#fafafa] min-h-screen text-slate-900"
    >
      <app-server-form
        *ngIf="service.montrerFormulaire()"
        (ajouter)="onAjouterServeur($event)"
        (annuler)="service.montrerFormulaire.set(false)"
      ></app-server-form>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="relative overflow-hidden bg-white border border-slate-200 p-6 rounded-2xl shadow-sm group transition-all hover:shadow-md"
        >
          <div class="flex justify-between items-start">
            <div>
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
              >
                Clients Totaux
              </p>
              <h2 class="text-4xl font-bold text-slate-900">
                {{ totalServeurs() }}
              </h2>
            </div>
            <div
              class="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="20" height="14" x="2" y="3" rx="2" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="relative overflow-hidden bg-white border border-slate-200 p-6 rounded-2xl shadow-sm group transition-all hover:shadow-md"
        >
          <div class="flex justify-between items-start">
            <div>
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
              >
                Services Sains
              </p>
              <h2 class="text-4xl font-bold text-emerald-600">
                {{ serveursSains() }}
              </h2>
            </div>
            <div
              class="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="relative overflow-hidden bg-white border border-slate-200 p-6 rounded-2xl shadow-sm group transition-all hover:shadow-md"
        >
          <div class="flex justify-between items-start">
            <div>
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
              >
                Incidents Critiques
              </p>
              <h2 class="text-4xl font-bold text-rose-600">
                {{ serveursEnPanne() }}
              </h2>
            </div>
            <div
              class="p-3 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div class="flex flex-wrap justify-between items-center gap-6 px-1">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-bold text-slate-800">
              Infrastructure Active
            </h2>
            <!-- Indicateur de Filtres Actifs -->
            <div *ngIf="service.hasActiveFilters()" class="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 animate-fade-in">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Filtres Actifs</span>
              <button 
                (click)="service.reinitialiserFiltres()"
                class="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase underline decoration-dotted offset-2 ml-1"
              >
                Effacer
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 flex-1 justify-end">
            <!-- Recherche Dash -->
            <div class="relative w-full max-w-sm">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input
                type="text"
                [value]="service.recherche()"
                (input)="service.recherche.set($any($event.target).value)"
                placeholder="Rechercher par nom ou IP..."
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
              />
            </div>

            <!-- Filtres Statut Dash -->
            <div class="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                (click)="service.filtreStatut.set('tous')"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                [class]="service.filtreStatut() === 'tous' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'"
              >
                Tous
              </button>
              <button
                (click)="service.filtreStatut.set('online')"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                [class]="service.filtreStatut() === 'online' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-emerald-600'"
              >
                En Ligne
              </button>
              <button
                (click)="service.filtreStatut.set('offline')"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                [class]="service.filtreStatut() === 'offline' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-rose-600'"
              >
                Hors Ligne
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div
            *ngFor="let s of service.filteredServeurs()"
            class="group relative bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap md:flex-nowrap items-center gap-6 transition-all hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 animate-slide-up"
          >
            <div
              class="w-1.5 h-12 rounded-full transition-colors"
              [class.bg-emerald-500]="estEnLigne(s)"
              [class.bg-rose-500]="!estEnLigne(s)"
            ></div>

            <div class="flex-1 min-w-[200px]">
              <div class="flex items-center gap-3 mb-1">
                <h3 class="font-bold text-slate-900 tracking-tight">
                  {{ s.nom }}
                </h3>
                <span
                  class="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                  [ngClass]="
                    estEnLigne(s)
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-rose-50 border-rose-100 text-rose-700'
                  "
                >
                  {{ estEnLigne(s) ? 'Online' : 'Offline' }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[11px] font-mono text-slate-400">{{
                  s.adresseIp
                }}</span>
                <span class="text-[11px] text-slate-300">/</span>
                <span
                  class="text-[11px] text-slate-400 truncate max-w-[150px]"
                  >{{ s.urlSante }}</span
                >
              </div>
            </div>

            <div
              class="hidden lg:grid grid-cols-2 gap-8 px-8 border-l border-slate-100"
            >
              <div class="space-y-2">
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter"
                >
                  Disponibilité
                </p>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-bold tabular-nums"
                    >{{ s.pourcentageUptime | number: '1.1-1' }}%</span
                  >
                  <div
                    class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-emerald-500 rounded-full"
                      [style.width.%]="s.pourcentageUptime"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="space-y-1">
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter"
                >
                  Latence
                </p>
                <div class="flex items-baseline gap-1">
                  <span
                    class="text-sm font-bold tabular-nums"
                    [ngClass]="
                      s.dernierTempsReponseMs > 500
                        ? 'text-rose-600'
                        : s.dernierTempsReponseMs > 200
                          ? 'text-amber-600'
                          : 'text-slate-900'
                    "
                  >
                    {{ s.dernierTempsReponseMs }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-400">ms</span>
                </div>
              </div>
            </div>

            <div class="hidden md:block text-right min-w-[100px]">
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1"
              >
                Dernier Check
              </p>
              <p class="text-xs font-semibold text-slate-600 font-mono">
                {{ s.derniereVerification | date: 'HH:mm:ss' }}
              </p>
            </div>

            <button
              (click)="voirDetails(s.id)"
              class="ml-auto w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
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
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- État vide : Aucun client du tout -->
        <div
          *ngIf="service.serveurs().length === 0 && !service.estEnChargement()"
          class="py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl mt-10"
        >
          <div
            class="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">
            Aucun client supervisé
          </h3>
          <p class="text-slate-500 text-sm max-w-xs mx-auto">
            Commencez par ajouter votre premier serveur pour activer le
            monitoring en temps réel.
          </p>
        </div>

        <!-- État vide : Aucun résultat avec filtres -->
        <div
          *ngIf="service.serveurs().length > 0 && service.filteredServeurs().length === 0"
          class="py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl mt-10"
        >
          <div class="w-16 h-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p class="text-slate-500 text-sm max-w-xs mx-auto">
            Il n'y a aucun client correspondant à vos filtres actuels.
          </p>
          <button 
            (click)="service.reinitialiserFiltres()"
            class="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 active:scale-95"
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
}
