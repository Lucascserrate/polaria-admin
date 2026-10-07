'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { updateCustomer, type Customer } from '@/services/customers.service';

/** Corregir el nombre o el teléfono de una cuenta. */
const CustomerEditForm = ({
	customer,
	onCancel,
	onSaved,
}: {
	customer: Customer;
	onCancel: () => void;
	onSaved: (customer: Customer) => void;
}) => {
	const initialPhone = customer.phone ? `+${customer.phone}` : '';
	const [name, setName] = useState(customer.name);
	const [phone, setPhone] = useState(initialPhone);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
		try {
			// Sólo lo que cambió: guardar el nombre no tiene por qué re-normalizar
			// un teléfono que nadie tocó.
			onSaved(
				await updateCustomer(customer.id, {
					...(nameChanged && { name: name.trim() }),
					...(phoneChanged && { phone: phone.trim() }),
				}),
			);
		} catch (cause) {
			setError(
				axios.isAxiosError(cause) &&
					typeof cause.response?.data?.message === 'string'
					? cause.response.data.message
					: 'No se pudieron guardar los cambios. Intentá de nuevo.',
			);
			setSaving(false);
		}
	};

	return (
		<form onSubmit={(event) => void save(event)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="customer-name">Nombre</Label>
				<Input
					id="customer-name"
					value={name}
					autoFocus
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
					Con + y código de país. Sin él, se toma como número de Bolivia. Vacío
					lo quita, y la persona lo va a tener que dar al reservar.
				</p>
			</div>

			{error && <p className="text-destructive">{error}</p>}

			<div className="flex gap-2">
				<Button
					type="submit"
					disabled={saving || (!nameChanged && !phoneChanged)}
				>
					{saving && <Spinner className="size-3.5" />}
					Guardar cambios
				</Button>
				<Button
					type="button"
					variant="outline"
					disabled={saving}
					onClick={onCancel}
				>
					Cancelar
				</Button>
			</div>
		</form>
	);
};

export default CustomerEditForm;
