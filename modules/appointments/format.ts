import type { AdminAppointment } from '@/services/appointments.service';

/**
 * Las fechas en la zona del negocio, no en la de quien mira: un turno de las 10
 * en La Paz no es "las 11" para un admin en Buenos Aires.
 */
export const inTenantZone = (
	appointment: AdminAppointment,
	iso: string,
	options: Intl.DateTimeFormatOptions,
) =>
	new Intl.DateTimeFormat('es', {
		...options,
		timeZone: appointment.tenant.timezone ?? undefined,
	}).format(new Date(iso));

/** `lun, 28 sept, 10:00`: el turno como se lo busca en una lista. */
export const when = (appointment: AdminAppointment) =>
	inTenantZone(appointment, appointment.startTime, {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	});

const HOUR: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

/** `10:00 – 10:45 (45 min)`. */
export const timeRange = (appointment: AdminAppointment) => {
	const minutes = Math.round(
		(new Date(appointment.endTime).getTime() -
			new Date(appointment.startTime).getTime()) /
			60_000,
	);

	return `${inTenantZone(appointment, appointment.startTime, HOUR)} – ${inTenantZone(appointment, appointment.endTime, HOUR)} (${minutes} min)`;
};

export const joined = (names: Array<string | undefined>) =>
	names.filter(Boolean).join(', ') || '—';
