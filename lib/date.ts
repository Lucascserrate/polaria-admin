const dayFormatter = new Intl.DateTimeFormat('es', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
});

/** `9 de septiembre de 2026`, a partir de un instante ISO. */
export const formatDay = (iso: string): string =>
	dayFormatter.format(new Date(iso));
