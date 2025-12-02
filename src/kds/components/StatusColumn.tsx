import React from 'react'
import { OrderCard } from './OrderCard'
import type { Order } from '../types'

type StatusKey = 'pending' | 'preparing' | 'ready'

interface Props {
    title: StatusKey
    orders: Order[]
    onNext: (id: string) => void
}

const colors: Record<StatusKey, string> = {
    pending: 'bg-red-900',
    preparing: 'bg-yellow-900',
    ready: 'bg-green-900'
}

export const StatusColumn: React.FC<Props> = ({ title, orders, onNext }) => {
    const bg = colors[title] ?? 'bg-gray-800'

    return (
        <div className={`${bg} p-10 rounded-3xl`}>
            <h2 className="text-2xl font-bold text-white text-center mb-6">
                {title.toUpperCase()} ({orders.length})
            </h2>
            <div className="space-y-10">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onNext={() => onNext(order.id)}
                    />
                ))}
            </div>
        </div>
    )
}