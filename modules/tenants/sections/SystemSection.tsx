'use client';

import { Switch } from '@/components/ui/switch';
import SectionHeader from '../SectionHeader';
import type { TenantDraft } from '../useTenantDraft';

interface Props {
	draft: TenantDraft;
	set: <K extends keyof TenantDraft>(key: K, value: TenantDraft[K]) => void;
}

/**
 * El interruptor de la IA. Deshabilitar el negocio no vive acá: es una acción
 * de la cabecera, con su confirmación, porque le corta todo al negocio.
 */
const SystemSection: React.FC<Props> = ({ draft, set }) => (
	<div className="space-y-8">
		<SectionHeader
			title="IA"
			description="Si Polaria responde los mensajes de este negocio."
		/>

		<label className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-3">
			<span>
				<span className="text-sm font-medium">IA habilitada</span>
				<span className="mt-1 block text-xs text-muted-foreground">
					Apagada, Polaria deja de responder los mensajes de este negocio al
					instante. El resto sigue funcionando.
				</span>
			</span>
			<Switch
				checked={draft.aiEnabled}
				onCheckedChange={(next) => set('aiEnabled', next)}
			/>
		</label>
	</div>
);

export default SystemSection;
