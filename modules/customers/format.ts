import type { Customer } from '@/services/customers.service';

export const phoneOf = (customer: Customer) =>
	customer.phone ? `+${customer.phone}` : 'Sin teléfono';

export const activityOf = (customer: Customer) =>
	customer.appointmentsCount === 0
		? 'Sin reservas'
		: `${customer.appointmentsCount} en ${
				customer.businessesCount === 1
					? '1 negocio'
					: `${customer.businessesCount} negocios`
			}`;
