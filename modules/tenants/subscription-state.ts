import type { TenantSubscription } from '@/types/tenant.types';

/**
 * Cómo se nombra cada estado de suscripción y de qué color se lee.
 *
 * Se traduce acá y no en el backend: qué estado tiene el negocio lo decide una
 * regla del producto, cómo se dice en una pantalla interna es del panel. El
 * mapa es total sobre `SubscriptionState`, con una salida por si el backend
 * gana un estado antes que estas pantallas.
 *
 * Vive fuera de la ficha porque el listado muestra lo mismo: dos copias de estos
 * nombres serían dos pantallas que le dicen cosas distintas al mismo negocio.
 */
export const SUBSCRIPTION_STATES: Record<
	string,
	{ label: string; tone: string }
> = {
	NOT_STARTED: { label: 'Sin iniciar', tone: 'text-muted-foreground' },
	TRIAL_ACTIVE: { label: 'Prueba en curso', tone: 'text-success' },
	TRIAL_EXPIRED: { label: 'Prueba vencida', tone: 'text-warning' },
	ACTIVE: { label: 'Suscripción paga', tone: 'text-success' },
	EXPIRED: { label: 'Suscripción vencida', tone: 'text-destructive' },
	CANCELED: { label: 'Cancelada', tone: 'text-destructive' },
};

export const subscriptionState = (state: string) =>
	SUBSCRIPTION_STATES[state] ?? {
		label: state,
		tone: 'text-muted-foreground',
	};

/** Lo que hace falta para saber cuánto le queda a un negocio. */
type Clock = Pick<
	TenantSubscription,
	'state' | 'daysRemaining' | 'trialEndsAt' | 'subscriptionEndsAt'
>;

const HOUR_MS = 60 * 60 * 1000;

/**
 * Cuánto le queda a lo que el negocio tiene corriendo, prueba o suscripción.
 *
 * `daysRemaining` cuenta días completos, así que el último día llega como 0:
 * "quedan 0 días" de algo que todavía está activo. Ahí se pasa a horas, que se
 * sacan del vencimiento de ese mismo reloj. `null` cuando no hay nada
 * corriendo, que es cuando el backend manda `daysRemaining` en `null`.
 *
 * `amount` va en una frase ("quedan 5 horas"), `short` en una etiqueta ("5 h"),
 * y `one` dice si el verbo va en singular.
 */
export const timeLeft = (
	subscription: Clock,
): { amount: string; short: string; one: boolean } | null => {
	const days = subscription.daysRemaining;

	if (days === null) return null;
	if (days >= 1) {
		return {
			amount: days === 1 ? '1 día' : `${days} días`,
			short: `${days} d`,
			one: days === 1,
		};
	}

	const end =
		subscription.state === 'ACTIVE'
			? subscription.subscriptionEndsAt
			: subscription.trialEndsAt;
	const hours = end ? Math.floor((Date.parse(end) - Date.now()) / HOUR_MS) : 0;

	if (hours < 1) {
		return { amount: 'menos de una hora', short: '< 1 h', one: true };
	}

	return {
		amount: hours === 1 ? '1 hora' : `${hours} horas`,
		short: `${hours} h`,
		one: hours === 1,
	};
};

/**
 * El estado con lo que le queda pegado, cuando le queda algo.
 *
 * Sólo cuando hay un reloj corriendo: el backend manda `daysRemaining` en
 * `null` en todos los demás estados, y "Suscripción paga · 0 días" sería una
 * lectura falsa de un dato ausente.
 */
export const subscriptionLabel = (subscription: TenantSubscription): string => {
	const { label } = subscriptionState(subscription.state);
	const left = timeLeft(subscription);

	return left ? `${label} · ${left.amount}` : label;
};
