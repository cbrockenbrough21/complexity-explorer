# Deployment (Vercel)

This project is a static Vite + React site and deploys directly to Vercel.

## First-time deployment

1. Push the repository to GitHub (or GitLab/Bitbucket).
2. Go to Vercel and click `Add New...` -> `Project`.
3. Import this repository.
4. Keep the default framework preset as `Vite`.
5. Confirm build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
6. Click `Deploy`.

## Redeploy after changes

1. Commit and push your changes to the connected branch (typically `main`).
2. Vercel automatically starts a new deployment for each push.
3. Optional manual redeploy:
   - Open the project in Vercel
   - Go to `Deployments`
   - Select a deployment and click `Redeploy`

## Environment variables

No environment variables are currently required.
