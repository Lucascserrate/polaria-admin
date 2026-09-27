interface Props {
	label: string;
	value: number;
	/** Lo que desglosa o matiza el número, en una línea. */
	detail?: string;
}

const numberFormat = new Intl.NumberFormat('es');

const StatTile = ({ label, value, detail }: Props) => (
	<div className="rounded-xl border border-border bg-card p-4">
		<p className="text-sm text-muted-foreground">{label}</p>
		<p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
			{numberFormat.format(value)}
		</p>
		{detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
	</div>
);

export default StatTile;
