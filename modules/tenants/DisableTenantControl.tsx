'use client';

import { useState } from 'react';
import { Ban, CircleCheck } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Tenant } from '@/types/tenant.types';

interface Props {
	tenant: Tenant;
	pending: boolean;
	/** `true` para deshabilitar, `false` para volver a habilitar. */
	onChange: (disabled: boolean) => void;
}

/**
 * El botón de la cabecera para deshabilitar, con la confirmación que dice qué
 * deja de funcionar. Volver a habilitar no pide confirmación: no corta nada.
 */
export const DisableTenantButton = ({ tenant, pending, onChange }: Props) => {
	const [confirming, setConfirming] = useState(false);

	if (tenant.status === 'inactive') return null;

	return (
		<>
			<Button
				variant="outline"
				className="text-destructive hover:text-destructive"
				disabled={pending}
				onClick={() => setConfirming(true)}
			>
				<Ban className="size-4" />
				Deshabilitar
			</Button>

			<AlertDialog open={confirming} onOpenChange={setConfirming}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Deshabilitar {tenant.name}?</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<div className="space-y-2 text-sm text-muted-foreground">
								<p>Mientras esté deshabilitado:</p>
								<ul className="list-disc space-y-1 pl-5">
									<li>ni el dueño ni su equipo pueden entrar al panel;</li>
									<li>
										Polaria no responde por WhatsApp ni manda recordatorios;
									</li>
									<li>su página de reservas deja de existir.</li>
								</ul>
								<p>
									No se borra nada: habilitarlo lo deja exactamente como estaba.
								</p>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive hover:bg-destructive/90"
							onClick={() => onChange(true)}
						>
							Deshabilitar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

/** La franja que avisa, arriba de la ficha, que el negocio no está operando. */
export const DisabledNotice = ({ tenant, pending, onChange }: Props) => {
	if (tenant.status !== 'inactive') return null;

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3">
			<p className="text-sm">
				<span className="font-medium text-destructive">
					Negocio deshabilitado.
				</span>{' '}
				No entra al panel, no responde por WhatsApp y su página de reservas no
				existe.
			</p>
			<Button size="sm" disabled={pending} onClick={() => onChange(false)}>
				{pending ? (
					<Spinner className="size-3.5" />
				) : (
					<CircleCheck className="size-4" />
				)}
				Habilitar
			</Button>
		</div>
	);
};
