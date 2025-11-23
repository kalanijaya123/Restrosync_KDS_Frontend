import React from 'react'
import type { Order } from '../types'
import { OrderTimer } from './OrderTimer'

interface Props {
    order: Order
    onNext: () => void
}

export const OrderCard: React.FC<Props> = ({ order, onNext }) => {
    return (
        <div className="bg-white text-black rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-7xl font-bold">{order.tableId}</h3>
                    <OrderTimer createdAt={order.createdAt} />
                </div>
            </div>

            <div className="p-10">
                {order.items.map((item, i) => (
                    <div key={i} className="text-5xl font-semibold py-4 border-b-2 border-gray-300">
                        {item.qty} × {item.name}
                    </div>
                ))}

                {order.status !== 'ready' && (
                    <button
                        onClick={onNext}
                        className="mt-10 w-full bg-green-600 hover:bg-green-700 text-white py-10 rounded-3xl text-6xl font-bold shadow-2xl transition"
                    >
                        {order.status === 'pending' ? 'START' : 'READY'}
                    </button>
                )}
            </div>
        </div>
    )
}