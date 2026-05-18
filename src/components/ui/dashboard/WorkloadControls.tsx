import { useDashboardStore } from '../../../store/dashboardStore'

export function WorkloadControls() {
    const workload =
        useDashboardStore(
            (s) => s.workload,
        )

    const setWorkload =
        useDashboardStore(
            (s) => s.setWorkload,
        )

    return (
        <div className="card space-y-4 p-6">
            <div>
                <h2 className="text-lg font-semibold">
                    Workload Configuration
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                    Configure AI usage assumptions
                </p>
            </div>

            <div className="space-y-4">
                <Control
                    label="Input Tokens"
                    value={workload.inputTokens}
                    onChange={(v) =>
                        setWorkload({
                            inputTokens: Number(v),
                        })
                    }
                />

                <Control
                    label="Output Tokens"
                    value={workload.outputTokens}
                    onChange={(v) =>
                        setWorkload({
                            outputTokens: Number(v),
                        })
                    }
                />

                <Control
                    label="Cached Tokens"
                    value={workload.cachedTokens}
                    onChange={(v) =>
                        setWorkload({
                            cachedTokens: Number(v),
                        })
                    }
                />

                <Control
                    label="Requests / Day"
                    value={workload.requestsPerDay}
                    onChange={(v) =>
                        setWorkload({
                            requestsPerDay: Number(v),
                        })
                    }
                />
            </div>
        </div>
    )
}

interface ControlProps {
    label: string
    value: number

    onChange: (
        value: string,
    ) => void
}

function Control({
    label,
    value,
    onChange,
}: ControlProps) {
    return (
        <div>
            <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="mb-2 block text-sm text-zinc-400">
                {label}
            </label>

            <input
                id={label.toLowerCase().replace(/\s+/g, '-')}
                type="number"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
            />
        </div>
    )
}