import type { AdminRole } from '@/services/session.service';

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
	SUPER_ADMIN: 'Super admin',
	ADMIN: 'Admin',
};

export const ADMINS_ROUTE = '/admins';
