import React from 'react'
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'

const GrillStation = () => {
    const { orders, updateStatus } = useOrders()

    const grillItems = ['Burger', 'Pizza', 'Chicken', 'Steak', 'Grill']
    const grillOrders = orders.filter(o =>
        o.status !== 'ready' &&
        o.items.some(item => grillItems.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase())))
    )

    return (
        <div className="min-h-screen bg-red-950 text-white p-10">
            <h1 className="text-9xl text-center mb-10 text-red-400 font-bold">GRILL STATION</h1>
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
    )
}

export default GrillStation