import type { AIModel } from '../../db/dexie'
import { calculateTokenCost } from '../../engine/tokenCost'
import type { CompareModelsInput, ModelComparison }
    from '../../types/finops'


export function compareModels(
    models: AIModel[],
    workload: CompareModelsInput,
): ModelComparison[] {
    return models
        .map((model) => {
            const cost =
                calculateTokenCost({
                    inputTokens:
                        workload.inputTokens,

                    outputTokens:
                        workload.outputTokens,

                    cachedTokens:
                        workload.cachedTokens ?? 0,

                    requestsPerDay:
                        workload.requestsPerDay,

                    inputCostPer1M:
                        model.inputCostPer1M,

                    outputCostPer1M:
                        model.outputCostPer1M,

                    cacheReadCostPer1M:
                        model.cacheReadCostPer1M,

                    batchDiscountPercent:
                        model.batchDiscountPercent,
                })

            return {
                modelId: model.id,

                provider: model.provider,

                modelName: model.name,

                requestCost: cost.requestCost,

                dailyCost: cost.dailyCost,

                monthlyCost: cost.monthlyCost,

                yearlyCost: cost.yearlyCost,

                latencyMs: model.avgLatencyMs,
            }
        })
        .sort(
            (a, b) =>
                a.monthlyCost -
                b.monthlyCost,
        )
}