interface KPIGridProps {
    metrics: {
        dailyCost: number
        monthlyCost: number
        annualCost: number
        tokensPerDollar: number
    }
}

export function KPIGrid({
    metrics,
}: KPIGridProps) {
    const cards = [
        {
            label: 'Daily Cost',
            value: `$${metrics.dailyCost.toFixed(
                2,
            )}`,
        },

        {
            label: 'Monthly Cost',
            value: `$${metrics.monthlyCost.toFixed(
                0,
            )}`,
        },

        {
            label: 'Annual Cost',
            value: `$${metrics.annualCost.toFixed(
                0,
            )}`,
        },

        {
            label: 'Tokens / $',
            value:
                metrics.tokensPerDollar.toFixed(
                    0,
                ),
        },
    ]

    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="card p-6"
                >
                    <div className="text-sm text-zinc-400">
                        {card.label}
                    </div>

                    <div className="mt-3 text-3xl font-bold">
                        {card.value}
                    </div>
                </div>
            ))}
        </div>
    )
}