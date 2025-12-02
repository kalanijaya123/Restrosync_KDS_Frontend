// src/pages/PrepKDS.tsx
import React from 'react'
import { Utensils } from 'lucide-react'
import { OrderCard } from '../components/OrderCard'
import { useOrders } from '../hooks/useOrders'
import { Layout } from '../components/Layout'

const PrepKDS = () => {
    const hook = useOrders()
    const ordersRaw = hook.orders ?? []
    const orders = Array.isArray(ordersRaw) ? ordersRaw : []
    const updateStatus = typeof hook.updateStatus === 'function' ? hook.updateStatus : () => { }

    const prepKeywords = ['rice', 'noodles', 'soup', 'salad', 'curry', 'devilled', 'mongolian', 'chop suey']

    const hasPrepItem = (order: any) => {
        if (!order || !Array.isArray(order.items)) return false
        return order.items.some((item: any) => {
            const name = String(item?.menuItemName ?? item?.name ?? item?.title ?? '').toLowerCase()
            if (!name) return false
            return prepKeywords.some(kw => name.includes(kw))
        })
    }

    const pending = orders.filter((o: any) => o?.status === 'pending' && hasPrepItem(o))
    const preparing = orders.filter((o: any) => o?.status === 'preparing' && hasPrepItem(o))
    const ready = orders.filter((o: any) => o?.status === 'ready' && hasPrepItem(o))

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-amber-950 via-black to-yellow-950 text-white">
                <header className="py-4">
                    <div className="max-w-5xl mx-auto px-6 flex items-center gap-4">
                        <Utensils className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-2xl font-bold">PREP STATION</h1>
                    </div>
                </header>

                <div className="px-6 py-8">
                    <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-6">
                        <div className="bg-gradient-to-b from-yellow-900/80 to-black rounded-xl p-6 shadow-lg border border-yellow-700">
                            <h2 className="text-2xl font-semibold text-yellow-300 text-center mb-4">COOKING</h2>
                            <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                                {preparing.map(order => (
                                    <OrderCard key={order.id} order={order as any} onNext={() => updateStatus(order.id, 'ready')} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-emerald-900/80 to-black rounded-xl p-6 shadow-lg border border-emerald-700">
                            <h2 className="text-2xl font-semibold text-emerald-300 text-center mb-4">READY</h2>
                            <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                                {ready.map(order => (
                                    <OrderCard key={order.id} order={order as any} onNext={() => { }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PrepKDS