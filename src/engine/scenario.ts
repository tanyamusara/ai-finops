import type {
    AIModel,
    Scenario,
} from '../db/dexie'

import type {
    ScenarioCalculation,
} from '../types/finops'

import { calculateTokenCost }
    from './tokenCost'

export function calculateScenario(
    scenario: Scenario,
    model: AIModel,
): ScenarioCalculation {
    const result =
        calculateTokenCost({
            inputTokens:
                scenario.avgInputTokens,

            outputTokens:
                scenario.avgOutputTokens,

            cachedTokens:
                scenario.avgCachedTokens ?? 0,

            requestsPerDay:
                scenario.requestsPerDay,

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
        scenarioId: scenario.id,

        modelId: model.id,

        totalMonthlyCost:
            result.monthlyCost,

        totalYearlyCost:
            result.yearlyCost,

        requestsPerDay:
            scenario.requestsPerDay,

        totalTokensPerDay:
            (
                scenario.avgInputTokens +
                scenario.avgOutputTokens +
                (scenario.avgCachedTokens ?? 0)
            ) *
            scenario.requestsPerDay,
    }
}

export function compareScenarioAcrossModels(
    scenario: Scenario,
    models: AIModel[],
): ScenarioCalculation[] {
    return models.map(model =>
        calculateScenario(
            scenario,
            model,
        ),
    )
}

export function rankScenarioCosts(
    scenario: Scenario,
    models: AIModel[],
): ScenarioCalculation[] {
    return compareScenarioAcrossModels(
        scenario,
        models,
    ).sort(
        (a, b) =>
            a.totalMonthlyCost -
            b.totalMonthlyCost,
    )
}