import React from 'react'
import { useOrders } from '../hooks/useOrders'

const ExpediteScreen = () => {
    const { orders } = useOrders()
    const readyOrders = orders.filter(o => o.status === 'ready')

    return (
        <div className="min-h-screen bg-green-950 text-white p-10">
            <h1 className="text-9xl text-center mb-10 text-green-400 font-bold">PICKUP → EXPEDITE</h1>
            <div className="grid grid-cols-5 gap-12">
                {readyOrders.length === 0 ? (
                    <div className="col-span-5 text-center text-9xl text-gray-500">No orders ready</div>
                ) : (
                    readyOrders.map(order => (
                        <div
                            key={order.id}
                            className="bg-white text-black p-20 rounded-3xl text-center text-9xl font-bold text-green-600 shadow-2xl"
                        >
                            {order.tableId.replace('Table ', '')}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ExpediteScreen