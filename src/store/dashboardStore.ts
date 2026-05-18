import { create } from 'zustand'

interface WorkloadConfig {
    inputTokens: number
    outputTokens: number
    cachedTokens: number

    requestsPerDay: number
}

interface DashboardStore {
    workload: WorkloadConfig

    selectedModelId: string

    setWorkload: (
        workload: Partial<WorkloadConfig>,
    ) => void

    setSelectedModelId: (
        id: string,
    ) => void
}

export const useDashboardStore =
    create<DashboardStore>((set) => ({
        workload: {
            inputTokens: 4000,
            outputTokens: 1200,
            cachedTokens: 1000,

            requestsPerDay: 100000,
        },

        selectedModelId: 'gpt-4o',

        setWorkload: (workload) =>
            set((state) => ({
                workload: {
                    ...state.workload,
                    ...workload,
                },
            })),

        setSelectedModelId: (
            selectedModelId,
        ) =>
            set({
                selectedModelId,
            }),
    }))