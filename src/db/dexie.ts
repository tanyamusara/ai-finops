import Dexie, { type Table } from 'dexie'

// AI Models

export interface AIModel {
    id: string

    provider: string
    name: string

    contextWindow: number

    inputCostPer1M: number
    outputCostPer1M: number

    cacheReadCostPer1M?: number
    cacheWriteCostPer1M?: number

    batchDiscountPercent?: number

    avgLatencyMs?: number

    tokenizer?: string

    createdAt: number
}

// Scenarios

export interface Scenario {
    id: string

    name: string

    workloadType: string

    requestsPerDay: number

    avgInputTokens: number
    avgOutputTokens: number
    avgCachedTokens?: number

    createdAt: number
}

// Infrastructure profiles

export interface InfrastructureProfile {
    id: string

    provider: string

    gpu: string

    hourlyRate: number

    vramGB: number

    watts: number

    interconnect?: string

    createdAt: number
}

// Saved simulations

export interface SimulationRun {
    id: string

    scenarioId: string

    modelId: string

    totalCost: number

    totalTokens: number

    avgLatencyMs: number

    createdAt: number
}

// database

class AppDatabase extends Dexie {
    models!: Table<AIModel>

    scenarios!: Table<Scenario>

    infrastructureProfiles!: Table<InfrastructureProfile>

    simulations!: Table<SimulationRun>

    constructor() {
        super('ai-finops-platform')

        this.version(1).stores({
            models: 'id, provider, name',

            scenarios:
                'id, workloadType, name',

            infrastructureProfiles:
                'id, provider, gpu',

            simulations:
                'id, scenarioId, modelId',
        })
    }
}

export const db = new AppDatabase()