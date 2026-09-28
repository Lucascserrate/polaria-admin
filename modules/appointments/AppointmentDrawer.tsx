'use client';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { AdminAppointment } from '@/services/appointments.service';
import { inTenantZone, joined, timeRange, when } from './format';
import { ChannelTag, StatusBadge } from './labels';

const AppointmentDrawer = ({
	appointment,
	open,
	onOpenChange,
}: {
	appointment: AdminAppointment | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => (
	<Sheet open={open} onOpenChange={onOpenChange}>
		<SheetContent>
			{appointment && <AppointmentDetail appointment={appointment} />}
		</SheetContent>
	</Sheet>
);

const AppointmentDetail = ({
	appointment,
}: {
	appointment: AdminAppointment;
}) => (
	<>
		<SheetHeader>
			<SheetTitle className="first-letter:uppercase">
				{when(appointment)}
			</SheetTitle>
			<SheetDescription>{appointment.tenant.name ?? '—'}</SheetDescription>
			<div className="pt-1">
				<StatusBadge status={appointment.status} />
			</div>
		</SheetHeader>

		<div className="space-y-6 px-6 pb-6 text-sm">
			<Section title="Turno">
				<Row label="Horario" value={timeRange(appointment)} />
				<Row label="Servicio" value={joined(appointment.services)} />
				<Row label="Profesional" value={joined(appointment.staff)} />
			</Section>

			<Section title="Cliente">
				<Row label="Nombre" value={appointment.client.name ?? '—'} />
				<Row
					label="Teléfono"
					value={
						appointment.client.phone ? `+${appointment.client.phone}` : '—'
					}
				/>
			</Section>

			<Section title="Origen">
				<Row
					label="Canal"
					value={<ChannelTag channel={appointment.channel ?? 'unknown'} />}
				/>
				<Row
					label="Reservada"
					value={inTenantZone(appointment, appointment.createdAt, {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
					})}
				/>
			</Section>

			<Section title="Referencia">
				<Row
					label="Zona horaria"
					value={appointment.tenant.timezone ?? 'Sin dato (se usa la tuya)'}
				/>
				<Row
					label="ID"
					value={
						<span className="font-mono text-xs break-all select-all">
							{appointment.id}
						</span>
					}
				/>
			</Section>
		</div>
	</>
);

const Section = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<section className="space-y-2">
		<h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
			{title}
		</h3>
		<dl className="space-y-1.5 rounded-lg border border-border p-3">
			{children}
		</dl>
	</section>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
	<div className="flex justify-between gap-3">
		<dt className="shrink-0 text-muted-foreground">{label}</dt>
		<dd className="min-w-0 text-right font-medium">{value}</dd>
	</div>
);

export default AppointmentDrawer;
