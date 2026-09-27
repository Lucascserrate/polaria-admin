'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { Building2, ShieldAlert, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from '@/components/logo';
import { panelUrl } from '@/constants/env';
import { cn } from '@/lib/utils';
import { TENANTS_BASE_ROUTE } from '@/modules/tenants/routes';
import {
	exitImpersonation,
	getSession,
	type Session,
} from '@/services/session.service';

const NAV: Array<{ href: string; label: string; icon: LucideIcon }> = [
	{ href: TENANTS_BASE_ROUTE, label: 'Negocios', icon: Building2 },
];

type State =
	{ kind: 'loading' } | { kind: 'ready'; session: Session } | { kind: 'error' };

/**
 * El marco de todas las pantallas: navegación, y la sesión resuelta antes de
 * mostrar nada.
 */
const DashboardShell = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const [state, setState] = useState<State>({ kind: 'loading' });

	useEffect(() => {
		getSession()
			.then((session) => setState({ kind: 'ready', session }))
			.catch((cause) => {
				// El 401 ya lo manda a /login el interceptor.
				if (axios.isAxiosError(cause) && cause.response?.status === 401) return;
				setState({ kind: 'error' });
			});
	}, []);

	if (state.kind === 'loading') {
		return (
			<div className="flex h-full items-center justify-center">
				<Spinner className="size-5" />
			</div>
		);
	}

	if (state.kind === 'error') {
		return (
			<p className="py-16 text-center text-muted-foreground">
				No pudimos conectar con la API. Recargá la página en un momento.
			</p>
		);
	}

	if (state.session.impersonatedBy) {
		return <ImpersonationNotice session={state.session} />;
	}

	return (
		<div className="flex min-h-full flex-col lg:flex-row">
			<aside className="shrink-0 border-b border-border lg:w-60 lg:border-r lg:border-b-0">
				<div className="flex items-center justify-between gap-4 px-4 py-3 lg:flex-col lg:items-stretch lg:px-3 lg:py-5">
					<Link href="/" className="flex items-center gap-2 px-2">
						<Logo className="text-lg" />
						<span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
							Admin
						</span>
					</Link>

					<nav className="flex gap-1 lg:mt-6 lg:flex-col">
						{NAV.map(({ href, label, icon: Icon }) => {
							const active = pathname.startsWith(href);

							return (
								<Link
									key={href}
									href={href}
									aria-current={active ? 'page' : undefined}
									className={cn(
										'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
										active
											? 'bg-muted font-medium text-foreground'
											: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
									)}
								>
									<Icon className="size-4" />
									{label}
								</Link>
							);
						})}
					</nav>
				</div>

				{state.session.email && (
					<p className="hidden truncate px-5 pb-5 text-xs text-muted-foreground lg:block">
						{state.session.email}
					</p>
				)}
			</aside>

			<main className="min-w-0 flex-1">{children}</main>
		</div>
	);
};

/**
 * Lo que se ve si se vuelve al dashboard con una sesión de soporte abierta.
 *
 * La cookie de soporte gana sobre la propia en toda la API, así que cada
 * pantalla de acá respondería 403. En vez de mostrar pantallas rotas, se dice
 * por qué y se ofrece salir.
 */
const ImpersonationNotice = ({ session }: { session: Session }) => {
	const [leaving, setLeaving] = useState(false);

	const leave = async () => {
		setLeaving(true);
		try {
			await exitImpersonation();
		} finally {
			window.location.reload();
		}
	};

	return (
		<div className="mx-auto flex h-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
			<ShieldAlert className="size-8 text-warning" />
			<p>
				Tenés una sesión de soporte abierta en{' '}
				<span className="font-semibold">{session.businessName}</span>. Mientras
				siga abierta, el dashboard no responde.
			</p>
			<div className="flex flex-wrap justify-center gap-2">
				<Button asChild variant="outline">
					<a href={panelUrl('/agenda')}>Volver al negocio</a>
				</Button>
				<Button disabled={leaving} onClick={() => void leave()}>
					{leaving && <Spinner className="size-3.5" />}
					Salir de la sesión de soporte
				</Button>
			</div>
		</div>
	);
};

export default DashboardShell;
