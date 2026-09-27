import Link from 'next/link';
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
import { tenantRoute } from '@/modules/tenants/routes';
import type { Customer } from '@/services/customers.service';

const phoneOf = (customer: Customer) =>
	customer.phone ? `+${customer.phone}` : 'Sin teléfono';

const activityOf = (customer: Customer) =>
	customer.appointmentsCount === 0
		? 'Sin reservas'
		: `${customer.appointmentsCount} en ${
				customer.businessesCount === 1
					? '1 negocio'
					: `${customer.businessesCount} negocios`
			}`;

/** Si también es dueño: es lo primero que soporte quiere saber de alguien. */
const OwnerBadges = ({ customer }: { customer: Customer }) =>
	customer.ownerOf.map((tenant) => (
		<Badge key={tenant.id} variant="secondary" asChild>
			<Link href={tenantRoute(tenant.id)}>Dueño de {tenant.name}</Link>
		</Badge>
	));

const CustomerList = ({ customers }: { customers: Customer[] }) => (
	<>
		<div className="hidden overflow-hidden rounded-lg border border-border md:block">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Persona</TableHead>
						<TableHead>Teléfono</TableHead>
						<TableHead>Reservas</TableHead>
						<TableHead>Última reserva</TableHead>
						<TableHead>Alta</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{customers.map((customer) => (
						<TableRow key={customer.id}>
							<TableCell>
								<span className="block font-medium">{customer.name}</span>
								<span className="block text-xs text-muted-foreground">
									{customer.email ?? 'Sin correo'}
								</span>
								{customer.ownerOf.length > 0 && (
									<span className="mt-1 flex flex-wrap gap-1">
										<OwnerBadges customer={customer} />
									</span>
								)}
							</TableCell>
							<TableCell className="tabular-nums">
								{phoneOf(customer)}
							</TableCell>
							<TableCell className="tabular-nums">
								{activityOf(customer)}
							</TableCell>
							<TableCell>
								{customer.lastBookedAt ? formatDay(customer.lastBookedAt) : '—'}
							</TableCell>
							<TableCell>{formatDay(customer.createdAt)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>

		<ul className="space-y-3 md:hidden">
			{customers.map((customer) => (
				<li
					key={customer.id}
					className="rounded-xl border border-border bg-card p-4 text-sm"
				>
					<p className="font-semibold">{customer.name}</p>
					<p className="break-all text-muted-foreground">
						{customer.email ?? 'Sin correo'}
					</p>
					{customer.ownerOf.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1">
							<OwnerBadges customer={customer} />
						</div>
					)}
					<dl className="mt-3 space-y-1.5">
						<Row label="Teléfono" value={phoneOf(customer)} />
						<Row label="Reservas" value={activityOf(customer)} />
						<Row
							label="Última reserva"
							value={
								customer.lastBookedAt ? formatDay(customer.lastBookedAt) : '—'
							}
						/>
						<Row label="Alta" value={formatDay(customer.createdAt)} />
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

export default CustomerList;
