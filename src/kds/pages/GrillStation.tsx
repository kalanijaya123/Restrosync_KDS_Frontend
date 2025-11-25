import React from 'react'
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { Layout } from '../components/Layout'

const GrillStation = () => {
    const { orders, updateStatus } = useOrders()

    const grillItems = ['Burger', 'Pizza', 'Chicken', 'Steak', 'Grill']
    const grillOrders = orders.filter(o =>
        o.status !== 'ready' &&
        Array.isArray(o.items) &&
        o.items.some(item => typeof item?.name === 'string' && grillItems.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase())))
    )

    return (
        <Layout>
            <div className="min-h-screen bg-red-950 text-white p-10">
                <h1 className="text-4xl text-center mb-6 text-red-400 font-bold">GRILL STATION</h1>
                <div className="grid grid-cols-3 gap-12">
                    {grillOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onNext={() => updateStatus(order.id, 'ready')}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default GrillStation