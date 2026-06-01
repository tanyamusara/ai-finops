import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from '../../db/dexie';
import { compareModels } from '../../engine/models/compareModels';
import { useDashboardStore } from '../../store/dashboardStore';

export default function ModelsPage() {
    
    const modelsRaw = useLiveQuery(() => db.models.toArray(), []);
    const models = useMemo(() => modelsRaw ?? [], [modelsRaw]);

    const workload = useDashboardStore((s) => s.workload);

    const results = useMemo(() => {
        if (models.length === 0) return []
        return compareModels(models, {
            inputTokens: workload.inputTokens,
            outputTokens: workload.outputTokens,
            cachedTokens: workload.cachedTokens ?? 0,
            requestsPerDay: workload.requestsPerDay,
        })
    }, [models, workload]);

    
    const modelLookupMap = useMemo(() => {
        const map = new Map<string, typeof models[0]>()
        models.forEach((m) => map.set(m.id, m))
        return map
    }, [models]);

    if (modelsRaw === undefined) {
        return (
            <div className="p-6 text-zinc-400 animate-pulse">
                Hydrating comparative infrastructure arrays...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Model Comparison
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                    Compare single-request pricing overhead and operational runs scaled to your active global configuration settings.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-800 shadow-sm bg-zinc-950/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-white">
                        <thead className="bg-zinc-900 text-zinc-300 font-medium">
                            <tr>
                                <th className="px-6 py-3.5 text-left">Model</th>
                                <th className="px-6 py-3.5 text-left">Provider</th>
                                <th className="px-6 py-3.5 text-right">Request Cost</th>
                                <th className="px-6 py-3.5 text-right">Daily Cost</th>
                                <th className="px-6 py-3.5 text-right">Monthly Cost</th>
                                <th className="px-6 py-3.5 text-right">Yearly Cost</th>
                                <th className="px-6 py-3.5 text-right">Latency</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-800/60">
                            {results.map((row) => {
                                const model = modelLookupMap.get(row.modelId)

                                return (
                                    <tr
                                        key={row.modelId}
                                        className="border-t border-zinc-800/50 hover:bg-zinc-900/40 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-white">
                                            {model?.name ?? 'Unknown Architecture'}
                                        </td>

                                        <td className="px-6 py-4 text-zinc-400">
                                            {model?.provider ?? 'External'}
                                        </td>

                                        <td className="px-6 py-4 text-right font-mono text-zinc-300">
                                            ${row.requestCost.toFixed(6)}
                                        </td>

                                        <td className="px-6 py-4 text-right font-mono text-zinc-300">
                                            $
                                            {row.dailyCost.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>

                                        <td className="px-6 py-4 text-right font-mono text-zinc-300">
                                            $
                                            {row.monthlyCost.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>

                                        <td className="px-6 py-4 text-right font-mono font-semibold text-white">
                                            $
                                            {row.yearlyCost.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>

                                        <td className="px-6 py-4 text-right text-zinc-400">
                                            {model?.avgLatencyMs
                                                ? `${model.avgLatencyMs.toLocaleString()} ms`
                                                : '—'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}