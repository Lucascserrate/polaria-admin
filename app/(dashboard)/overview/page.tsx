'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import StatTile from '@/modules/overview/StatTile';
import WeeklyBars from '@/modules/overview/WeeklyBars';
import { getOverview, type Overview } from '@/services/stats.service';

export default function OverviewPage() {
	const [data, setData] = useState<Overview | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		getOverview()
			.then(setData)
			.catch(() => setError(true));
	}, []);

	if (error) {
		return (
			<p className="py-16 text-center text-muted-foreground">
				No se pudieron cargar las estadísticas. Intentá de nuevo.
			</p>
		);
	}

	if (!data) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Spinner className="size-5" />
			</div>
		);
	}

	const { businesses, users, appointments, growth } = data;

	return (
		<div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
			<h1 className="text-3xl font-bold tracking-tight">Overview</h1>

			<section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				<StatTile
					label="Negocios"
					value={businesses.total}
					detail={`${businesses.active} activos · ${businesses.paying} pagan · ${businesses.inTrial} en prueba`}
				/>
				<StatTile
					label="Reservas"
					value={appointments.total}
					detail={`${appointments.last30Days} en los últimos 30 días`}
				/>
				<StatTile
					label="Equipo con acceso"
					value={users.staffWithAccess}
					detail={`Más ${users.owners} dueños, uno por negocio`}
				/>
				<StatTile
					label="Clientes con cuenta"
					value={users.customerAccounts}
					detail="Entraron con Google para reservar"
				/>
			</section>

			<section className="space-y-3">
				<h2 className="text-lg font-semibold">Altas por semana</h2>
				<div className="grid gap-4 lg:grid-cols-3">
					<WeeklyBars title="Negocios nuevos" series={growth.businesses} />
					<WeeklyBars title="Reservas creadas" series={growth.appointments} />
					<WeeklyBars
						title="Clientes con cuenta nuevos"
						series={growth.customerAccounts}
					/>
				</div>
			</section>
		</div>
	);
}
