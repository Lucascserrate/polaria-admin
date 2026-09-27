import { axiosInstance } from '@/lib/axios';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

/** El admin en sesión. La sesión es la cookie `adminToken` de la API. */
export interface Session {
	id: string;
	email: string;
	name: string | null;
	role: AdminRole;
}

export const getSession = async (): Promise<Session> => {
	const { data } = await axiosInstance.get<Session>('/admin/auth/me');
	return data;
};

export const logout = async (): Promise<void> => {
	await axiosInstance.post('/admin/auth/logout');
};
