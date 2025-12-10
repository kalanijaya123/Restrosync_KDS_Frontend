// src/pages/ExpediteKDS.tsx
import React from 'react'
import { BellRing } from 'lucide-react'
import { OrderCard } from '../components/OrderCard'
import { useOrders } from '../hooks/useOrders'
import { Layout } from '../components/Layout'

const ExpediteKDS = () => {
    const hook = useOrders()
    const ordersRaw = hook.orders ?? []
    const orders = Array.isArray(ordersRaw) ? ordersRaw : []
    const updateStatus = typeof hook.updateStatus === 'function' ? hook.updateStatus : () => { }

    const readyOrders = orders.filter((o: any) => o?.status === 'ready')

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="py-4">
                    <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
                        <BellRing className="w-8 h-8 text-pink-400" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EXPEDITE</h1>
                    </div>
                </header>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {readyOrders.map((order: any) => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-emerald-300 dark:border-emerald-700">
                                <OrderCard order={order as any} onNext={() => updateStatus(order.id, 'served')} />
                                <button
                                    onClick={() => updateStatus(order.id, 'served')}
                                    className="mt-3 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg shadow"
                                >
                                    SERVE NOW
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ExpediteKDS