import {
  Component,
  OnInit,
  inject,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MonitoringService } from '../../services/monitoring.service';
import { Verification, Incident } from '../../models/monitoring.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-server-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="detail-container animate-fade-in p-6 max-w-6xl mx-auto space-y-8"
    >
      <header class="flex items-center gap-4 mb-8">
        <a
          routerLink="/dashboard"
          class="text-sm font-bold text-text-muted hover:text-primary transition-colors flex items-center gap-2"
        >
          <span class="text-lg">←</span> Retour au Dashboard
        </a>
        <h1
          class="text-2xl font-extrabold tracking-tight text-text border-l-2 border-border pl-4"
        >
          Détails du Client
        </h1>
      </header>

      <div class="premium-card p-8 bg-surface/80 backdrop-blur-md">
        <h3
          class="text-xs uppercase tracking-widest font-black text-text-muted mb-6"
        >
          Historique des Temps de Réponse (ms)
        </h3>
        <div class="h-[300px] w-full relative">
          <canvas #respChart></canvas>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          class="premium-card p-8 flex flex-col h-full bg-surface/80 backdrop-blur-md"
        >
          <h3
            class="text-xs uppercase tracking-widest font-black text-text-muted mb-6"
          >
            Incidents Récents
          </h3>
          <ul class="divide-y divide-border overflow-y-auto max-h-[400px] pr-2">
            <li
              *ngFor="let incident of incidents()"
              class="py-4 flex justify-between items-center group"
            >
              <div class="flex flex-col">
                <span class="font-bold text-sm text-text">{{
                  incident.raison
                }}</span>
                <span class="text-[11px] font-medium text-text-muted/60">{{
                  incident.debutLe | date: 'dd/MM HH:mm'
                }}</span>
              </div>
              <span
                class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                [ngClass]="
                  incident.resoluLe
                    ? 'bg-success/10 text-success'
                    : 'bg-error/10 text-error animate-pulse'
                "
              >
                {{
                  incident.resoluLe
                    ? 'Résolu à ' + (incident.resoluLe | date: 'HH:mm')
                    : 'En cours'
                }}
              </span>
            </li>
            <li
              *ngIf="incidents().length === 0"
              class="py-12 text-center text-text-muted/50 italic font-medium"
            >
              Aucun incident détecté.
            </li>
          </ul>
        </div>

        <div
          class="premium-card p-8 flex flex-col h-full bg-surface/80 backdrop-blur-md"
        >
          <h3
            class="text-xs uppercase tracking-widest font-black text-text-muted mb-6"
          >
            Dernières Vérifications
          </h3>
          <div class="overflow-y-auto max-h-[400px] pr-2">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="text-[10px] font-black uppercase tracking-widest text-text-muted/40 pb-4"
                >
                  <th class="pb-3 pr-4 font-black">Heure</th>
                  <th class="pb-3 pr-4 font-black">Temps</th>
                  <th class="pb-3 font-black">Détails</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  *ngFor="let check of verifications()"
                  class="text-sm hover:bg-bg/50 transition-colors"
                >
                  <td class="py-3 pr-4 font-bold tabular-nums text-text">
                    {{ check.mesureLe | date: 'HH:mm:ss' }}
                  </td>
                  <td class="py-3 pr-4">
                    <span class="font-black text-primary tabular-nums">{{
                      check.tempsReponseMs.toFixed(0)
                    }}</span>
                    <span class="text-[10px] text-text-muted/40 ml-1">ms</span>
                  </td>
                  <td class="py-3 font-medium text-text-muted text-xs">
                    {{ check.details }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ServerDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('respChart') respChart!: ElementRef;

  private route = inject(ActivatedRoute);
  private service = inject(MonitoringService);

  verifications = signal<Verification[]>([]);
  incidents = signal<Incident[]>([]);
  private chart: any;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getHistorique(id).subscribe((data) => {
        this.verifications.set(data);
        this.updateChart(data);
      });
      this.service
        .getIncidents(id)
        .subscribe((data) => this.incidents.set(data));
    }
  }

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    this.chart = new Chart(this.respChart.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temps de réponse (ms)',
            data: [],
            borderColor: '#0366d6',
            backgroundColor: 'rgba(3, 102, 214, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: '#f6f8fa' } },
          x: { grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  private updateChart(data: Verification[]) {
    if (!this.chart) return;
    const sorted = [...data].reverse();
    this.chart.data.labels = sorted.map((v) =>
      new Date(v.mesureLe).toLocaleTimeString(),
    );
    this.chart.data.datasets[0].data = sorted.map((v) => v.tempsReponseMs);
    this.chart.update();
  }
}
