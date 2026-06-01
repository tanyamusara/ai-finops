import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/dexie'
import { rankScenarioCosts } from '../../engine/scenario'

export default function SimulationsPage() {
    const scenariosRaw = useLiveQuery(() => db.scenarios.toArray(), [])
    const modelsRaw = useLiveQuery(() => db.models.toArray(), [])

    const scenarios = useMemo(() => scenariosRaw ?? [], [scenariosRaw])
    const models = useMemo(() => modelsRaw ?? [], [modelsRaw])

    const [selectedScenarioId, setSelectedScenarioId] = useState('saas-chatbot')

    const scenario = useMemo(() => {
        return scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0]
    }, [scenarios, selectedScenarioId])

    const results = useMemo(() => {
        if (!scenario || models.length === 0) return []
        return rankScenarioCosts(scenario, models)
    }, [scenario, models])

    const cheapest = results[0]

    const modelLookupMap = useMemo(() => {
        const map = new Map<string, typeof models[0]>()
        models.forEach((m) => map.set(m.id, m))
        return map
    }, [models])

    const cheapestModel = useMemo(() => {
        if (!cheapest) return null
        return modelLookupMap.get(cheapest.modelId)
    }, [cheapest, modelLookupMap])

    if (scenariosRaw === undefined || modelsRaw === undefined) {
        return (
            <div className="p-6 text-zinc-400 animate-pulse">
                Hydrating simulation scenarios...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Scenario Simulator
                </h1>
                <p className="mt-2 text-zinc-400">
                    Compare AI model costs across realistic workloads.
                </p>
            </div>

            <div className="card p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <label
                    htmlFor="scenario"
                    className="mb-2 block text-sm font-medium text-zinc-400"
                >
                    Target Deployment Scenario
                </label>

                <select
                    id="scenario"
                    value={scenario?.id || selectedScenarioId}
                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-purple-500"
                >
                    {scenarios.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {cheapest && cheapestModel && (
                <div className="card p-6 bg-linear-to-br from-purple-950/20 to-zinc-900/50 border border-purple-500/30 rounded-xl">
                    <div className="text-xs uppercase tracking-wider font-semibold text-purple-400">
                        Most Economical Strategy Selection
                    </div>

                    <div className="mt-2 text-2xl font-bold text-white">
                        {cheapestModel.name}
                    </div>

                    <div className="mt-1 text-zinc-300 font-mono text-sm">
                        ${cheapest.totalMonthlyCost.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        {' / month'}
                    </div>
                </div>
            )}

            <div className="card overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900 text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-3.5 text-left">Model</th>
                                <th className="px-6 py-3.5 text-left">Provider</th>
                                <th className="px-6 py-3.5 text-right">Monthly Cost</th>
                                <th className="px-6 py-3.5 text-right">Yearly Cost</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-800/60">
                            {results.map((result) => {
                                const model = modelLookupMap.get(result.modelId)

                                return (
                                    <tr
                                        key={result.modelId}
                                        className="border-t border-zinc-800/50 hover:bg-zinc-900/40 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-white">
                                            {model?.name || 'Unknown Model'}
                                        </td>

                                        <td className="px-6 py-4 text-zinc-400">
                                            {model?.provider || 'External'}
                                        </td>

                                        <td className="px-6 py-4 text-right font-mono text-zinc-300">
                                            $
                                            {result.totalMonthlyCost.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>

                                        <td className="px-6 py-4 text-right font-mono font-semibold text-white">
                                            $
                                            {result.totalYearlyCost.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
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