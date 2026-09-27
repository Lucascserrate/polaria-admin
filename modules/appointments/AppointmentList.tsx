import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatDay } from '@/lib/date';
import type { AdminAppointment } from '@/services/appointments.service';
import { ChannelTag, STATUS_LABELS } from './labels';

/**
 * La hora del turno en la zona del negocio, no en la de quien mira: un turno de
 * las 10 en La Paz no es "las 11" para un admin en Buenos Aires.
 */
const when = (appointment: AdminAppointment) =>
	new Intl.DateTimeFormat('es', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: appointment.tenant.timezone ?? undefined,
	}).format(new Date(appointment.startTime));

const joined = (names: Array<string | undefined>) =>
	names.filter(Boolean).join(', ') || '—';

const StatusBadge = ({ status }: { status: AdminAppointment['status'] }) => (
	<Badge variant={status === 'cancelled' ? 'secondary' : 'outline'}>
		{STATUS_LABELS[status] ?? status}
	</Badge>
);

const AppointmentList = ({
	appointments,
}: {
	appointments: AdminAppointment[];
}) => (
	<>
		<div className="hidden overflow-hidden rounded-lg border border-border lg:block">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Turno</TableHead>
						<TableHead>Negocio</TableHead>
						<TableHead>Cliente</TableHead>
						<TableHead>Servicio</TableHead>
						<TableHead>Profesional</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Canal</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{appointments.map((appointment) => (
						<TableRow key={appointment.id}>
							<TableCell className="whitespace-nowrap">
								{when(appointment)}
							</TableCell>
							<TableCell>{appointment.tenant.name ?? '—'}</TableCell>
							<TableCell>
								<span className="block">{appointment.client.name ?? '—'}</span>
								{appointment.client.phone && (
									<span className="block text-xs text-muted-foreground tabular-nums">
										+{appointment.client.phone}
									</span>
								)}
							</TableCell>
							<TableCell>{joined(appointment.services)}</TableCell>
							<TableCell>{joined(appointment.staff)}</TableCell>
							<TableCell>
								<StatusBadge status={appointment.status} />
							</TableCell>
							<TableCell>
								<ChannelTag channel={appointment.channel ?? 'unknown'} />
								<span className="block text-xs text-muted-foreground">
									Reservada el {formatDay(appointment.createdAt)}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>

		<ul className="space-y-3 lg:hidden">
			{appointments.map((appointment) => (
				<li
					key={appointment.id}
					className="rounded-xl border border-border bg-card p-4 text-sm"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<p className="font-semibold">{when(appointment)}</p>
							<p className="text-muted-foreground">
								{appointment.tenant.name ?? '—'}
							</p>
						</div>
						<StatusBadge status={appointment.status} />
					</div>
					<dl className="mt-3 space-y-1.5">
						<Row label="Cliente" value={appointment.client.name ?? '—'} />
						<Row label="Servicio" value={joined(appointment.services)} />
						<Row label="Profesional" value={joined(appointment.staff)} />
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Canal</dt>
							<dd className="font-medium">
								<ChannelTag channel={appointment.channel ?? 'unknown'} />
							</dd>
						</div>
						<Row label="Reservada" value={formatDay(appointment.createdAt)} />
					</dl>
				</li>
			))}
		</ul>
	</>
);

const Row = ({ label, value }: { label: string; value: string }) => (
	<div className="flex justify-between gap-3">
		<dt className="text-muted-foreground">{label}</dt>
		<dd className="text-right font-medium">{value}</dd>
	</div>
);

export default AppointmentList;
