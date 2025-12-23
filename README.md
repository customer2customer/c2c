# C2C Marketplace (Angular 21 + Firebase)

This repository contains the Angular 21 implementation scaffold for the Community-to-Community (C2C) marketplace and the CI/CD configuration to deploy it to Firebase Hosting. The app follows a public-first browsing philosophy with passwordless email authentication for transactions.

## Project structure
- `src/app/features/home`: Public landing page module.
- `src/app/features/products`: Public product list and detail modules backed by mock data and filter helpers.
- `src/app/features/auth`: Email OTP login, verification, and signup flow stubs.
- `src/app/features/seller`: Protected seller dashboard with create/edit listing forms.
- `src/app/core`: Auth guard/service placeholders, Firebase config stub, and mock data loader.
- `src/app/shared`: Domain models and reusable product card component.

The Angular production build emits to `dist/c2c/browser`, which is referenced by the Firebase Hosting configuration.

## Local development
1. Install dependencies (Node 20+):
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm start
   ```
   Open `http://localhost:4200/` to view the app.
3. Run unit tests (when present):
   ```bash
   npm test
   ```
4. Build for production:
   ```bash
   npm run build -- --configuration=production
   ```

## Firebase Hosting deployment via GitHub Actions
The workflow at `.github/workflows/firebase-hosting.yml` builds the Angular app and deploys it to Firebase Hosting.

### Prerequisites
- Firebase project created with Hosting enabled.
- GitHub secret `FIREBASE_SERVICE_ACCOUNT` containing a service account JSON.
- Repository variable `FIREBASE_PROJECT_ID` set to your Firebase project ID.
- Default Angular build output at `dist/c2c/browser`.

### Workflow overview
1. Triggered on pushes to `main` or manually via `workflow_dispatch`.
2. Installs Node.js 20 and project dependencies with `npm ci`.
3. Runs lint/tests when scripts exist (currently stubs).
4. Builds the production bundle and uploads `dist/**` as an artifact.
5. Deploys to Firebase Hosting using the provided service account and project ID.

Local hosting preview:
```bash
npm install -g firebase-tools
firebase serve --only hosting
```

## Mock data
The app includes two preconfigured sellers (vegetables and dairy) plus 25 sample products in `src/app/core/data/mock-data.ts` to exercise product listing and seller dashboards without a backend. Replace the placeholder Firebase config in `src/app/core/firebase/firebase.config.ts` with your project settings when wiring up the real services.
