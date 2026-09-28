import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { tenantRoute } from '@/modules/tenants/routes';
import type { Customer } from '@/services/customers.service';

const OwnerBadges = ({ customer }: { customer: Customer }) =>
	customer.ownerOf.map((tenant) => (
		<Badge
			key={tenant.id}
			variant="secondary"
			className="relative z-10"
			asChild
		>
			<Link href={tenantRoute(tenant.id)}>Dueño de {tenant.name}</Link>
		</Badge>
	));

export default OwnerBadges;
