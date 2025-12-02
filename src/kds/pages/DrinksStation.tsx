// src/pages/DrinksBarKDS.tsx
import React from 'react'
import { Coffee } from 'lucide-react'
import { OrderCard } from '../components/OrderCard'
import { useOrders } from '../hooks/useOrders'
import { Layout } from '../components/Layout'

const DrinksBarKDS = () => {
    const hook = useOrders()
    const ordersRaw = hook.orders ?? []
    const orders = Array.isArray(ordersRaw) ? ordersRaw : []
    const updateStatus = typeof hook.updateStatus === 'function' ? hook.updateStatus : () => { }

    const drinkKeywords = ['juice', 'lassi', 'milkshake', 'coffee', 'tea', 'soda', 'mocktail', 'cocktail', 'beer']

    const hasDrink = (order: any) => {
        if (!order || !Array.isArray(order.items)) return false
        return order.items.some((item: any) => {
            const name = String(item?.menuItemName ?? item?.name ?? item?.title ?? '').toLowerCase()
            if (!name) return false
            if (name.includes('drink')) return true
            return drinkKeywords.some(kw => name.includes(kw))
        })
    }

    const pending = orders.filter((o: any) => o?.status === 'pending' && hasDrink(o))
    const preparing = orders.filter((o: any) => o?.status === 'preparing' && hasDrink(o))
    const ready = orders.filter((o: any) => o?.status === 'ready' && hasDrink(o))

    const combined = [...pending, ...preparing, ...ready]

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-black to-blue-950 text-white">
                <header className="py-4">
                    <div className="max-w-3xl mx-auto px-6 flex items-center gap-4">
                        <Coffee className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-2xl font-bold">DRINKS BAR</h1>
                    </div>
                </header>

                <div className="px-6 py-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                            {combined.map((order: any) => (
                                <div key={order.id} className={`rounded-xl p-4 shadow-md border ${order.status === 'pending' ? 'bg-red-900/80 border-red-600' :
                                        order.status === 'preparing' ? 'bg-cyan-900/80 border-cyan-600' :
                                            'bg-emerald-900/80 border-emerald-600'
                                    }`}>
                                    <OrderCard order={order as any} onNext={() => {
                                        if (order.status === 'pending') updateStatus(order.id, 'preparing')
                                        else if (order.status === 'preparing') updateStatus(order.id, 'ready')
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default DrinksBarKDS