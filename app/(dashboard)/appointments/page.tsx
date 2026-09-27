'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import AppointmentList from '@/modules/appointments/AppointmentList';
import { CHANNELS } from '@/modules/appointments/labels';
import {
	getAppointments,
	type AppointmentsPage,
	type ChannelFilter,
} from '@/services/appointments.service';
import { tenantsService } from '@/services/tenants.service';

const ALL = 'all';
const CHANNEL_ORDER: ChannelFilter[] = ['whatsapp', 'web', 'panel', 'unknown'];

export default function AppointmentsPage() {
	const [channel, setChannel] = useState<ChannelFilter | null>(null);
	const [tenantId, setTenantId] = useState<string>(ALL);
	const [page, setPage] = useState(1);
	const [data, setData] = useState<AppointmentsPage | null>(null);
	const [tenants, setTenants] = useState<Array<{ id: string; name: string }>>(
		[],
	);
	const [error, setError] = useState(false);

	useEffect(() => {
		tenantsService
			.getAll()
			.then((list) =>
				setTenants(
					list
						.map(({ id, name }) => ({ id, name }))
						.sort((a, b) => a.name.localeCompare(b.name)),
				),
			)
			// Sin la lista se pierde el filtro por negocio, no la pantalla.
			.catch(() => setTenants([]));
	}, []);

	useEffect(() => {
		let cancelled = false;

		getAppointments({
			page,
			channel: channel ?? undefined,
			tenantId: tenantId === ALL ? undefined : tenantId,
		})
			.then((result) => {
				if (cancelled) return;
				setData(result);
				setError(false);
			})
			.catch(() => {
				if (!cancelled) setError(true);
			});

		return () => {
			cancelled = true;
		};
	}, [page, channel, tenantId]);

	const allCount = data
		? Object.values(data.byChannel).reduce((sum, n) => sum + (n ?? 0), 0)
		: null;
	const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

	const chooseChannel = (next: ChannelFilter | null) => {
		setChannel(next);
		setPage(1);
	};

	return (
		<div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
				<p className="max-w-2xl text-muted-foreground">
					Todas las reservas de Polaria, las más recientes primero. El canal se
					registra desde el 27 de septiembre de 2026; las anteriores figuran sin
					dato.
				</p>
			</div>

			{/* Los filtros, en una sola fila, arriba de lo que filtran. */}
			<div className="flex flex-wrap items-center gap-2">
				<div
					role="group"
					aria-label="Canal"
					className="flex flex-wrap gap-1 rounded-lg border border-border p-1"
				>
					<ChannelButton
						active={channel === null}
						label="Todos"
						count={allCount}
						onClick={() => chooseChannel(null)}
					/>
					{CHANNEL_ORDER.map((value) => (
						<ChannelButton
							key={value}
							active={channel === value}
							label={CHANNELS[value].label}
							count={data ? (data.byChannel[value] ?? 0) : null}
							onClick={() => chooseChannel(value)}
						/>
					))}
				</div>

				<Select
					value={tenantId}
					onValueChange={(value) => {
						setTenantId(value);
						setPage(1);
					}}
				>
					<SelectTrigger className="w-56" aria-label="Negocio">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>Todos los negocios</SelectItem>
						{tenants.map((tenant) => (
							<SelectItem key={tenant.id} value={tenant.id}>
								{tenant.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{error ? (
				<p className="py-16 text-center text-muted-foreground">
					No se pudo cargar la lista. Intentá de nuevo.
				</p>
			) : !data ? (
				<div className="flex h-64 items-center justify-center">
					<Spinner className="size-5" />
				</div>
			) : data.items.length === 0 ? (
				<p className="py-16 text-center text-muted-foreground">
					No hay reservas con estos filtros.
				</p>
			) : (
				<>
					<AppointmentList appointments={data.items} />

					{pages > 1 && (
						<div className="flex items-center justify-between gap-4 text-sm">
							<span className="text-muted-foreground">
								Página {page} de {pages}
							</span>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={page <= 1}
									onClick={() => setPage(page - 1)}
								>
									Anterior
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={page >= pages}
									onClick={() => setPage(page + 1)}
								>
									Siguiente
								</Button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}

const ChannelButton = ({
	active,
	label,
	count,
	onClick,
}: {
	active: boolean;
	label: string;
	count: number | null;
	onClick: () => void;
}) => (
	<button
		type="button"
		aria-pressed={active}
		onClick={onClick}
		className={cn(
			'rounded-md px-3 py-1.5 text-sm transition-colors',
			active
				? 'bg-muted font-medium text-foreground'
				: 'text-muted-foreground hover:text-foreground',
		)}
	>
		{label}
		{count !== null && (
			<span className="ml-1.5 text-xs tabular-nums text-muted-foreground">
				{count}
			</span>
		)}
	</button>
);
