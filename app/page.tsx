import { redirect } from 'next/navigation';
import { TENANTS_BASE_ROUTE } from '@/modules/tenants/routes';

export default function Home() {
	redirect(TENANTS_BASE_ROUTE);
}
