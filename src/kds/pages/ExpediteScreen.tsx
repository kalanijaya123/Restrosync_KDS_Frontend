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
            <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white">
                <header className="py-4">
                    <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
                        <BellRing className="w-8 h-8 text-pink-400" />
                        <h1 className="text-2xl font-bold">EXPEDITE</h1>
                    </div>
                </header>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {readyOrders.map((order: any) => (
                            <div key={order.id} className="bg-gradient-to-br from-emerald-900/90 to-purple-900/90 rounded-xl p-4 shadow-md border border-emerald-600">
                                <OrderCard order={order as any} onNext={() => updateStatus(order.id, 'served')} />
                                <button
                                    onClick={() => updateStatus(order.id, 'served')}
                                    className="mt-3 w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 rounded-lg font-bold text-lg shadow"
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