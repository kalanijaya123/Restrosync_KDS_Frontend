// src/pages/GrillKDS.tsx
import React from 'react'
import { Flame, AlertCircle, CheckCircle2 } from 'lucide-react'
import { OrderCard } from '../components/OrderCard'
import { useOrders } from '../hooks/useOrders'
import { Layout } from '../components/Layout'

const GrillKDS = () => {
    const hook = useOrders()
    const ordersRaw = hook.orders ?? []
    const orders = Array.isArray(ordersRaw) ? ordersRaw : []
    const updateStatus = typeof hook.updateStatus === 'function' ? hook.updateStatus : () => { }

    // GRILL ITEMS: Chicken, Beef, Seafood, Sausage, etc.
    const grillCategories = ['grill', 'chicken', 'beef', 'seafood', 'fryer', 'tandoor']

    const hasGrillItem = (order: any) => {
        if (!order || !Array.isArray(order.items)) return false
        return order.items.some((item: any) => {
            const name = String(item?.menuItemName ?? item?.name ?? item?.title ?? '').toLowerCase()
            if (!name) return false
            if (name.includes('kottu') || name.includes('grill') || name.includes('fry') || name.includes('fryer')) return true
            return grillCategories.some(cat => name.includes(cat))
        })
    }

    const pending = orders.filter((o: any) => o?.status === 'pending' && hasGrillItem(o))
    const preparing = orders.filter((o: any) => o?.status === 'preparing' && hasGrillItem(o))
    const ready = orders.filter((o: any) => o?.status === 'ready' && hasGrillItem(o))

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-orange-950 text-white">
                <header className="py-4">
                    <div className="max-w-5xl mx-auto px-6 flex items-center gap-4">
                        <Flame className="w-8 h-8 text-orange-400" />
                        <h1 className="text-2xl font-bold">GRILL STATION</h1>
                    </div>
                </header>

                <div className="bg-black/70 py-4">
                    <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
                        <div><div className="text-3xl font-bold text-red-500">{pending.length}</div><div className="text-sm text-red-400 mt-1">PENDING</div></div>
                        <div><div className="text-3xl font-bold text-orange-500">{preparing.length}</div><div className="text-sm text-orange-400">GRILLING</div></div>
                        <div><div className="text-3xl font-bold text-emerald-500">{ready.length}</div><div className="text-sm text-emerald-400">READY</div></div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="bg-gradient-to-b from-red-900/80 to-black rounded-xl p-4 shadow-lg border border-red-800">
                            <h2 className="text-lg font-semibold text-red-300 text-center mb-4">FIRE UP</h2>
                            <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                                {pending.map(order => (
                                    <OrderCard key={order.id} order={order as any} onNext={() => updateStatus(order.id, 'preparing')} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-orange-900/80 to-black rounded-xl p-4 shadow-lg border border-orange-800">
                            <h2 className="text-lg font-semibold text-orange-300 text-center mb-4">ON FIRE</h2>
                            <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                                {preparing.map(order => (
                                    <OrderCard key={order.id} order={order as any} onNext={() => updateStatus(order.id, 'ready')} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-emerald-900/80 to-black rounded-xl p-4 shadow-lg border border-emerald-800">
                            <h2 className="text-lg font-semibold text-emerald-300 text-center mb-4">PLATED</h2>
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

export default GrillKDS