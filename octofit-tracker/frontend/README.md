# OctoFit Tracker frontend

## API configuration

Set `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` when running in Codespaces:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Restart the Vite dev server after changing the value. The API URL will be `https://<codespace-name>-8000.app.github.dev`. If the variable is unset, the app can infer the Codespace name from the forwarded port 5173 hostname; outside Codespaces it falls back to `http://localhost:8000`.

When `VITE_CODESPACE_NAME` is unset, the frontend falls back to `http://localhost:8000`.

Only put non-secret configuration in `VITE_*` variables because Vite exposes them in the client bundle.

## Development

```bash
npm run dev
```

The API should be available on port `8000`.
