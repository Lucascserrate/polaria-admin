'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { AdminAppointment } from '@/services/appointments.service';
import AppointmentDrawer from './AppointmentDrawer';
import { when } from './format';
import { ChannelTag } from './labels';

/**
 * La lista muestra lo que sirve para encontrar una reserva: cuándo, dónde,
 * quién y por dónde entró. El resto está en el detalle, que se abre con un
 * click en la fila.
 */
const AppointmentList = ({
	appointments,
}: {
	appointments: AdminAppointment[];
}) => {
	// Separado de `open` para que el contenido siga ahí mientras el drawer sale.
	const [selected, setSelected] = useState<AdminAppointment | null>(null);
	const [open, setOpen] = useState(false);

	const show = (appointment: AdminAppointment) => {
		setSelected(appointment);
		setOpen(true);
	};

	return (
		<>
			<div className="hidden overflow-hidden rounded-lg border border-border lg:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Turno</TableHead>
							<TableHead>Negocio</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead>Canal</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{appointments.map((appointment) => (
							<TableRow
								key={appointment.id}
								className="relative cursor-pointer has-focus-visible:bg-muted/50"
							>
								<TableCell>
									{/* Cubre la fila entera: toda la fila es el botón. */}
									<button
										type="button"
										onClick={() => show(appointment)}
										className="text-left outline-none after:absolute after:inset-0"
									>
										{when(appointment)}
									</button>
								</TableCell>
								<TableCell>{appointment.tenant.name ?? '—'}</TableCell>
								<TableCell>{appointment.client.name ?? '—'}</TableCell>
								<TableCell>
									<ChannelTag channel={appointment.channel ?? 'unknown'} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<ul className="space-y-3 lg:hidden">
				{appointments.map((appointment) => (
					<li key={appointment.id}>
						<button
							type="button"
							onClick={() => show(appointment)}
							className="w-full rounded-xl border border-border bg-card p-4 text-left text-sm transition-colors hover:bg-muted/50"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="font-semibold">{when(appointment)}</p>
									<p className="truncate text-muted-foreground">
										{appointment.tenant.name ?? '—'}
									</p>
								</div>
								<ChannelTag channel={appointment.channel ?? 'unknown'} />
							</div>
							<p className="mt-2 truncate">{appointment.client.name ?? '—'}</p>
						</button>
					</li>
				))}
			</ul>

			<AppointmentDrawer
				appointment={selected}
				open={open}
				onOpenChange={setOpen}
			/>
		</>
	);
};

export default AppointmentList;
