import { axiosInstance } from '@/lib/axios';

/** Una cuenta de quien reserva, con su actividad en Polaria. */
export interface Customer {
	id: string;
	name: string;
	email: string | null;
	/** Formato `wa_id`: dígitos con código de país, sin `+`. */
	phone: string | null;
	createdAt: string;
	/** Todas sus reservas, canceladas incluidas. */
	appointmentsCount: number;
	businessesCount: number;
	/** Cuándo reservó por última vez; no es la fecha del turno. */
	lastBookedAt: string | null;
	/** Negocios cuyo dueño usa el mismo correo. */
	ownerOf: Array<{ id: string; name: string }>;
}

export interface CustomersPage {
	items: Customer[];
	total: number;
	page: number;
	pageSize: number;
}

export const getCustomers = async (params: {
	page: number;
	search?: string;
}): Promise<CustomersPage> => {
	const { data } = await axiosInstance.get<CustomersPage>('/admin/customers', {
		params: { page: params.page, search: params.search || undefined },
	});
	return data;
};

/** Corrige nombre o teléfono. `phone` vacío lo quita. Devuelve la fila actualizada. */
export const updateCustomer = async (
	id: string,
	change: { name?: string; phone?: string },
): Promise<Customer> => {
	const { data } = await axiosInstance.patch<Customer>(
		`/admin/customers/${id}`,
		change,
	);
	return data;
};
