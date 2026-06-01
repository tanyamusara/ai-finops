import type {
    TokenCostInput,
    TokenCostResult,
} from '../types/finops'

export function calculateTokenCost(
    input: TokenCostInput,
): TokenCostResult {
    const {
        inputTokens,
        outputTokens,
        cachedTokens,

        requestsPerDay,

        inputCostPer1M,
        outputCostPer1M,

        cacheReadCostPer1M = 0,

        batchDiscountPercent = 0,
    } = input

    const inputCost =
        (inputTokens / 1_000_000) *
        inputCostPer1M

    const outputCost =
        (outputTokens / 1_000_000) *
        outputCostPer1M

    const cacheCost =
        (cachedTokens / 1_000_000) *
        cacheReadCostPer1M

    let requestCost =
        inputCost +
        outputCost +
        cacheCost

    if (batchDiscountPercent > 0) {
        requestCost =
            requestCost *
            (1 - batchDiscountPercent / 100)
    }

    const dailyCost =
        requestCost *
        requestsPerDay

    const monthlyCost =
        dailyCost * 30

    const yearlyCost =
        dailyCost * 365

    return {
        requestCost,

        dailyCost,
        monthlyCost,
        yearlyCost,

        inputCost,
        outputCost,
        cacheCost,

        totalTokens:
            inputTokens +
            outputTokens +
            cachedTokens,
    }
}