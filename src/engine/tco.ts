import type {
    TCOInput,
    TCOResult,
    BreakEvenResult
} from '../types/finops'

export function calculateTCO(
    input: TCOInput,
): TCOResult {
    const {
        hardwareCost,

        lifespanYears,

        yearlyPowerCost,

        yearlyColocationCost,

        yearlyMaintenanceCost,
    } = input

    const yearlyDepreciation =
        hardwareCost /
        lifespanYears

    const yearlyCost =
        yearlyDepreciation +
        yearlyPowerCost +
        yearlyColocationCost +
        yearlyMaintenanceCost

    const totalCostOverLife =
        yearlyCost *
        lifespanYears

    return {
        yearlyDepreciation,

        yearlyCost,

        totalCostOverLife,
    }
}

export function calculateMonthlyTCO(
    input: TCOInput,
): number {
    const result =
        calculateTCO(input)

    return (
        result.yearlyCost /
        12
    )
}

export function calculateBreakEven(
    hardwareInvestment: number,
    cloudMonthlyCost: number,
    onPremMonthlyCost: number,
): BreakEvenResult {
    const monthlySavings =
        cloudMonthlyCost -
        onPremMonthlyCost

    if (monthlySavings <= 0) {
        return {
            breakEvenMonths: Infinity,

            cloudSpendAtBreakEven: Infinity,
        }
    }

    const breakEvenMonths =
        hardwareInvestment /
        monthlySavings

    return {
        breakEvenMonths,

        cloudSpendAtBreakEven:
            breakEvenMonths *
            cloudMonthlyCost,
    }
}
