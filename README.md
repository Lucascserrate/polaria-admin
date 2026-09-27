# polaria-admin

Dashboard interno de Polaria. Ver `AGENTS.md`.

```bash
cp .env.example .env.local   # y completar
npm install
npm run dev                  # http://localhost:3002
```

La API tiene que tener este origen en `ADMIN_CLIENT_BASE_URL` para que CORS lo
deje pasar con credenciales.
