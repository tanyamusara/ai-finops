export interface PricingInput {
  inputTokens: number
  outputTokens: number
  cachedTokens?: number

  requestsPerDay: number

  inputCostPer1M: number
  outputCostPer1M: number

  cacheCostPer1M?: number

  batchDiscountPercent?: number
}

export interface PricingResult {
  costPerRequest: number
  dailyCost: number
  monthlyCost: number
  annualCost: number

  totalTokens: number
  tokensPerDollar: number
}

export function calculateCost(
  input: PricingInput,
): PricingResult {
  const inputCost =
    (input.inputTokens / 1_000_000) *
    input.inputCostPer1M

  const outputCost =
    (input.outputTokens / 1_000_000) *
    input.outputCostPer1M

  const cacheCost =
    ((input.cachedTokens ?? 0) /
      1_000_000) *
    (input.cacheCostPer1M ?? 0)

  let requestCost =
    inputCost +
    outputCost +
    cacheCost

  if (input.batchDiscountPercent) {
    requestCost *=
      1 -
      input.batchDiscountPercent /
        100
  }

  const dailyCost =
    requestCost *
    input.requestsPerDay

  const monthlyCost =
    dailyCost * 30

  const annualCost =
    dailyCost * 365

  const totalTokens =
    input.inputTokens +
    input.outputTokens

  const tokensPerDollar =
    totalTokens / requestCost

  return {
    costPerRequest: requestCost,
    dailyCost,
    monthlyCost,
    annualCost,
    totalTokens,
    tokensPerDollar,
  }
}