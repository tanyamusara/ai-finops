import { useMemo } from 'react'

import { useLiveQuery } from 'dexie-react-hooks';

import { db } from '../../db/dexie';

import { calculateCost } from '../../engine/pricing/calculateCost';

import { useDashboardStore } from '../../store/dashboardStore';

import { KPIGrid } from '../../components/ui/dashboard/KPIgrid';
import { ModelSelector } from '../../components/ui/dashboard/ModelSelector';
import { WorkloadControls } from '../../components/ui/dashboard/WorkloadControls';

export default function DashboardPage() {
    const workload =
        useDashboardStore(
            (s) => s.workload,
        )

    const selectedModelId =
        useDashboardStore(
            (s) => s.selectedModelId,
        )

    const models = useLiveQuery(
        () => db.models.toArray(),
        [],
    )

    const selectedModel = useMemo(
        () =>
            models?.find(
                (m) =>
                    m.id === selectedModelId,
            ),
        [models, selectedModelId],
    )

    const metrics = useMemo(() => {
        if (!selectedModel) {
            return null
        }

        return calculateCost({
            ...workload,

            inputCostPer1M:
                selectedModel.inputCostPer1M,

            outputCostPer1M:
                selectedModel.outputCostPer1M,

            cacheCostPer1M:
                selectedModel.cacheReadCostPer1M,

            batchDiscountPercent:
                selectedModel.batchDiscountPercent,
        })
    }, [selectedModel, workload])

    if (!metrics) {
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard
                </h1>

                <p className="mt-2 text-zinc-400">
                    AI token economics and infrastructure overview
                </p>
            </div>

            <KPIGrid metrics={metrics} />

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-4">
                    <ModelSelector />

                    <WorkloadControls />
                </div>

                <div className="card col-span-2 p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Cost Breakdown
                    </h2>

                    <div className="space-y-4 text-sm">
                        <Metric
                            label="Cost / Request"
                            value={`$${metrics.costPerRequest.toFixed(
                                4,
                            )}`}
                        />

                        <Metric
                            label="Total Tokens"
                            value={metrics.totalTokens.toLocaleString()}
                        />

                        <Metric
                            label="Tokens / Dollar"
                            value={metrics.tokensPerDollar.toFixed(
                                0,
                            )}
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

function Metric({
    label,
    value,
}: MetricProps) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 p-4">
            <div className="text-zinc-400">
                {label}
            </div>

            <div className="text-lg font-semibold">
                {value}
            </div>
        </div>
    )
}