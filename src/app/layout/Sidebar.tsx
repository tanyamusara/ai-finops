import {
    Activity,
    Box,
    Cpu,
    LayoutDashboard,
    Wallet,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

const links = [
    {
        label: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        label: 'Pricing',
        href: '/pricing',
        icon: Wallet,
    },
    {
        label: 'Models',
        href: '/models',
        icon: Box,
    },
    {
        label: 'Simulations',
        href: '/simulations',
        icon: Activity,
    },
    {
        label: 'Infrastructure',
        href: '/infrastructure',
        icon: Cpu,
    },
]

export function Sidebar() {
    return (
        <aside className="w-72 border-r border-zinc-800 bg-[#18181b] p-4">
            <div className="mb-8 px-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    AI FinOps Tokenomics
                </h1>

                <p className="mt-1 text-sm text-zinc-400">
                    Token Economics Platform
                </p>
            </div>

            <nav className="space-y-2">
                {links.map((link) => {
                    const Icon = link.icon

                    return (
                        <NavLink
                            key={link.href}
                            to={link.href}
                            className={({ isActive }) =>
                                [
                                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors',
                                    isActive
                                        ? 'bg-zinc-800 text-white'
                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
                                ].join(' ')
                            }
                        >
                            <Icon size={18} />

                            <span>{link.label}</span>
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    )
}