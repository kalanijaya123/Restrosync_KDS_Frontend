import React from 'react'
import { useOrders } from '../hooks/useOrders'
import { Layout } from '../components/Layout'

const DrinksStation = () => {
    const { orders } = useOrders()

    const drinkKeywords = ['Coke', 'Juice', 'Coffee', 'Tea', 'Water', 'Soda', 'Drink']
    const drinkOrders = orders.filter(o =>
        o.status === 'pending' &&
        Array.isArray(o.items) &&
        o.items.length > 0 &&
        o.items.every(item => typeof item?.name === 'string' && drinkKeywords.some(k => item.name.toLowerCase().includes(k.toLowerCase())))
    )

    return (
        <Layout>
            <div className="min-h-screen bg-blue-950 text-white p-10">
                <h1 className="text-4xl text-center mb-6 text-cyan-400 font-bold">DRINKS STATION</h1>
                <div className="space-y-12">
                    {drinkOrders.map(order => (
                        <div key={order.id} className="bg-white text-black p-6 rounded-3xl text-2xl font-bold">
                            <div className="text-indigo-600 mb-6">{order.tableId}</div>
                            {Array.isArray(order.items) ? order.items.map((item, i) => (
                                <div key={item?.name ?? i}>{item.qty} × {item.name}</div>
                            )) : null}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default DrinksStation