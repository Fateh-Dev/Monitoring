import { Component, EventEmitter, Output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateServeur } from '../../models/monitoring.model';
import { MonitoringService } from '../../services/monitoring.service';

@Component({
  selector: 'app-server-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
      (click)="annuler.emit()"
    >
      <div
        class="premium-card w-full max-w-2xl p-8 bg-surface/90"
        (click)="$event.stopPropagation()"
      >
        <header class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold tracking-tight text-text">
            {{
              service.serveurAModifier()
                ? 'Modifier le Client'
                : 'Nouveau Client'
            }}
          </h2>
          <button
            class="text-text-muted hover:text-text text-2xl leading-none p-2"
            (click)="annuler.emit()"
          >
            ×
          </button>
        </header>

        <form
          [formGroup]="serverForm"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-6"
        >
          <div class="flex flex-col gap-1.5">
            <label
              for="nom"
              class="text-[11px] font-bold uppercase tracking-widest text-text-muted"
              >Nom du Serveur</label
            >
            <input
              id="nom"
              type="text"
              formControlName="nom"
              placeholder="ex: Serveur Production Alpha"
              class="w-full px-4 py-3 bg-bg/50 border border-border rounded-premium text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-muted/40"
            />
            <div
              class="text-[10px] font-bold text-error mt-1"
              *ngIf="
                serverForm.get('nom')?.invalid && serverForm.get('nom')?.touched
              "
            >
              Le nom est requis pour identifier le client.
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              for="adresseIp"
              class="text-[11px] font-bold uppercase tracking-widest text-text-muted"
              >Adresse IP / Hostname</label
            >
            <input
              id="adresseIp"
              type="text"
              formControlName="adresseIp"
              placeholder="ex: 10.0.0.1 ou srv-prod.local"
              class="w-full px-4 py-3 bg-bg/50 border border-border rounded-premium text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-muted/40"
            />
            <div
              class="text-[10px] font-bold text-error mt-1"
              *ngIf="
                serverForm.get('adresseIp')?.invalid &&
                serverForm.get('adresseIp')?.touched
              "
            >
              L'adresse IP ou le nom du client est requis.
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              for="urlSante"
              class="text-[11px] font-bold uppercase tracking-widest text-text-muted"
              >Point de Terminaison (Health URL)</label
            >
            <input
              id="urlSante"
              type="text"
              formControlName="urlSante"
              placeholder="ex: http://10.0.0.1:5000/api/health"
              class="w-full px-4 py-3 bg-bg/50 border border-border rounded-premium text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-muted/40"
            />
            <div
              class="text-[10px] font-bold text-error mt-1"
              *ngIf="
                serverForm.get('urlSante')?.invalid &&
                serverForm.get('urlSante')?.touched
              "
            >
              Une URL valide (http/https) est requise pour le monitoring.
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              for="apiKey"
              class="text-[11px] font-bold uppercase tracking-widest text-text-muted"
              >Clé API de Sécurité (Optionnel)</label
            >
            <input
              id="apiKey"
              type="text"
              formControlName="apiKey"
              placeholder="X-API-KEY pour l'authentification"
              class="w-full px-4 py-3 bg-bg/50 border border-border rounded-premium text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-muted/40"
            />
          </div>

          <div
            class="flex items-center justify-between p-4 bg-bg/30 border border-border rounded-premium group hover:border-primary/20"
          >
            <div class="flex flex-col gap-1">
              <span
                class="text-[11px] font-bold uppercase tracking-widest text-text"
                >Monitoring Actif</span
              >
              <span class="text-[10px] text-text-muted"
                >Désactiver pour mettre en maintenance</span
              >
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                formControlName="estActif"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 peer-checked:bg-emerald-500"
              ></div>
            </label>
          </div>

          <div class="flex justify-end gap-3 mt-4 pt-6 border-t border-border">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="annuler.emit()"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="btn btn-primary shadow-lg shadow-primary/20"
              [disabled]="serverForm.invalid"
            >
              {{
                service.serveurAModifier()
                  ? 'Enregistrer les Modifications'
                  : 'Ajouter le Client'
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class ServerFormComponent {
  private fb = inject(FormBuilder);
  public service = inject(MonitoringService);

  @Output() ajouter = new EventEmitter<CreateServeur>();
  @Output() modifier = new EventEmitter<{
    id: string;
    serveur: CreateServeur;
  }>();
  @Output() annuler = new EventEmitter<void>();

  serverForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    adresseIp: ['', Validators.required],
    urlSante: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
    apiKey: [''],
    estActif: [true],
  });

  constructor() {
    effect(() => {
      const s = this.service.serveurAModifier();
      if (s) {
        this.serverForm.patchValue({
          nom: s.nom,
          adresseIp: s.adresseIp,
          urlSante: s.urlSante,
          apiKey: s.apiKey || '',
          estActif: s.estActif !== false,
        });
      } else {
        this.serverForm.reset();
      }
    });
  }

  onSubmit() {
    if (this.serverForm.valid) {
      const s = this.service.serveurAModifier();
      if (s) {
        this.modifier.emit({ id: s.id, serveur: this.serverForm.value });
      } else {
        this.ajouter.emit(this.serverForm.value);
      }
    }
  }
}
