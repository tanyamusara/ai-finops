import { db } from './dexie'

export async function seedDatabase() {
    await seedModels()

    await seedInfrastructure()

    await seedScenarios()
}

// Models

async function seedModels() {
    const count =
        await db.models.count()

    if (count > 0) {
        return
    }

    await db.models.bulkAdd([
        {
            id: 'gpt-4o',

            provider: 'OpenAI',
            name: 'GPT-4o',

            contextWindow: 128000,

            inputCostPer1M: 5,
            outputCostPer1M: 15,

            cacheReadCostPer1M: 2.5,

            avgLatencyMs: 850,

            tokenizer: 'cl100k_base',

            createdAt: Date.now(),
        },

        {
            id: 'gpt-4.1-mini',

            provider: 'OpenAI',
            name: 'GPT-4.1 Mini',

            contextWindow: 128000,

            inputCostPer1M: 0.4,
            outputCostPer1M: 1.6,

            cacheReadCostPer1M: 0.2,

            avgLatencyMs: 420,

            tokenizer: 'cl100k_base',

            createdAt: Date.now(),
        },

        {
            id: 'claude-sonnet-4',

            provider: 'Anthropic',
            name: 'Claude Sonnet 4',

            contextWindow: 200000,

            inputCostPer1M: 3,
            outputCostPer1M: 15,

            avgLatencyMs: 980,

            tokenizer: 'claude',

            createdAt: Date.now(),
        },

        {
            id: 'claude-haiku-3.5',

            provider: 'Anthropic',
            name: 'Claude Haiku 3.5',

            contextWindow: 200000,

            inputCostPer1M: 0.8,
            outputCostPer1M: 4,

            avgLatencyMs: 520,

            tokenizer: 'claude',

            createdAt: Date.now(),
        },

        {
            id: 'gemini-2.5-pro',

            provider: 'Google',
            name: 'Gemini 2.5 Pro',

            contextWindow: 1000000,

            inputCostPer1M: 3.5,
            outputCostPer1M: 10,

            avgLatencyMs: 1200,

            tokenizer: 'sentencepiece',

            createdAt: Date.now(),
        },

        {
            id: 'deepseek-r1',

            provider: 'DeepSeek',
            name: 'DeepSeek R1',

            contextWindow: 128000,

            inputCostPer1M: 1,
            outputCostPer1M: 4,

            avgLatencyMs: 1400,

            tokenizer: 'bpe',

            createdAt: Date.now(),
        },

        {
            id: 'grok-3',

            provider: 'xAI',
            name: 'Grok 3',

            contextWindow: 128000,

            inputCostPer1M: 5,
            outputCostPer1M: 15,

            avgLatencyMs: 920,

            tokenizer: 'grok',

            createdAt: Date.now(),
        },

        {
            id: 'mistral-large',

            provider: 'Mistral',
            name: 'Mistral Large',

            contextWindow: 128000,

            inputCostPer1M: 2,
            outputCostPer1M: 6,

            avgLatencyMs: 760,

            tokenizer: 'mistral',

            createdAt: Date.now(),
        },
    ])
}

// Infrastructure

async function seedInfrastructure() {
    const count =
        await db.infrastructureProfiles.count()

    if (count > 0) {
        return
    }

    await db.infrastructureProfiles.bulkAdd([
        {
            id: 'h100',

            provider: 'NVIDIA',
            gpu: 'H100 SXM',

            hourlyRate: 2.95,

            vramGB: 80,

            watts: 700,

            interconnect: 'NVLink',

            createdAt: Date.now(),
        },

        {
            id: 'h200',

            provider: 'NVIDIA',
            gpu: 'H200',

            hourlyRate: 3.95,

            vramGB: 141,

            watts: 700,

            interconnect: 'NVLink',

            createdAt: Date.now(),
        },

        {
            id: 'a100-80gb',

            provider: 'NVIDIA',
            gpu: 'A100 80GB',

            hourlyRate: 1.99,

            vramGB: 80,

            watts: 400,

            interconnect: 'NVLink',

            createdAt: Date.now(),
        },

        {
            id: 'l40s',

            provider: 'NVIDIA',
            gpu: 'L40S',

            hourlyRate: 1.2,

            vramGB: 48,

            watts: 350,

            interconnect: 'PCIe',

            createdAt: Date.now(),
        },

        {
            id: 'mi300x',

            provider: 'AMD',
            gpu: 'MI300X',

            hourlyRate: 2.8,

            vramGB: 192,

            watts: 750,

            interconnect: 'Infinity Fabric',

            createdAt: Date.now(),
        },
    ])
}

// Scenarios

async function seedScenarios() {
    const count =
        await db.scenarios.count()

    if (count > 0) {
        return
    }

    await db.scenarios.bulkAdd([
        {
            id: 'saas-chatbot',

            name: 'SaaS Support Chatbot',

            workloadType: 'chatbot',

            requestsPerDay: 100000,

            avgInputTokens: 4000,
            avgOutputTokens: 1200,
            avgCachedTokens: 1000,

            createdAt: Date.now(),
        },

        {
            id: 'enterprise-rag',

            name: 'Enterprise RAG',

            workloadType: 'rag',

            requestsPerDay: 50000,

            avgInputTokens: 12000,
            avgOutputTokens: 2500,
            avgCachedTokens: 3000,

            createdAt: Date.now(),
        },

        {
            id: 'coding-copilot',

            name: 'Coding Assistant',

            workloadType: 'coding',

            requestsPerDay: 200000,

            avgInputTokens: 8000,
            avgOutputTokens: 4000,
            avgCachedTokens: 1500,

            createdAt: Date.now(),
        },

        {
            id: 'autonomous-agent',

            name: 'Autonomous AI Agent',

            workloadType: 'agent',

            requestsPerDay: 25000,

            avgInputTokens: 20000,
            avgOutputTokens: 8000,
            avgCachedTokens: 5000,

            createdAt: Date.now(),
        },
    ])
}