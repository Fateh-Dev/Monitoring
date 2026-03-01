import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Serveur,
  Verification,
  Incident,
  CreateServeur,
  GlobalIncident,
} from '../models/monitoring.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/servers'; // Application configurée sur le port 5000

  // Signaux pour l'état réactif
  serveurs = signal<Serveur[]>([]);
  estEnChargement = signal<boolean>(false);
  montrerFormulaire = signal<boolean>(false);
  sidebarCollapsed = signal<boolean>(false);

  // Nouveaux signaux pour le thème et la vue
  modeSombre = signal<boolean>(localStorage.getItem('theme') === 'dark');
  dashboardView = signal<'list' | 'grid'>(
    (localStorage.getItem('view') as 'list' | 'grid') || 'list',
  );
  serveurAModifier = signal<Serveur | null>(null);

  constructor() {
    // Effet pour le mode sombre
    effect(() => {
      const isDark = this.modeSombre();
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Effet pour la vue du dashboard
    effect(() => {
      localStorage.setItem('view', this.dashboardView());
    });
  }

  // Filtres globaux
  recherche = signal('');
  filtreStatut = signal<'tous' | 'online' | 'offline'>('tous');

  filteredServeurs = computed(() => {
    const all = this.serveurs();
    const query = this.recherche().toLowerCase();
    const status = this.filtreStatut();

    return all.filter((s) => {
      const matchQuery =
        s.nom.toLowerCase().includes(query) ||
        s.adresseIp.toLowerCase().includes(query);

      // Logique de statut robuste (0 = Sain/Online)
      const isOnline = Number(s.dernierStatut) === 0;

      const matchStatus =
        status === 'tous' ||
        (status === 'online' && isOnline) ||
        (status === 'offline' && !isOnline);

      return matchQuery && matchStatus;
    });
  });

  alertesActivesCompte = computed(() => {
    return this.serveurs().reduce((acc, s) => {
      // Un serveur est "en panne" si son dernier statut n'est pas 0 (Sain)
      const isOnline = Number(s.dernierStatut) === 0;
      return acc + (isOnline ? 0 : 1);
    }, 0);
  });

  hasActiveFilters = computed(() => {
    return this.recherche() !== '' || this.filtreStatut() !== 'tous';
  });

  chargerServeurs() {
    this.estEnChargement.set(true);
    this.http.get<Serveur[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.serveurs.set(data);
        this.estEnChargement.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des serveurs', err);
        this.estEnChargement.set(false);
      },
    });
  }

  ajouterServeur(serveur: CreateServeur): Observable<Serveur> {
    return this.http
      .post<Serveur>(this.apiUrl, serveur)
      .pipe(tap(() => this.chargerServeurs()));
  }

  modifierServeur(id: string, serveur: CreateServeur): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, serveur).pipe(
      tap(() => {
        this.chargerServeurs();
        this.serveurAModifier.set(null);
      }),
    );
  }

  supprimerServeur(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.chargerServeurs()));
  }

  basculerActivation(id: string, estActif: boolean): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${id}/toggle`, { estActif })
      .pipe(tap(() => this.chargerServeurs()));
  }

  getHistorique(id: string): Observable<Verification[]> {
    return this.http.get<Verification[]>(`${this.apiUrl}/${id}/history`);
  }

  getIncidents(id: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/${id}/incidents`);
  }

  getGlobalIncidents(): Observable<GlobalIncident[]> {
    return this.http.get<GlobalIncident[]>(`${this.apiUrl}/incidents`);
  }

  reinitialiserFiltres() {
    this.recherche.set('');
    this.filtreStatut.set('tous');
  }
}
