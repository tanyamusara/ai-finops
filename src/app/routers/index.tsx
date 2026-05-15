import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '../layout/AppLayout'

import DashboardPage from '../../features/dashboard/DashboardPage'
import PricingPage from '../../features/pricing/PricingPage'
import InfrastructurePage from '../../features/infrastructure/InfrastructurePage'
import SimulationsPage from '../../features/simulations/SimulationPages'
import ModelsPage from '../../features/models/ModelsPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'pricing',
                element: <PricingPage />,
            },
            {
                path: 'infrastructure',
                element: <InfrastructurePage />,
            },
            {
                path: 'simulations',
                element: <SimulationsPage />,
            },
            {
                path: 'models',
                element: <ModelsPage />,
            },
        ],
    },
])