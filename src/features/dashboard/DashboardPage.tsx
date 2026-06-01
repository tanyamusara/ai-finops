import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../../db/dexie'
import { calculateTokenCost } from '../../engine/tokenCost'
import { useDashboardStore } from '../../store/dashboardStore'

import { KPIGrid } from '../../components/KPIGrid'
import { ModelSelector } from '../../components/ModelSelector'
import { WorkloadControls } from '../../components/WorkloadControls'

export default function DashboardPage() {
    const workload = useDashboardStore((s) => s.workload)
    const selectedModelId = useDashboardStore((s) => s.selectedModelId)

    const modelsRaw = useLiveQuery(() => db.models.toArray(), [])

    const models = useMemo(() => modelsRaw ?? [], [modelsRaw])

    const selectedModel = useMemo(() => {
        return models.find((m) => m.id === selectedModelId)
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
            batchDiscountPercent: selectedModel.batchDiscountPercent ?? 0,
        })
    }, [selectedModel, workload])

    if (modelsRaw === undefined) {
        return (
            <div className="p-6 text-zinc-400 animate-pulse">
                Loading infrastructure variables...
            </div>
        )
    }

    if (!selectedModel || !metrics) {
        return (
            <div className="space-y-6 p-6">
                <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
                    <p className="text-zinc-400">No matching model or engine configuration found.</p>
                    <div className="mt-4 max-w-xs mx-auto">
                        <ModelSelector />
                    </div>
                </div>
            </div>
        )
    }

    const tokensPerDollar =
        metrics.requestCost > 0
            ? metrics.totalTokens / metrics.requestCost
            : 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Dashboard
                </h1>
                <p className="mt-2 text-zinc-400">
                    AI token economics and infrastructure overview
                </p>
            </div>

            <KPIGrid
                metrics={{
                    dailyCost: metrics.dailyCost,
                    monthlyCost: metrics.monthlyCost,
                    annualCost: metrics.yearlyCost,
                    tokensPerDollar,
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4 lg:col-span-1">
                    <ModelSelector />
                    <WorkloadControls />
                </div>

                <div className="card lg:col-span-2 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                        Cost Breakdown
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <Metric
                            label="Cost / Request"
                            value={`$${metrics.requestCost.toFixed(6)}`}
                        />
                        <Metric
                            label="Input Cost"
                            value={`$${metrics.inputCost.toFixed(6)}`}
                        />
                        <Metric
                            label="Output Cost"
                            value={`$${metrics.outputCost.toFixed(6)}`}
                        />
                        <Metric
                            label="Cache Saving Offset"
                            value={`$${metrics.cacheCost.toFixed(6)}`}
                        />
                        <Metric
                            label="Daily Volume Spend"
                            value={`$${metrics.dailyCost.toFixed(2)}`}
                        />
                        <Metric
                            label="Monthly Run Rate"
                            value={`$${metrics.monthlyCost.toFixed(2)}`}
                        />
                        <Metric
                            label="Yearly Aggregated TCO"
                            value={`$${metrics.yearlyCost.toFixed(2)}`}
                        />
                        <Metric
                            label="Total Handled Tokens"
                            value={metrics.totalTokens.toLocaleString()}
                        />
                    </div>

                    <div className="mt-4 md:col-span-2">
                        <Metric
                            label="Efficiency (Tokens / Dollar)"
                            value={tokensPerDollar.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

interface MetricProps {
    label: string
    value: string
}

function Metric({ label, value }: MetricProps) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="text-zinc-400 font-medium">
                {label}
            </div>
            <div className="text-md font-mono font-semibold text-white">
                {value}
            </div>
        </div>
    )
}