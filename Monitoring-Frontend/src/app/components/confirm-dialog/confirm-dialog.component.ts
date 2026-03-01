import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        class="bg-surface border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div class="p-8 text-center">
          <div 
            class="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          
          <h2 class="text-2xl font-bold text-text mb-2">{{ title }}</h2>
          <p class="text-text-muted text-sm">{{ message }}</p>
        </div>

        <div class="flex border-t border-border">
          <button 
            (click)="onCancel()"
            class="flex-1 py-4 text-sm font-bold text-text-muted hover:bg-bg"
          >
            {{ cancelText }}
          </button>
          <button 
            (click)="onConfirm()"
            class="flex-1 py-4 text-sm font-bold text-rose-500 hover:bg-rose-500/5 border-l border-border"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Confirmer la suppression';
  @Input() message: string = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.';
  @Input() confirmText: string = 'Supprimer';
  @Input() cancelText: string = 'Annuler';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
