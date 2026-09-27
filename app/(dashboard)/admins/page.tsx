'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/components/session-context';
import { formatDay } from '@/lib/date';
import AddAdminDialog from '@/modules/admins/AddAdminDialog';
import { ADMIN_ROLE_LABELS } from '@/modules/admins/roles';
import {
	createAdmin,
	getAdmins,
	updateAdmin,
	type Admin,
} from '@/services/admins.service';
import type { AdminRole } from '@/services/session.service';

const messageOf = (cause: unknown, fallback: string) =>
	axios.isAxiosError(cause) && typeof cause.response?.data?.message === 'string'
		? cause.response.data.message
		: fallback;

export default function AdminsPage() {
	const session = useSession();
	const [admins, setAdmins] = useState<Admin[] | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [pendingId, setPendingId] = useState<string | null>(null);
	const [addOpen, setAddOpen] = useState(false);

	useEffect(() => {
		getAdmins()
			.then(setAdmins)
			.catch((cause) =>
				setLoadError(
					axios.isAxiosError(cause) && cause.response?.status === 403
						? 'Sólo un super admin puede gestionar administradores.'
						: 'No se pudo cargar la lista. Intentá de nuevo.',
				),
			);
	}, []);

	const replace = (updated: Admin) =>
		setAdmins((current) =>
			(current ?? []).map((item) => (item.id === updated.id ? updated : item)),
		);

	const change = async (
		admin: Admin,
		patch: { role?: AdminRole; isActive?: boolean },
	) => {
		setPendingId(admin.id);
		setError(null);
		try {
			replace(await updateAdmin(admin.id, patch));
		} catch (cause) {
			setError(messageOf(cause, 'No se pudo guardar el cambio.'));
		} finally {
			setPendingId(null);
		}
	};

	const add = async (input: { email: string; role: AdminRole }) => {
		const created = await createAdmin(input);
		setAdmins((current) => [created, ...(current ?? [])]);
	};

	if (loadError) {
		return (
			<p className="py-16 text-center text-muted-foreground">{loadError}</p>
		);
	}

	if (!admins) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Spinner className="size-5" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
					<p className="max-w-xl text-muted-foreground">
						Quiénes entran a este dashboard. Se entra con Google usando el
						correo dado de alta acá.
					</p>
				</div>
				<Button onClick={() => setAddOpen(true)}>
					<Plus className="size-4" />
					Agregar administrador
				</Button>
			</div>

			{error && (
				<p className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-destructive">
					{error}
				</p>
			)}

			<ul className="divide-y divide-border rounded-xl border border-border">
				{admins.map((admin) => {
					const isMe = admin.id === session.id;
					const pending = pendingId === admin.id;

					return (
						<li
							key={admin.id}
							className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3"
						>
							<div className="min-w-0 flex-1 basis-56">
								<p className="truncate font-medium">
									{admin.email}
									{isMe && (
										<span className="ml-2 text-xs font-normal text-muted-foreground">
											Vos
										</span>
									)}
								</p>
								<p className="text-xs text-muted-foreground">
									{admin.lastLoginAt
										? `Último ingreso: ${formatDay(admin.lastLoginAt)}`
										: 'Todavía no entró'}
								</p>
							</div>

							{/* Lo propio no se toca: lo cambia otro super admin. */}
							<Select
								value={admin.role}
								disabled={isMe || pending}
								onValueChange={(role) =>
									void change(admin, { role: role as AdminRole })
								}
							>
								<SelectTrigger
									className="w-36"
									aria-label={`Rol de ${admin.email}`}
								>
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

							<div className="flex w-40 items-center justify-end gap-2">
								{admin.isActive ? (
									<Badge>Activo</Badge>
								) : (
									<Badge variant="secondary">Sin acceso</Badge>
								)}
								{!isMe && (
									<Button
										variant="ghost"
										size="sm"
										disabled={pending}
										onClick={() =>
											void change(admin, { isActive: !admin.isActive })
										}
									>
										{pending && <Spinner className="size-3.5" />}
										{admin.isActive ? 'Quitar acceso' : 'Reactivar'}
									</Button>
								)}
							</div>
						</li>
					);
				})}
			</ul>

			<AddAdminDialog
				// Remonta en cada apertura para no arrastrar lo tipeado antes.
				key={addOpen ? 'open' : 'closed'}
				open={addOpen}
				onOpenChange={setAddOpen}
				onSubmit={add}
				messageOf={messageOf}
			/>
		</div>
	);
}
