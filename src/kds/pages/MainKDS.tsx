// src/pages/MainKDS.tsx
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { ChefHat } from 'lucide-react'
import { Layout } from '../components/Layout'

const MainKDS = () => {
    const { orders, updateStatus } = useOrders()

    const pending = orders.filter(o => o.status === 'pending')
    const preparing = orders.filter(o => o.status === 'preparing')
    const ready = orders.filter(o => o.status === 'ready')

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
                {/* HEADER */}
                <header className="bg-gradient-to-r from-indigo-900 to-purple-900 py-6 shadow-2xl border-b-4 border-purple-500">
                    <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ChefHat className="w-12 h-12 text-yellow-400" />
                            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                RESTROSYNC KITCHEN
                            </h1>
                        </div>
                        <div className="text-xl font-medium text-gray-300">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </header>

                {/* STATS */}
                <div className="bg-black/50 backdrop-blur border-b border-gray-800 py-5">
                    <div className="max-w-7xl mx-auto px-8 grid grid-cols-3 gap-8 text-center">
                        <div><div className="text-5xl font-bold text-red-400">{pending.length}</div><div className="text-lg text-red-300">PENDING</div></div>
                        <div><div className="text-5xl font-bold text-amber-400">{preparing.length}</div><div className="text-lg text-amber-300">PREPARING</div></div>
                        <div><div className="text-5xl font-bold text-emerald-400">{ready.length}</div><div className="text-lg text-emerald-300">READY</div></div>
                    </div>
                </div>

                {/* 3 COLUMNS */}
                <div className="max-w-7xl mx-auto p-8">
                    <div className="grid grid-cols-3 gap-8">
                        <div className="bg-gradient-to-b from-red-900/80 to-red-950/90 rounded-2xl p-6 shadow-2xl border border-red-800/50">
                            <h2 className="text-3xl font-bold text-red-300 text-center mb-6">PENDING ({pending.length})</h2>
                            <div className="space-y-5 max-h-screen overflow-y-auto">
                                {pending.map(order => (
                                    <OrderCard key={order.id} order={order} onNext={() => updateStatus(order.id, 'preparing')} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-amber-900/80 to-amber-950/90 rounded-2xl p-6 shadow-2xl border border-amber-800/50">
                            <h2 className="text-3xl font-bold text-amber-300 text-center mb-6">PREPARING ({preparing.length})</h2>
                            <div className="space-y-5 max-h-screen overflow-y-auto">
                                {preparing.map(order => (
                                    <OrderCard key={order.id} order={order} onNext={() => updateStatus(order.id, 'ready')} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-b from-emerald-900/80 to-emerald-950/90 rounded-2xl p-6 shadow-2xl border border-emerald-800/50">
                            <h2 className="text-3xl font-bold text-emerald-300 text-center mb-6">READY ({ready.length})</h2>
                            <div className="space-y-5 max-h-screen overflow-y-auto">
                                {ready.map(order => (
                                    <OrderCard key={order.id} order={order} onNext={() => { }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default MainKDS