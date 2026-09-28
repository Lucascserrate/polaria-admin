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
import { formatDay } from '@/lib/date';
import type { Customer } from '@/services/customers.service';
import CustomerDrawer from './CustomerDrawer';
import { activityOf, phoneOf } from './format';
import OwnerBadges from './OwnerBadges';

const CustomerList = ({
	customers,
	onUpdated,
}: {
	customers: Customer[];
	onUpdated: (customer: Customer) => void;
}) => {
	// Separado de `open` para que el contenido siga ahí mientras el panel sale.
	const [selected, setSelected] = useState<Customer | null>(null);
	const [open, setOpen] = useState(false);

	const show = (customer: Customer) => {
		setSelected(customer);
		setOpen(true);
	};

	return (
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
							<TableRow
								key={customer.id}
								className="relative cursor-pointer has-focus-visible:bg-muted/50"
							>
								<TableCell>
									{/* Cubre la fila entera: toda la fila es el botón. */}
									<button
										type="button"
										onClick={() => show(customer)}
										className="block text-left font-medium outline-none after:absolute after:inset-0"
									>
										{customer.name}
									</button>
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
									{customer.lastBookedAt
										? formatDay(customer.lastBookedAt)
										: '—'}
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
						className="relative rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:bg-muted/50"
					>
						<button
							type="button"
							onClick={() => show(customer)}
							className="block text-left font-semibold outline-none after:absolute after:inset-0"
						>
							{customer.name}
						</button>
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

			<CustomerDrawer
				customer={selected}
				open={open}
				onOpenChange={setOpen}
				onSaved={(updated) => {
					setSelected(updated);
					onUpdated(updated);
				}}
			/>
		</>
	);
};

const Row = ({ label, value }: { label: string; value: string }) => (
	<div className="flex justify-between gap-3">
		<dt className="text-muted-foreground">{label}</dt>
		<dd className="text-right font-medium">{value}</dd>
	</div>
);

export default CustomerList;
