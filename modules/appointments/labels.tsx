import {
	CircleHelp,
	Globe,
	MessageCircle,
	Store,
	type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type {
	AdminAppointment,
	ChannelFilter,
} from '@/services/appointments.service';

export const CHANNELS: Record<
	ChannelFilter,
	{ label: string; icon: LucideIcon }
> = {
	whatsapp: { label: 'WhatsApp', icon: MessageCircle },
	web: { label: 'Web', icon: Globe },
	panel: { label: 'Panel', icon: Store },
	unknown: { label: 'Sin dato', icon: CircleHelp },
};

export const STATUS_LABELS: Record<AdminAppointment['status'], string> = {
	pending: 'Pendiente',
	confirmed: 'Confirmada',
	cancelled: 'Cancelada',
	completed: 'Completada',
};

/** Icono y palabra, nunca sólo color: el canal tiene que leerse igual en gris. */
export const ChannelTag = ({ channel }: { channel: ChannelFilter }) => {
	const { label, icon: Icon } = CHANNELS[channel];

	return (
		<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
			<Icon className="size-3.5 shrink-0 text-muted-foreground" />
			{label}
		</span>
	);
};

export const StatusBadge = ({
	status,
}: {
	status: AdminAppointment['status'];
}) => (
	<Badge variant={status === 'cancelled' ? 'secondary' : 'outline'}>
		{STATUS_LABELS[status] ?? status}
	</Badge>
);
