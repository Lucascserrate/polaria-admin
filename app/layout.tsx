import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { THEME_PREFERENCE_SCRIPT } from '@/components/theme-preference';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		default: 'Polaria Admin',
		template: '%s - Polaria Admin',
	},
	// Herramienta interna: no tiene nada que hacer en un buscador.
	robots: { index: false, follow: false },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		// El script de tema agrega la clase `dark` antes de hidratar; ver el
		// mismo comentario en el layout del panel.
		<html lang="es" className="h-full" suppressHydrationWarning>
			<body className={`${geistSans.className} antialiased h-full`}>
				<script dangerouslySetInnerHTML={{ __html: THEME_PREFERENCE_SCRIPT }} />
				{children}
			</body>
		</html>
	);
}
