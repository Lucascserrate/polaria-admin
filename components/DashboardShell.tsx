'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import {
	Building2,
	LayoutDashboard,
	LogOut,
	ShieldCheck,
	Users,
	type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from '@/components/logo';
import { SessionContext } from '@/components/session-context';
import { cn } from '@/lib/utils';
import { ADMIN_ROLE_LABELS, ADMINS_ROUTE } from '@/modules/admins/roles';
import { TENANTS_BASE_ROUTE } from '@/modules/tenants/routes';
import {
	getSession,
	logout,
	type AdminRole,
	type Session,
} from '@/services/session.service';

/** `roles` esconde la entrada; la que manda es la API, que responde 403. */
const NAV: Array<{
	href: string;
	label: string;
	icon: LucideIcon;
	roles?: AdminRole[];
}> = [
	{ href: '/overview', label: 'Overview', icon: LayoutDashboard },
	{ href: TENANTS_BASE_ROUTE, label: 'Negocios', icon: Building2 },
	{ href: '/users', label: 'Usuarios', icon: Users },
	{
		href: ADMINS_ROUTE,
		label: 'Administradores',
		icon: ShieldCheck,
		roles: ['SUPER_ADMIN'],
	},
];

type State =
	| { kind: 'loading' }
	| { kind: 'ready'; session: Session }
	| { kind: 'error'; detail: string };

/**
 * El marco de todas las pantallas: navegación, y la sesión resuelta antes de
 * mostrar nada.
 */
const DashboardShell = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const [state, setState] = useState<State>({ kind: 'loading' });
	const [leaving, setLeaving] = useState(false);

	useEffect(() => {
		getSession()
			.then((session) => setState({ kind: 'ready', session }))
			.catch((cause) => {
				// El 401 ya lo manda a /login el interceptor.
				if (axios.isAxiosError(cause) && cause.response?.status === 401) return;
				// Sin respuesta es red o CORS; con respuesta, el código dice cuál.
				const status = axios.isAxiosError(cause)
					? cause.response?.status
					: null;
				setState({
					kind: 'error',
					detail: status
						? `La API respondió ${status}.`
						: 'La API no respondió (caída, o CORS no admite este origen).',
				});
			});
	}, []);

	const leave = async () => {
		setLeaving(true);
		try {
			await logout();
		} finally {
			router.replace('/login');
		}
	};

	if (state.kind === 'loading') {
		return (
			<div className="flex h-full items-center justify-center">
				<Spinner className="size-5" />
			</div>
		);
	}

	if (state.kind === 'error') {
		return (
			<div className="space-y-1 py-16 text-center text-muted-foreground">
				<p>No pudimos leer tu sesión. Recargá la página en un momento.</p>
				<p className="text-xs">{state.detail}</p>
			</div>
		);
	}

	const { session } = state;

	return (
		<div className="flex min-h-full flex-col lg:flex-row">
			<aside className="flex shrink-0 flex-col border-b border-border lg:w-60 lg:border-r lg:border-b-0">
				<div className="flex items-center justify-between gap-4 px-4 py-3 lg:flex-col lg:items-stretch lg:px-3 lg:py-5">
					<Link href="/" className="flex items-center gap-2 px-2">
						<Logo className="text-lg" />
						<span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
							Admin
						</span>
					</Link>

					<nav className="flex gap-1 lg:mt-6 lg:flex-col">
						{NAV.filter(
							({ roles }) => !roles || roles.includes(session.role),
						).map(({ href, label, icon: Icon }) => {
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

				<div className="hidden items-center gap-2 px-5 pb-5 lg:mt-auto lg:flex">
					<div className="min-w-0 flex-1">
						<p className="truncate text-xs">{session.email}</p>
						<p className="text-xs text-muted-foreground">
							{ADMIN_ROLE_LABELS[session.role] ?? session.role}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Cerrar sesión"
						disabled={leaving}
						onClick={() => void leave()}
					>
						{leaving ? (
							<Spinner className="size-3.5" />
						) : (
							<LogOut className="size-4" />
						)}
					</Button>
				</div>
			</aside>

			<main className="min-w-0 flex-1">
				<SessionContext.Provider value={session}>
					{children}
				</SessionContext.Provider>
			</main>
		</div>
	);
};

export default DashboardShell;
