import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>

      <main class="main-content">
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
        margin-left: 18rem; /* matches w-72 */
      }
      @media (max-width: 768px) {
        .main-content {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'Monitoring-Frontend';
}
