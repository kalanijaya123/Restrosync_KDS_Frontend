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
    pending: 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700',
    preparing: 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700',
    ready: 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700'
}

export const StatusColumn: React.FC<Props> = ({ title, onNext }) => {
    const { orders: ordersRaw = [], updateStatus, toggleItemChecked } = useOrders()
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                {title.toUpperCase()} ({ordersForStatus.length})
            </h2>
            <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                {ordersForStatus.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order as any}
                        onNext={() => handleNext(order.id)}
                        onToggleItemChecked={toggleItemChecked}
                    />
                ))}
            </div>
        </div>
    )
}