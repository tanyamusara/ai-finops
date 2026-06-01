import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';
import { calculateTokenCost } from '../../engine/tokenCost';
import { useDashboardStore } from '../../store/dashboardStore';
import { Landmark, Layers, Coins, Zap } from 'lucide-react';

export default function PricingPage() {

    const workload = useDashboardStore((s) => s.workload);
    const setWorkload = useDashboardStore((s) => s.setWorkload);
    const selectedModelId = useDashboardStore((s) => s.selectedModelId);
    const setSelectedModelId = useDashboardStore((s) => s.setSelectedModelId);

    const modelsRaw = useLiveQuery(() => db.models.toArray(), []);
    const models = useMemo(() => modelsRaw ?? [], [modelsRaw]);

    const selectedModel = useMemo(() => {
        return models.find((m) => m.id === selectedModelId) || models[0]
    }, [models, selectedModelId])

    const metrics = useMemo(() => {
        if (!selectedModel) return null
        return calculateTokenCost({
            inputTokens: workload.inputTokens,
            outputTokens: workload.outputTokens,
            cachedTokens: workload.cachedTokens ?? 0,
            requestsPerDay: workload.requestsPerDay,
            inputCostPer1M: selectedModel.inputCostPer1M,
            outputCostPer1M: selectedModel.outputCostPer1M,
            cacheReadCostPer1M: selectedModel.cacheReadCostPer1M ?? 0,
            batchDiscountPercent: workload.batchDiscountPercent ?? 0,
        })
    }, [selectedModel, workload])

    const updateWorkloadParam = (key: string, value: number) => {
        setWorkload({
            ...workload,
            [key]: value
        })
    }

    if (models.length === 0) {
        return <div className="p-8 text-center text-zinc-400 animate-pulse">Loading metrics...</div>
    }

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card p-6 flex items-center space-x-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Coins className="h-6 w-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-zinc-400 uppercase">Daily Cost</p>
                            <h3 className="text-2xl font-bold text-white">${metrics.dailyCost.toFixed(2)}</h3>
                        </div>
                    </div>
                    <div className="card p-6 flex items-center space-x-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Layers className="h-6 w-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-zinc-400 uppercase">Monthly Run Rate</p>
                            <h3 className="text-2xl font-bold text-white">${metrics.monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                        </div>
                    </div>
                    <div className="card p-6 flex items-center space-x-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Landmark className="h-6 w-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-zinc-400 uppercase">Annualized TCO</p>
                            <h3 className="text-2xl font-bold text-white">${metrics.yearlyCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                        </div>
                    </div>
                    <div className="card p-6 flex items-center space-x-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Zap className="h-6 w-6" /></div>
                        <div>
                            <p className="text-xs font-medium text-zinc-400 uppercase">Tokens / Dollar</p>
                            <h3 className="text-2xl font-bold text-white">
                                {(metrics.requestCost > 0 ? metrics.totalTokens / metrics.requestCost : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="card p-6 space-y-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <h2 className="text-lg font-semibold text-white">Global Cost Controls</h2>

                    <div>
                        <label htmlFor="model-select" className="block text-sm text-zinc-400 mb-2">Target Architecture</label>
                        <select
                            id="model-select"
                            value={selectedModelId}
                            onChange={(e) => setSelectedModelId(e.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-purple-500"
                        >
                            {models.map((m) => (
                                <option key={m.id} value={m.id}>[{m.provider}] {m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="input-tokens" className="block text-sm text-zinc-400 mb-2">Avg Input Tokens</label>
                        <input
                            id="input-tokens"
                            type="number"
                            value={workload.inputTokens}
                            onChange={(e) => updateWorkloadParam('inputTokens', Math.max(0, Number(e.target.value)))}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="output-tokens" className="block text-sm text-zinc-400 mb-2">Avg Output Tokens</label>
                        <input
                            id="output-tokens"
                            type="number"
                            value={workload.outputTokens}
                            onChange={(e) => updateWorkloadParam('outputTokens', Math.max(0, Number(e.target.value)))}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="requests-per-day" className="block text-sm text-zinc-400 mb-2">Volume Requests / Day</label>
                        <input
                            id="requests-per-day"
                            type="number"
                            value={workload.requestsPerDay}
                            onChange={(e) => updateWorkloadParam('requestsPerDay', Math.max(0, Number(e.target.value)))}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                        />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <h2 className="text-lg font-semibold text-white mb-4">Granular Cost Analysis</h2>
                        {metrics && (
                            <div className="divide-y divide-zinc-800 text-sm">
                                <div className="flex justify-between py-3.5">
                                    <span className="text-zinc-400">Base Cost per Execution Request</span>
                                    <span className="font-mono text-white">${metrics.requestCost.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between py-3.5">
                                    <span className="text-zinc-400">Input Context Cost</span>
                                    <span className="font-mono text-white">${metrics.inputCost.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between py-3.5">
                                    <span className="text-zinc-400">Generation Token Cost</span>
                                    <span className="font-mono text-white">${metrics.outputCost.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between py-3.5">
                                    <span className="text-zinc-400">Context Cache Savings Offset</span>
                                    <span className="font-mono text-emerald-400">-${metrics.cacheCost.toFixed(6)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}