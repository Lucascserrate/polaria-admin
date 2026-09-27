import { axiosInstance } from '@/lib/axios';
import type { AdminRole } from '@/services/session.service';

export interface Admin {
	id: string;
	email: string;
	name: string | null;
	role: AdminRole;
	isActive: boolean;
	lastLoginAt: string | null;
	createdAt: string;
}

export const getAdmins = async (): Promise<Admin[]> => {
	const { data } = await axiosInstance.get<Admin[]>('/admin/admins');
	return data;
};

export const createAdmin = async (input: {
	email: string;
	role: AdminRole;
}): Promise<Admin> => {
	const { data } = await axiosInstance.post<Admin>('/admin/admins', input);
	return data;
};

export const updateAdmin = async (
	id: string,
	change: { role?: AdminRole; isActive?: boolean },
): Promise<Admin> => {
	const { data } = await axiosInstance.patch<Admin>(
		`/admin/admins/${id}`,
		change,
	);
	return data;
};
