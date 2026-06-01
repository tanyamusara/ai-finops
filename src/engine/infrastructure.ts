import type {
    InfrastructureInput,
    InfrastructureResult,
} from '../types/finops'

export function calculateInfrastructureCost(
    input: InfrastructureInput,
): InfrastructureResult {
    const {
        gpuCount,

        hourlyRate,

        watts,

        electricityPrice,

        utilizationPercent,

        pue,
    } = input

    const hoursPerMonth =
        24 * 30

    const utilization =
        utilizationPercent / 100

    const effectiveHours =
        hoursPerMonth *
        utilization

    const gpuMonthlyCost =
        gpuCount *
        hourlyRate *
        effectiveHours

    const energyConsumptionKWh =
        (
            gpuCount *
            watts *
            effectiveHours *
            pue
        ) /
        1000

    const powerCostMonthly =
        energyConsumptionKWh *
        electricityPrice

    const totalMonthlyCost =
        gpuMonthlyCost +
        powerCostMonthly

    const annualCost =
        totalMonthlyCost * 12

    return {
        gpuMonthlyCost,

        powerCostMonthly,

        totalMonthlyCost,

        annualCost,

        effectiveHoursPerMonth:
            effectiveHours,

        energyConsumptionKWh,
    }
}

export function calculateCostPerMillionTokens(
    monthlyInfrastructureCost: number,
    monthlyTokens: number,
): number {
    if (monthlyTokens <= 0) {
        return 0
    }

    return (
        monthlyInfrastructureCost /
        monthlyTokens
    ) * 1_000_000
}

export function calculateIdleCost(
    totalMonthlyCost: number,
    utilizationPercent: number,
): number {
    const idlePercent =
        100 -
        utilizationPercent

    return (
        totalMonthlyCost *
        idlePercent
    ) / 100
}

export interface CloudVsOnPremResult {
    cloudMonthlyCost: number

    onPremMonthlyCost: number

    monthlySavings: number

    yearlySavings: number
}


