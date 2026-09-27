import { axiosInstance } from '@/lib/axios';

export type AppointmentChannel = 'whatsapp' | 'web' | 'panel';
/** `unknown` son las reservas anteriores a que se registrara el canal. */
export type ChannelFilter = AppointmentChannel | 'unknown';

export interface AdminAppointment {
	id: string;
	startTime: string;
	endTime: string;
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
	channel: AppointmentChannel | null;
	createdAt: string;
	tenant: { id: string; name: string | null; timezone: string | null };
	client: { name: string | null; phone: string | null };
	services: Array<string | undefined>;
	staff: Array<string | undefined>;
}

export interface AppointmentsPage {
	items: AdminAppointment[];
	total: number;
	page: number;
	pageSize: number;
	/** Por canal, con el filtro de negocio aplicado y sin el de canal. */
	byChannel: Partial<Record<ChannelFilter, number>>;
}

export const getAppointments = async (params: {
	page: number;
	channel?: ChannelFilter;
	tenantId?: string;
}): Promise<AppointmentsPage> => {
	const { data } = await axiosInstance.get<AppointmentsPage>(
		'/admin/appointments',
		{ params },
	);
	return data;
};
