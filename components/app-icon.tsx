export const APP_ICON = { background: '#111111', glyph: '#82b4ff' };

export const AppIcon = ({
	glyph,
	radius = 0,
}: {
	/** El lado de la estrella, en píxeles. */
	glyph: number;
	/** El de iOS va en 0: el sistema le pone las esquinas. */
	radius?: number;
}) => (
	<div
		style={{
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: APP_ICON.background,
			borderRadius: radius,
		}}
	>
		<svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none">
			<path
				d="M12 1.5c.62 5.6 4.9 9.88 10.5 10.5-5.6.62-9.88 4.9-10.5 10.5-.62-5.6-4.9-9.88-10.5-10.5C7.1 11.38 11.38 7.1 12 1.5Z"
				fill={APP_ICON.glyph}
			/>
		</svg>
	</div>
);
