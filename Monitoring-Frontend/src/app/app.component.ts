import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-layout">
      <header class="main-header">
        <div class="container header-content">
          <div class="brand">
            <div class="logo-icon"></div>
            <span class="logo-text">MONITORING<span>INTRANET</span></span>
          </div>
          <nav class="nav-links">
            <a href="/" class="nav-link active">Tableau de Bord</a>
            <a href="#" class="nav-link">Alertes</a>
            <a href="#" class="nav-link">Rapports</a>
          </nav>
        </div>
      </header>

      <main class="container">
        <router-outlet></router-outlet>
      </main>

      <footer class="main-footer">
        <div class="container footer-content">
          <p>&copy; 2026 Plateforme de Supervision - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
      }
      .main-header {
        background: hsl(var(--p-surface));
        border-bottom: 1px solid hsl(var(--p-border));
        padding: 1rem 0;
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .logo-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(
          135deg,
          hsl(var(--p-primary)),
          hsl(var(--p-primary-hover))
        );
        border-radius: 4px;
      }
      .logo-text {
        font-weight: 800;
        font-size: 1.1rem;
        letter-spacing: -0.02em;
        color: hsl(var(--p-text));
      }
      .logo-text span {
        color: hsl(var(--p-primary));
        font-weight: 500;
        margin-left: 2px;
      }
      .nav-links {
        display: flex;
        gap: 2rem;
      }
      .nav-link {
        text-decoration: none;
        color: hsl(var(--p-text-muted));
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.2s;
      }
      .nav-link:hover,
      .nav-link.active {
        color: hsl(var(--p-primary));
      }
      main {
        flex: 1;
        padding: 2.5rem 0;
      }
      .main-footer {
        padding: 2rem 0;
        border-top: 1px solid hsl(var(--p-border));
        background: hsl(var(--p-surface));
      }
      .footer-content p {
        font-size: 0.75rem;
        color: hsl(var(--p-text-muted));
        text-align: center;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Monitoring-Frontend';
}
