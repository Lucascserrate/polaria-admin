import { axiosInstance } from '@/lib/axios';

/**
 * La sesión con la que el navegador le habla a la API.
 *
 * Es la misma cookie del panel —vive en el dominio de la API, no en el de cada
 * sitio—, así que acá no hay login propio todavía: se entra por el panel y este
 * dashboard la reutiliza.
 */
export interface Session {
	name: string;
	businessName: string;
	email: string | null;
	/** Correo del admin que abrió una sesión de soporte, o `null`. */
	impersonatedBy: string | null;
}

export const getSession = async (): Promise<Session> => {
	const { data } = await axiosInstance.get<Session>('/auth/account');
	return data;
};

export const exitImpersonation = async (): Promise<void> => {
	await axiosInstance.post('/support/impersonate/exit');
};
