import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { API_BASE_URL } from '@/constants/env';

export const metadata: Metadata = { title: 'Entrar' };

const ERRORS: Record<string, string> = {
	'not-admin':
		'Esa cuenta de Google no es de un administrador de Polaria. Probá con otra.',
};

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const { error } = await searchParams;
	const message = error ? ERRORS[error] : undefined;

	return (
		<div className="mx-auto flex h-full max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
			<Logo className="text-2xl" />
			<p className="text-muted-foreground">
				Entrá con tu cuenta de Google de administrador.
			</p>
			{message && (
				<p className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-destructive">
					{message}
				</p>
			)}
			<Button asChild>
				{/* Navegación completa: el viaje a Google no es una llamada a la API. */}
				<a href={`${API_BASE_URL}/admin/auth/google`}>Entrar con Google</a>
			</Button>
		</div>
	);
}
