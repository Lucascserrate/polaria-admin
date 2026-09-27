export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
export const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL;

/**
 * Una dirección del panel de los negocios (`app.polariahq.com`), donde se
 * entra y donde se suplanta.
 *
 * Tira si falta la variable: sin ella, `/agenda` se resolvería contra este
 * sitio y "Entrar al negocio" terminaría en un 404 del propio admin.
 */
export const panelUrl = (path: string): string => {
	if (!PANEL_URL) throw new Error('Falta NEXT_PUBLIC_PANEL_URL.');
	return new URL(path, PANEL_URL).toString();
};
