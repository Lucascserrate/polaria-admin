'use client';

import type { WeekCount } from '@/services/stats.service';

interface Props {
	title: string;
	series: WeekCount[];
}

// Las semanas llegan como fechas UTC: formatearlas en otra zona correría el día.
const weekFormat = new Intl.DateTimeFormat('es', {
	day: 'numeric',
	month: 'short',
	timeZone: 'UTC',
});

const weekLabel = (week: string) =>
	weekFormat.format(new Date(`${week}T00:00:00Z`));

/** El tope del eje: 1, 2 o 5 por una potencia de diez, para que se lea redondo. */
const niceMax = (value: number): number => {
	if (value <= 0) return 1;
	const power = 10 ** Math.floor(Math.log10(value));
	const step =
		[1, 2, 5, 10].find((candidate) => candidate * power >= value) ?? 10;
	return step * power;
};

/**
 * Altas por semana, en columnas.
 *
 * Una serie por gráfico y no las tres juntas: son de escalas muy distintas —un
 * par de negocios contra decenas de reservas— y en un mismo eje las chicas
 * quedarían aplastadas contra el piso.
 */
const WeeklyBars = ({ title, series }: Props) => {
	const max = niceMax(Math.max(...series.map((point) => point.count)));
	const total = series.reduce((sum, point) => sum + point.count, 0);
	const last = series.at(-1);

	return (
		<figure className="rounded-xl border border-border bg-card p-4">
			<figcaption className="flex items-baseline justify-between gap-2">
				<span className="text-sm font-medium">{title}</span>
				<span className="text-xs text-muted-foreground tabular-nums">
					{total} en {series.length} semanas
				</span>
			</figcaption>

			<div className="mt-4 flex gap-2">
				<div className="flex h-32 flex-col justify-between text-right text-[11px] text-muted-foreground tabular-nums">
					<span className="-translate-y-1/2">{max}</span>
					<span className="translate-y-1/2">0</span>
				</div>

				<div className="relative h-32 flex-1">
					{/* Grilla: el tope y la base, en el gris más recesivo. */}
					<div className="absolute inset-x-0 top-0 border-t border-border" />
					<div className="absolute inset-x-0 bottom-0 border-t border-border" />

					<div className="absolute inset-0 flex items-end gap-0.5">
						{series.map((point) => (
							<div
								key={point.week}
								tabIndex={0}
								aria-label={`Semana del ${weekLabel(point.week)}: ${point.count}`}
								// La columna entera es el blanco del hover, no sólo la barra.
								className="group relative flex h-full flex-1 items-end justify-center outline-none"
							>
								<div
									className="w-full max-w-6 rounded-t bg-chart-2 transition-opacity group-hover:opacity-80"
									style={{ height: `${(point.count / max) * 100}%` }}
								/>
								<div className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm group-hover:block group-focus-visible:block">
									Semana del {weekLabel(point.week)} ·{' '}
									<span className="font-medium tabular-nums">
										{point.count}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-1 flex justify-between pl-6 text-[11px] text-muted-foreground">
				<span>{series[0] && weekLabel(series[0].week)}</span>
				<span>{last && `Esta semana: ${last.count}`}</span>
			</div>

			<details className="mt-3 text-xs">
				<summary className="cursor-pointer text-muted-foreground">
					Ver datos
				</summary>
				<table className="mt-2 w-full tabular-nums">
					<tbody>
						{series.map((point) => (
							<tr key={point.week} className="border-t border-border">
								<td className="py-1">Semana del {weekLabel(point.week)}</td>
								<td className="py-1 text-right">{point.count}</td>
							</tr>
						))}
					</tbody>
				</table>
			</details>
		</figure>
	);
};

export default WeeklyBars;
