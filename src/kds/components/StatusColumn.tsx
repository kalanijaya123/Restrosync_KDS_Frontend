import React from 'react'
import { OrderCard } from './OrderCard'
import { useOrders } from '../hooks/useOrders'
import type { Order } from '../types'

type StatusKey = 'pending' | 'preparing' | 'ready'

interface Props {
    title: StatusKey
    onNext?: (id: string) => void
}

const colors: Record<StatusKey, string> = {
    pending: 'bg-red-900',
    preparing: 'bg-yellow-900',
    ready: 'bg-green-900'
}

export const StatusColumn: React.FC<Props> = ({ title, onNext }) => {
    const { orders: ordersRaw = [], updateStatus } = useOrders()
    const orders = Array.isArray(ordersRaw) ? ordersRaw : []
    const bg = colors[title] ?? 'bg-gray-800'

    const nextStatusMap: Record<StatusKey, Order['status']> = {
        pending: 'preparing',
        preparing: 'ready',
        ready: 'ready'
    }

    const ordersForStatus = orders.filter(o => o.status === title)
    const handleNext = (id: string) => {
        if (typeof onNext === 'function') return onNext(id)
        const next = nextStatusMap[title]
        if (next) updateStatus(id, next)
    }

    return (
        <div className={`${bg} p-4 rounded-xl`}>
            <h2 className="text-lg font-semibold text-white text-center mb-4">
                {title.toUpperCase()} ({ordersForStatus.length})
            </h2>
            <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                {ordersForStatus.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order as any}
                        onNext={() => handleNext(order.id)}
                    />
                ))}
            </div>
        </div>
    )
}