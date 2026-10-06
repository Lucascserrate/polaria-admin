import { ImageResponse } from 'next/og';
import { AppIcon } from '@/components/app-icon';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * El icono de la pantalla de inicio y de los favoritos del iPhone, que no
 * mira el favicon. 180 es lo que pide iOS; Android se arregla con el de 192
 * de `icon.tsx`.
 *
 * Cuadrado y sin redondear: iOS le pone las esquinas, y unas propias quedan
 * como un borde de otro color adentro de las suyas.
 */
export default function AppleIcon() {
	return new ImageResponse(<AppIcon glyph={108} />, { ...size });
}
