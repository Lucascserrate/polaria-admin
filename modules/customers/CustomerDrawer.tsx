'use client';

import { useState } from 'react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { Customer } from '@/services/customers.service';
import CustomerDetail from './CustomerDetail';
import CustomerEditForm from './CustomerEditForm';
import OwnerBadges from './OwnerBadges';

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
				// La `key` hace que otra persona abra siempre en el detalle, no en
				// la edición que quedó a medias con la anterior.
				<CustomerPanel
					key={customer.id}
					customer={customer}
					onSaved={onSaved}
				/>
			)}
		</SheetContent>
	</Sheet>
);

/**
 * Abre mostrando y se edita a pedido: corregir un nombre es la excepción, y un
 * formulario abierto de entrada invita a tocar lo que sólo se vino a mirar.
 */
const CustomerPanel = ({
	customer,
	onSaved,
}: {
	customer: Customer;
	onSaved: (customer: Customer) => void;
}) => {
	const [editing, setEditing] = useState(false);

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

			<div className="px-6 pb-6 text-sm">
				{editing ? (
					<CustomerEditForm
						customer={customer}
						onCancel={() => setEditing(false)}
						onSaved={(updated) => {
							onSaved(updated);
							setEditing(false);
						}}
					/>
				) : (
					<CustomerDetail customer={customer} onEdit={() => setEditing(true)} />
				)}
			</div>
		</>
	);
};

export default CustomerDrawer;
