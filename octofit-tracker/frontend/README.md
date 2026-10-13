# OctoFit Tracker frontend

## API configuration

The frontend reads `VITE_CODESPACE_NAME` at build/start time to create the Codespaces API URL:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Define it in `octofit-tracker/frontend/.env.local` when running in Codespaces. Restart the Vite dev server after changing the value. The API URL will be `https://<codespace-name>-8000.app.github.dev`.

When `VITE_CODESPACE_NAME` is unset, the frontend falls back to `http://localhost:8000`.

Only put non-secret configuration in `VITE_*` variables because Vite exposes them in the client bundle.

## Development

```bash
npm run dev
```

The API should be available on port `8000`.
