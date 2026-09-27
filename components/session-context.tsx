'use client';

import { createContext, useContext } from 'react';
import type { Session } from '@/services/session.service';

export const SessionContext = createContext<Session | null>(null);

/** El admin en sesión. Sólo vale dentro de `DashboardShell`, que la resuelve antes. */
export const useSession = (): Session => {
	const session = useContext(SessionContext);
	if (!session) throw new Error('useSession fuera de DashboardShell.');
	return session;
};
