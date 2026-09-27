<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Polaria — admin

El dashboard interno de Polaria: los negocios, y más adelante usuarios,
reservas y administradores. Reemplaza a `/super-admin/tenant-management` del
panel (`polaria/client`), de donde salió el módulo `modules/tenants`.

**Todo pasa en el navegador, y es a propósito.** La sesión es una cookie
host-only de la API (`api.polariahq.com`): un Server Component de este sitio no
la ve, así que las pantallas son Client Components que le hablan a la API con
`withCredentials`, igual que el panel. Es lo contrario de `polaria-explore`, y
no por descuido.

**La sesión es la del panel, por ahora.** No hay login propio: se entra por el
panel y este sitio reutiliza la cookie. El acceso lo decide `SuperAdminGuard`
en el backend.

**Suplantar deja este sitio sin servicio.** La cookie de soporte gana sobre la
propia en toda la API, así que mientras hay una sesión de soporte abierta, todo
acá responde 403. `DashboardShell` lo detecta y ofrece salir.

**Copias del panel.** `components/ui`, `MapView`, el selector de ubicación, los
rubros y el Embedded Signup de Meta están copiados de `polaria/client`. Son
repos distintos y no hay paquete compartido: un arreglo en uno no llega solo al
otro.

Estilo: `.prettierrc` con tabs y comillas simples, igual que el panel.
Formatear sólo lo que se tocó. Control de calidad: `npm run check`.
