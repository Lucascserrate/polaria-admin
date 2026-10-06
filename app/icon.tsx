import { ImageResponse } from 'next/og';
import { AppIcon } from '@/components/app-icon';

export const contentType = 'image/png';

/**
 * El favicon, en tres tamaños.
 *
 * El de 32 es el de la pestaña. Los otros dos existen por las fichas de
 * Safari —la pantalla de inicio con los favoritos y las sugerencias—, que
 * dibujan el icono mucho más grande que una pestaña: con 32 píxeles como única
 * opción, Safari los estira hasta que se ve mal o directamente se rinde y deja
 * la ficha vacía. No alcanza con declarar un tamaño mayor en la etiqueta: hay
 * que servir la imagen en ese tamaño.
 *
 * Nada de esto vale para la pantalla de inicio del teléfono, que no mira el
 * favicon: ésa es `apple-icon.tsx`.
 *
 * `glyph` no escala parejo a propósito. A 32 píxeles la estrella tiene que ir
 * grande o queda una mancha negra con un punto adentro; de 192 para arriba va
 * suelta, que es el tratamiento de la marca y lo mismo que hace el icono de
 * iOS.
 */
const SIZES = [
	{ size: 32, glyph: 22 },
	{ size: 192, glyph: 58 },
	{ size: 512, glyph: 154 },
];

export function generateImageMetadata() {
	return SIZES.map(({ size }) => ({
		id: String(size),
		size: { width: size, height: size },
		contentType,
	}));
}

/*
 * `id` llega como promesa —no como el string que devolvió
 * `generateImageMetadata`—, igual que los `params` de una página. Si se compara
 * sin esperarla no coincide con nada, no falla, y los tres tamaños salen del
 * primero de la lista: tres archivos de 32 píxeles con distinto nombre.
 */
export default async function Icon({ id }: { id: Promise<string> }) {
	const requested = await id;
	const { size, glyph } =
		SIZES.find(({ size }) => String(size) === requested) ?? SIZES[0];

	return new ImageResponse(
		// El mismo redondeo que tenía el de 32, en proporción, para que los tres
		// se lean como el mismo icono.
		<AppIcon glyph={glyph} radius={Math.round((size * 7) / 32)} />,
		{ width: size, height: size },
	);
}
