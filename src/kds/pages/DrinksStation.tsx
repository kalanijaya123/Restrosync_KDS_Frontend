import React from 'react'
import { useOrders } from '../hooks/useOrders'

const DrinksStation = () => {
    const { orders } = useOrders()

    const drinkKeywords = ['Coke', 'Juice', 'Coffee', 'Tea', 'Water', 'Soda', 'Drink']
    const drinkOrders = orders.filter(o =>
        o.status === 'pending' &&
        o.items.every(item => drinkKeywords.some(k => item.name.toLowerCase().includes(k.toLowerCase())))
    )

    return (
        <div className="min-h-screen bg-blue-950 text-white p-10">
            <h1 className="text-9xl text-center mb-10 text-cyan-400 font-bold">DRINKS STATION</h1>
            <div className="space-y-12">
                {drinkOrders.map(order => (
                    <div key={order.id} className="bg-white text-black p-12 rounded-3xl text-7xl font-bold">
                        <div className="text-indigo-600 mb-6">{order.tableId}</div>
                        {order.items.map(item => (
                            <div key={item.name}>{item.qty} × {item.name}</div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DrinksStation