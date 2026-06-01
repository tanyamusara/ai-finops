import { useMemo, useState } from 'react'
import { calculateInfrastructureCost, calculateIdleCost } from '../../engine/infrastructure'
import { calculateTCO, calculateBreakEven } from '../../engine/tco'
import { Cpu, Thermometer, ShieldAlert, BarChart3 } from 'lucide-react'

export default function InfrastructurePage() {
    const [gpuCount, setGpuCount] = useState<number>(8)
    const [hourlyRate, setHourlyRate] = useState<number>(2.20) 
    const [utilizationPercent, setUtilizationPercent] = useState<number>(75)

    const [watts, setWatts] = useState<number>(700) 
    const [electricityPrice, setElectricityPrice] = useState<number>(0.12) 
    const [pue, setPue] = useState<number>(1.4) 

    const [hardwareCost, setHardwareCost] = useState<number>(250000) 
    const [lifespanYears, setLifespanYears] = useState<number>(3)
    const [yearlyColo, setYearlyColo] = useState<number>(12000)
    const [yearlyMaint, setYearlyMaint] = useState<number>(8000)

    const infraResults = useMemo(() => {
        return calculateInfrastructureCost({
            gpuCount,
            hourlyRate,
            watts,
            electricityPrice,
            utilizationPercent,
            pue,
        })
    }, [gpuCount, hourlyRate, watts, electricityPrice, utilizationPercent, pue])

    const tcoResults = useMemo(() => {
        return calculateTCO({
            hardwareCost,
            lifespanYears,
            yearlyPowerCost: (infraResults.powerCostMonthly * 12),
            yearlyColocationCost: yearlyColo,
            yearlyMaintenanceCost: yearlyMaint,
        })
    }, [hardwareCost, lifespanYears, infraResults.powerCostMonthly, yearlyColo, yearlyMaint])

    const breakEvenResults = useMemo(() => {
        const monthlyOnPrem = (tcoResults.yearlyCost / 12)
        return calculateBreakEven(hardwareCost, infraResults.gpuMonthlyCost, monthlyOnPrem)
    }, [hardwareCost, infraResults.gpuMonthlyCost, tcoResults.yearlyCost])

    const idleWaste = useMemo(() => {
        return calculateIdleCost(infraResults.totalMonthlyCost, utilizationPercent)
    }, [infraResults.totalMonthlyCost, utilizationPercent])

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Infrastructure & Bare-Metal TCO</h1>
                <p className="mt-2 text-zinc-400">
                    Compare private clusters with cloud instances using power utilization matrices and break-even timelines.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-6 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <Cpu className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Monthly OpEx (Cloud Base)</p>
                        <h3 className="text-2xl font-bold text-white">${infraResults.totalMonthlyCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                        <Thermometer className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Power Footprint</p>
                        <h3 className="text-2xl font-bold text-white">{Math.round(infraResults.energyConsumptionKWh).toLocaleString()} kWh/mo</h3>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Idle Allocation Waste</p>
                        <h3 className="text-2xl font-bold text-white">${idleWaste.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>
                <div className="card p-6 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Amortized Ownership / Mo</p>
                        <h3 className="text-2xl font-bold text-white">${(tcoResults.yearlyCost / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6 lg:col-span-1">
                    <div className="card p-6 space-y-4">
                        <h3 className="text-md font-semibold text-white">Compute & Environment Profile</h3>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Accelerator Core Count (GPUs)</label>
                            <input
                                type="number"
                                value={gpuCount}
                                onChange={(e) => setGpuCount(Math.max(1, Number(e.target.value)))}
                                placeholder="e.g. 8"
                                title="Accelerator Core Count (GPUs)"
                                aria-label="Accelerator Core Count"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Equivalent Cloud Base Hourly Rate ($)</label>
                            <input
                                type="number" step="0.01"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                                placeholder="e.g. 2.20"
                                title="Equivalent Cloud Base Hourly Rate"
                                aria-label="Equivalent Cloud Base Hourly Rate"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Draw Capacity Per Cluster (Watts)</label>
                            <input
                                type="number"
                                value={watts}
                                onChange={(e) => setWatts(Math.max(0, Number(e.target.value)))}
                                placeholder="e.g. 700"
                                title="Draw Capacity Per Cluster (Watts)"
                                aria-label="Draw Capacity Per Card"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Electricity Rate per kWh ($)</label>
                            <input
                                type="number" step="0.01"
                                value={electricityPrice}
                                onChange={(e) => setElectricityPrice(Math.max(0, Number(e.target.value)))}
                                placeholder="e.g. 0.12"
                                title="Electricity Rate per kWh"
                                aria-label="Electricity Rate per kWh"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Data Center PUE Ratio</label>
                            <input
                                type="number" step="0.05"
                                value={pue}
                                onChange={(e) => setPue(Math.max(1, Number(e.target.value)))}
                                placeholder="e.g. 1.4"
                                title="Data Center PUE Ratio"
                                aria-label="Data Center PUE Ratio"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                <label>Cluster Sustained Utilization</label>
                                <span className="text-purple-400 font-semibold">{utilizationPercent}%</span>
                            </div>
                            <input
                                type="range" min="10" max="100" value={utilizationPercent}
                                onChange={(e) => setUtilizationPercent(Number(e.target.value))}
                                title="Cluster Sustained Utilization"
                                aria-label="Cluster Sustained Utilization"
                                className="w-full accent-purple-500 h-1.5"
                            />
                        </div>
                    </div>

                    <div className="card p-6 space-y-4">
                        <h3 className="text-md font-semibold text-white">Private Hardware CAPEX</h3>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Initial Cluster Procurement Investment ($)</label>
                            <input
                                type="number" step="5000"
                                value={hardwareCost}
                                onChange={(e) => setHardwareCost(Math.max(0, Number(e.target.value)))}
                                placeholder="e.g. 250000"
                                title="Initial Cluster Procurement Investment"
                                aria-label="Initial Cluster Procurement Investment"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Hardware Lifespan (Years)</label>
                            <input
                                type="number" value={lifespanYears}
                                onChange={(e) => setLifespanYears(Math.max(1, Number(e.target.value)))}
                                placeholder="e.g. 3"
                                title="Hardware Lifespan in Years"
                                aria-label="Hardware Lifespan in Years"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Colo/yr ($)</label>
                                <input
                                    type="number" value={yearlyColo}
                                    onChange={(e) => setYearlyColo(Math.max(0, Number(e.target.value)))}
                                    placeholder="e.g. 12000"
                                    title="Colocation per year"
                                    aria-label="Colocation per year"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Maint/yr ($)</label>
                                <input
                                    type="number" value={yearlyMaint}
                                    onChange={(e) => setYearlyMaint(Math.max(0, Number(e.target.value)))}
                                    placeholder="e.g. 8000"
                                    title="Maintenance per year"
                                    aria-label="Maintenance per year"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Ownership Analysis & Amortization Schedules</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-3">
                                <h4 className="text-zinc-400 font-medium border-b border-zinc-800 pb-2">Operational Power Overhead</h4>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Pure Accelerator Cost:</span>
                                    <span className="font-mono text-white">${infraResults.gpuMonthlyCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Facilities Power Bill:</span>
                                    <span className="font-mono text-white">${infraResults.powerCostMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Effective Server runtime:</span>
                                    <span className="font-mono text-zinc-300">{Math.round(infraResults.effectiveHoursPerMonth)} hrs/mo</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-zinc-400 font-medium border-b border-zinc-800 pb-2">Amortized Capital Costs (On-Premises)</h4>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Hardware Depreciation:</span>
                                    <span className="font-mono text-white">${Math.round(tcoResults.yearlyDepreciation / 12).toLocaleString()}/mo</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Total Fully-Burdened Cost:</span>
                                    <span className="font-mono text-purple-400 font-semibold">${Math.round(tcoResults.yearlyCost).toLocaleString()}/yr</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Lifespan Lifecycle TCO:</span>
                                    <span className="font-mono text-white">${Math.round(tcoResults.totalCostOverLife).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 border-emerald-500/20 bg-linear-to-br from-emerald-950/10 to-zinc-900/40">
                        <h3 className="text-md font-semibold text-emerald-400 mb-2">Break-Even & Payback Assessment</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            {breakEvenResults.breakEvenMonths === Infinity || breakEvenResults.breakEvenMonths < 0 ? (
                                "Cloud infrastructure rates are more competitive than the capital depreciation of this hardware setting at these parameters. Procurement is currently high risk."
                            ) : (
                                <>
                                    Based on current usage profiles, hardware acquisition pays for itself after{' '}
                                    <span className="text-white font-bold underline decoration-emerald-400">
                                        {breakEvenResults.breakEvenMonths.toFixed(1)} months
                                    </span>{' '}
                                    compared to equivalent rental. Total projected cloud spend during this period would have been{' '}
                                    <span className="font-mono text-white font-semibold">
                                        ${Math.round(breakEvenResults.cloudSpendAtBreakEven).toLocaleString()}
                                    </span>.
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}