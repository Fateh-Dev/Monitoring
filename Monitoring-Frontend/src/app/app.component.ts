import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MonitoringService } from './services/monitoring.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>

      <main 
        class="main-content"
        [style.margin-left]="service.sidebarCollapsed() ? '5rem' : '18rem'"
      >
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        min-height: 100vh;
        background-color: #fafafa;
      }
      .main-content {
        flex: 1;
      }
      @media (max-width: 768px) {
        .main-content {
          margin-left: 0 !important;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'Monitoring-Frontend';
  service = inject(MonitoringService);
}
