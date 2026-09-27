import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { panelUrl } from '@/constants/env';

export const metadata: Metadata = { title: 'Entrar' };

/**
 * Sin login propio todavía.
 *
 * La sesión es la cookie que emite la API al entrar al panel, y el navegador la
 * manda igual desde este sitio. Hasta que el admin tenga su propio acceso, se
 * entra por el panel y se vuelve acá.
 */
export default function LoginPage() {
	return (
		<div className="mx-auto flex h-full max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
			<Logo className="text-2xl" />
			<p className="text-muted-foreground">
				Entrá al panel de Polaria con tu cuenta de administrador y después volvé
				a esta pestaña.
			</p>
			<Button asChild>
				<a href={panelUrl('/auth')} target="_blank" rel="noreferrer">
					Entrar por el panel
				</a>
			</Button>
		</div>
	);
}
