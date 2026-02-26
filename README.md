# 🖥️ Plateforme de Supervision de Clients (Alpha V2)

Une solution de monitoring moderne et performante conçue pour surveiller l'état de santé et la télémétrie de vos serveurs et applications clientes en temps réel.

![Nouveau Design](https://via.placeholder.com/800x400.png?text=Plateforme+de+Supervision)

## ✨ Fonctionnalités Clés

- **Tableau de Bord Premium** : Interface ultra-moderne avec design épuré, sans ombres, et largeur optimisée (1600px).
- **Surveillance Temps Réel** : Suivi automatique de la disponibilité (uptime) et de la latence (ms).
- **Gestion des Clients** : Ajout et configuration facile de nouveaux hôtes à superviser.
- **Télémétrie Avancée** : Historique détaillé des temps de réponse et journalisation des incidents critiques.
- **Sécurité Intégrée** : Support de l'authentification par Clé API pour les endpoints de santé protégés.

## 🛠️ Stack Technique

### Backend (.NET 8)

- **ASP.NET Core Web API** : Cœur de l'application.
- **Entity Framework Core** : Gestion de la persistance des données.
- **Background Services** : Monitoring cyclique asynchrone pour vérifier la santé des clients.
- **PostgreSQL** : Base de données pour le stockage des métriques et historiques.

### Frontend (Angular 17)

- **Angular SDK** : Framework robuste pour une Single Page Application.
- **Tailwind CSS 3** : Design system utilitaire pour une esthétique premium et responsive.
- **Signals & RxJS** : Gestion d'état réactive et flux de données asynchrones performants.
- **Chart.js** : Visualisation graphique des métriques de performance.

## 🚀 Démarrage Rapide

### Prérequis

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/Fateh-Dev/Monitoring.git
   cd Monitoring
   ```

2. **Backend Setup**

   ```bash
   cd Monitoring.Backend/Monitoring.API
   dotnet restore
   # Mettez à jour la chaîne de connexion dans appsettings.json
   dotnet run
   ```

3. **Frontend Setup**
   ```bash
   cd ../../Monitoring-Frontend
   npm install
   npm start
   ```

## 📋 Nomenclature

Ce projet utilise le terme **"Client"** pour désigner tout serveur, hôte ou application cible faisant l'objet d'une supervision.

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---

Développé avec ❤️ par **Fateh**
