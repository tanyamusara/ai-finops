export interface TokenCostInput {
    inputTokens: number
    outputTokens: number
    cachedTokens: number

    requestsPerDay: number

    inputCostPer1M: number
    outputCostPer1M: number

    cacheReadCostPer1M?: number

    batchDiscountPercent?: number
}

export interface TokenCostResult {
    requestCost: number

    dailyCost: number
    monthlyCost: number
    yearlyCost: number

    inputCost: number
    outputCost: number
    cacheCost: number

    totalTokens: number
}

export interface InfrastructureInput {
    gpuCount: number,

    hourlyRate: number,

    watts: number,

    electricityPrice: number,

    utilizationPercent: number,

    pue: number
}

export interface InfrastructureResult {
    gpuMonthlyCost: number,

    powerCostMonthly: number,

    totalMonthlyCost: number,

    annualCost: number,

    effectiveHoursPerMonth: number,

    energyConsumptionKWh: number
}

export interface TCOInput {
    hardwareCost: number,

    lifespanYears: number,

    yearlyPowerCost: number,

    yearlyColocationCost: number,

    yearlyMaintenanceCost: number
}

export interface TCOResult {
    yearlyDepreciation: number,

    yearlyCost: number,

    totalCostOverLife: number
}


export interface ScenarioCalculation {
    scenarioId: string,

    modelId: string,

    totalMonthlyCost: number,

    totalYearlyCost: number,

    requestsPerDay: number,

    totalTokensPerDay: number
}

export interface AIModel {
    id: string,

    provider: string,

    name: string,

    contextWindow: number,

    inputCostPer1M: number,
    outputCostPer1M: number,

    cacheReadCostPer1M?: number,
    cacheWriteCostPer1M?: number,

    batchDiscountPercent?: number,

    avgLatencyMs?: number,

    tokenizer?: string,

    mmluScore?: number,

    reasoningScore?: number,

    maxOutputTokens?: number,

    supportsBatch?: boolean,

    supportsCaching?: boolean,

    createdAt: number
}

export interface InfrastructureProfile {
    id: string,

    provider: string,

    gpu: string,

    hourlyRate: number,

    vramGB: number,

    watts: number,

    interconnect?: string,

    purchasePrice?: number,

    fp16Tflops?: number,

    memoryBandwidthGBs?: number,

    createdAt: number
}

export interface BreakEvenResult {
    breakEvenMonths: number

    cloudSpendAtBreakEven: number
}

export interface ROIResult {
    savings: number

    roiPercent: number
}

export interface ModelComparison {
    modelId: string

    provider: string

    modelName: string

    requestCost: number

    dailyCost: number

    monthlyCost: number

    yearlyCost: number

    latencyMs?: number
}

export interface CompareModelsInput {
    inputTokens: number
    outputTokens: number
    cachedTokens?: number
    requestsPerDay: number
}