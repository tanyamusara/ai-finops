export function Topbar() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-[#18181b] px-6">
            <div>
                <h2 className="text-lg font-semibold">
                    AI FinOps Tokenomics
                </h2>
            </div>

            <div className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-400">
                Local Mode
            </div>
        </header>
    )
}