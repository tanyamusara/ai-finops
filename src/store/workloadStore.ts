import { create } from 'zustand'

interface WorkloadState {
    inputTokens: number
    outputTokens: number
    cachedTokens: number

    requestsPerDay: number

    setInputTokens: (
        value: number,
    ) => void

    setOutputTokens: (
        value: number,
    ) => void

    setCachedTokens: (
        value: number,
    ) => void

    setRequestsPerDay: (
        value: number,
    ) => void
}

export const useWorkloadStore =
    create<WorkloadState>((set) => ({
        inputTokens: 4000,

        outputTokens: 1200,

        cachedTokens: 1000,

        requestsPerDay: 100000,

        setInputTokens: (
            value,
        ) =>
            set({
                inputTokens: value,
            }),

        setOutputTokens: (
            value,
        ) =>
            set({
                outputTokens: value,
            }),

        setCachedTokens: (
            value,
        ) =>
            set({
                cachedTokens: value,
            }),

        setRequestsPerDay: (
            value,
        ) =>
            set({
                requestsPerDay: value,
            }),
    }))