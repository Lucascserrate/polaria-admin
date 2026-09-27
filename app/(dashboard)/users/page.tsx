'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import CustomerList from '@/modules/customers/CustomerList';
import { getCustomers, type CustomersPage } from '@/services/customers.service';

/** Lo que se espera después de la última tecla antes de buscar. */
const SEARCH_DELAY_MS = 300;

export default function UsersPage() {
	const [input, setInput] = useState('');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [data, setData] = useState<CustomersPage | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearch(input.trim());
			setPage(1);
		}, SEARCH_DELAY_MS);
		return () => clearTimeout(timer);
	}, [input]);

	useEffect(() => {
		let cancelled = false;

		getCustomers({ page, search })
			.then((result) => {
				if (cancelled) return;
				setData(result);
				setError(false);
			})
			.catch(() => {
				if (!cancelled) setError(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		// Una búsqueda lenta no puede pisar a la que se escribió después.
		return () => {
			cancelled = true;
		};
	}, [page, search]);

	const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

	return (
		<div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
				<p className="max-w-2xl text-muted-foreground">
					Las personas que reservan con su cuenta de Google.
					{data && ` ${data.total} en total.`}
				</p>
			</div>

			<div className="relative max-w-md">
				<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder="Buscar por nombre, correo o teléfono"
					aria-label="Buscar usuarios"
					className="pl-9"
				/>
			</div>

			{error ? (
				<p className="py-16 text-center text-muted-foreground">
					No se pudo cargar la lista. Intentá de nuevo.
				</p>
			) : loading && !data ? (
				<div className="flex h-64 items-center justify-center">
					<Spinner className="size-5" />
				</div>
			) : data && data.items.length === 0 ? (
				<p className="py-16 text-center text-muted-foreground">
					{search
						? `Nadie coincide con "${search}".`
						: 'Todavía nadie creó una cuenta.'}
				</p>
			) : (
				data && (
					<>
						<CustomerList customers={data.items} />

						{pages > 1 && (
							<div className="flex items-center justify-between gap-4 text-sm">
								<span className="text-muted-foreground">
									Página {page} de {pages}
								</span>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										disabled={page <= 1}
										onClick={() => setPage(page - 1)}
									>
										Anterior
									</Button>
									<Button
										variant="outline"
										size="sm"
										disabled={page >= pages}
										onClick={() => setPage(page + 1)}
									>
										Siguiente
									</Button>
								</div>
							</div>
						)}
					</>
				)
			)}
		</div>
	);
}
