import { axiosInstance } from '@/lib/axios';

export interface WeekCount {
	/** Lunes de la semana, YYYY-MM-DD (UTC). */
	week: string;
	count: number;
}

export interface Overview {
	businesses: {
		total: number;
		active: number;
		paying: number;
		inTrial: number;
	};
	users: { owners: number; staffWithAccess: number; customerAccounts: number };
	appointments: { total: number; last30Days: number };
	growth: {
		businesses: WeekCount[];
		appointments: WeekCount[];
		customerAccounts: WeekCount[];
	};
}

export const getOverview = async (): Promise<Overview> => {
	const { data } = await axiosInstance.get<Overview>('/admin/stats');
	return data;
};
