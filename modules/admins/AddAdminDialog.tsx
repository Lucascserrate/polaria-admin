'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { AdminRole } from '@/services/session.service';
import { ADMIN_ROLE_LABELS } from './roles';

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Tira si falla; el diálogo muestra el error y queda abierto. */
	onSubmit: (input: { email: string; role: AdminRole }) => Promise<void>;
	messageOf: (cause: unknown, fallback: string) => string;
}

const AddAdminDialog = ({ open, onOpenChange, onSubmit, messageOf }: Props) => {
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<AdminRole>('ADMIN');
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			setError('Ingresá un correo válido.');
			return;
		}

		setSaving(true);
		setError(null);
		try {
			await onSubmit({ email: email.trim(), role });
			onOpenChange(false);
		} catch (cause) {
			setError(messageOf(cause, 'No se pudo dar de alta. Intentá de nuevo.'));
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Agregar administrador</DialogTitle>
					<DialogDescription>
						Tiene que ser el correo de su cuenta de Google: es con el que va a
						entrar.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={submit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="admin-email">Correo</Label>
						<Input
							id="admin-email"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="nombre@gmail.com"
							autoFocus
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="admin-role">Rol</Label>
						<Select
							value={role}
							onValueChange={(value) => setRole(value as AdminRole)}
						>
							<SelectTrigger id="admin-role">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(ADMIN_ROLE_LABELS).map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">
							Un super admin además gestiona esta lista.
						</p>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={saving}>
							{saving && <Spinner className="size-3.5" />}
							Agregar
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddAdminDialog;
