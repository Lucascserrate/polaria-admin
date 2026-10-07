'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatDay } from '@/lib/date';
import { tenantRoute } from '@/modules/tenants/routes';
import {
	getCustomerBusinesses,
	type Customer,
	type CustomerBusiness,
} from '@/services/customers.service';
import { activityOf, phoneOf } from './format';

/** Lo que se sabe de una persona, sin nada que se pueda tocar salvo "Editar". */
const CustomerDetail = ({
	customer,
	onEdit,
}: {
	customer: Customer;
	onEdit: () => void;
}) => (
	<div className="space-y-6">
		<Button variant="outline" size="sm" onClick={onEdit}>
			<Pencil className="size-3.5" />
			Editar
		</Button>

		<Section title="Contacto">
			<dl className="space-y-1.5 rounded-lg border border-border p-3">
				<Row label="Teléfono" value={phoneOf(customer)} />
				<Row label="Correo" value={customer.email ?? 'Sin correo'} />
			</dl>
		</Section>

		<Section title="Actividad">
			<dl className="space-y-1.5 rounded-lg border border-border p-3">
				<Row label="Reservas" value={activityOf(customer)} />
				<Row
					label="Última reserva"
					value={customer.lastBookedAt ? formatDay(customer.lastBookedAt) : '—'}
				/>
				<Row label="Alta" value={formatDay(customer.createdAt)} />
			</dl>
		</Section>

		{customer.appointmentsCount > 0 && (
			<Section title="Cliente de">
				<Businesses customerId={customer.id} />
			</Section>
		)}
	</div>
);

type BusinessesState =
	| { kind: 'loading' }
	| { kind: 'ready'; items: CustomerBusiness[] }
	| { kind: 'error' };

/**
 * Los negocios donde reserva, cada uno con un link a su ficha. Se piden al
 * abrir el detalle y no vienen con el listado: sólo los mira quien abre a una
 * persona.
 */
const Businesses = ({ customerId }: { customerId: string }) => {
	const [state, setState] = useState<BusinessesState>({ kind: 'loading' });

	useEffect(() => {
		let cancelled = false;

		getCustomerBusinesses(customerId)
			.then((items) => {
				if (!cancelled) setState({ kind: 'ready', items });
			})
			.catch(() => {
				if (!cancelled) setState({ kind: 'error' });
			});

		return () => {
			cancelled = true;
		};
	}, [customerId]);

	if (state.kind === 'loading') {
		return (
			<div className="flex justify-center py-4">
				<Spinner className="size-4" />
			</div>
		);
	}

	if (state.kind === 'error') {
		return (
			<p className="text-muted-foreground">
				No se pudieron cargar sus negocios.
			</p>
		);
	}

	return (
		<ul className="divide-y divide-border rounded-lg border border-border">
			{state.items.map((business) => (
				<li key={business.id}>
					<Link
						href={tenantRoute(business.id)}
						className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50"
					>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium">{business.name}</p>
							<p className="text-xs text-muted-foreground">
								{business.appointmentsCount === 1
									? '1 reserva'
									: `${business.appointmentsCount} reservas`}
								{' · '}la última el {formatDay(business.lastBookedAt)}
							</p>
						</div>
						<ChevronRight className="size-4 shrink-0 text-muted-foreground" />
					</Link>
				</li>
			))}
		</ul>
	);
};

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
		{children}
	</section>
);

const Row = ({ label, value }: { label: string; value: string }) => (
	<div className="flex justify-between gap-3">
		<dt className="shrink-0 text-muted-foreground">{label}</dt>
		<dd className="min-w-0 text-right font-medium break-all">{value}</dd>
	</div>
);

export default CustomerDetail;
