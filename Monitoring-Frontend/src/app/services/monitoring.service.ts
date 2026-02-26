import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Serveur,
  Verification,
  Incident,
  CreateServeur,
} from '../models/monitoring.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5251/api/servers'; // Port configuré dans launchSettings.json

  // Signaux pour l'état réactif
  serveurs = signal<Serveur[]>([]);
  estEnChargement = signal<boolean>(false);
  montrerFormulaire = signal<boolean>(false);

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

  getHistorique(id: string): Observable<Verification[]> {
    return this.http.get<Verification[]>(`${this.apiUrl}/${id}/history`);
  }

  getIncidents(id: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/${id}/incidents`);
  }

  reinitialiserFiltres() {
    this.recherche.set('');
    this.filtreStatut.set('tous');
  }
}
