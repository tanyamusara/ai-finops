import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../db/dexie'

import { useDashboardStore } from '../store/dashboardStore'

export function ModelSelector() {
    const models = useLiveQuery(
        () => db.models.toArray(),
        [],
    )

    const selectedModelId =
        useDashboardStore(
            (s) => s.selectedModelId,
        )

    const setSelectedModelId =
        useDashboardStore(
            (s) => s.setSelectedModelId,
        )

    return (
        <div className="card p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    Model Selection
                </h2>
            </div>

            <label htmlFor="model-selector" className="sr-only">
                Select model
            </label>
            <select
                id="model-selector"
                value={selectedModelId}
                onChange={(e) =>
                    setSelectedModelId(
                        e.target.value,
                    )
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
            >
                {models?.map((model) => (
                    <option
                        key={model.id}
                        value={model.id}
                    >
                        {model.provider} —{' '}
                        {model.name}
                    </option>
                ))}
            </select>
        </div>
    )
}