'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { formatDay } from '@/lib/date';
import { updateCustomer, type Customer } from '@/services/customers.service';
import OwnerBadges from './OwnerBadges';
import { activityOf } from './format';

interface Props {
	customer: Customer | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved: (customer: Customer) => void;
}

const CustomerDrawer = ({ customer, open, onOpenChange, onSaved }: Props) => (
	<Sheet open={open} onOpenChange={onOpenChange}>
		<SheetContent>
			{customer && (
				<CustomerDetail
					key={customer.id}
					customer={customer}
					onSaved={onSaved}
				/>
			)}
		</SheetContent>
	</Sheet>
);

const CustomerDetail = ({
	customer,
	onSaved,
}: {
	customer: Customer;
	onSaved: (customer: Customer) => void;
}) => {
	const initialPhone = customer.phone ? `+${customer.phone}` : '';
	const [name, setName] = useState(customer.name);
	const [phone, setPhone] = useState(initialPhone);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	const nameChanged = name.trim() !== customer.name;
	const phoneChanged = phone.trim() !== initialPhone;

	const save = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!name.trim()) {
			setError('El nombre no puede quedar vacío.');
			return;
		}

		setSaving(true);
		setError(null);
		setSaved(false);
		try {
			// Sólo lo que cambió: guardar el nombre no tiene por qué re-normalizar
			// un teléfono que nadie tocó.
			const updated = await updateCustomer(customer.id, {
				...(nameChanged && { name: name.trim() }),
				...(phoneChanged && { phone: phone.trim() }),
			});
			onSaved(updated);
			setPhone(updated.phone ? `+${updated.phone}` : '');
			setSaved(true);
		} catch (cause) {
			setError(
				axios.isAxiosError(cause) &&
					typeof cause.response?.data?.message === 'string'
					? cause.response.data.message
					: 'No se pudieron guardar los cambios. Intentá de nuevo.',
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<SheetHeader>
				<SheetTitle>{customer.name}</SheetTitle>
				<SheetDescription>{customer.email ?? 'Sin correo'}</SheetDescription>
				{customer.ownerOf.length > 0 && (
					<div className="flex flex-wrap gap-1 pt-1">
						<OwnerBadges customer={customer} />
					</div>
				)}
			</SheetHeader>

			<div className="space-y-6 px-6 pb-6 text-sm">
				<form onSubmit={(event) => void save(event)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="customer-name">Nombre</Label>
						<Input
							id="customer-name"
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="customer-phone">Teléfono</Label>
						<Input
							id="customer-phone"
							type="tel"
							inputMode="tel"
							value={phone}
							onChange={(event) => setPhone(event.target.value)}
							placeholder="+591 7000 0000"
						/>
						<p className="text-xs text-muted-foreground">
							Con + y código de país. Sin él, se toma como número de Bolivia.
							Vacío lo quita, y la persona lo va a tener que dar al reservar.
						</p>
					</div>

					{error && <p className="text-destructive">{error}</p>}
					{saved && !error && (
						<p className="text-success">Cambios guardados.</p>
					)}

					<Button
						type="submit"
						disabled={saving || (!nameChanged && !phoneChanged)}
					>
						{saving && <Spinner className="size-3.5" />}
						Guardar cambios
					</Button>
				</form>

				<section className="space-y-2">
					<h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
						Actividad
					</h3>
					<dl className="space-y-1.5 rounded-lg border border-border p-3">
						<Row label="Reservas" value={activityOf(customer)} />
						<Row
							label="Última reserva"
							value={
								customer.lastBookedAt ? formatDay(customer.lastBookedAt) : '—'
							}
						/>
						<Row label="Alta" value={formatDay(customer.createdAt)} />
					</dl>
				</section>
			</div>
		</>
	);
};

const Row = ({ label, value }: { label: string; value: string }) => (
	<div className="flex justify-between gap-3">
		<dt className="shrink-0 text-muted-foreground">{label}</dt>
		<dd className="min-w-0 text-right font-medium">{value}</dd>
	</div>
);

export default CustomerDrawer;
