import React from 'react'
import { motion } from 'framer-motion'
import type { Order } from '../types'
import { OrderTimer } from './OrderTimer'

interface Props {
    order: Order
    onNext: () => void
}
export const OrderCard = ({ order, onNext }: Props) => {
    const tableLabel = (() => {
        const t = order.tableId ?? ''
        if (!t) return '—'
        const m = String(t).match(/\d+/)
        return m ? m[0] : String(t)
    })()

    const orderNumber = (() => {
        // Prefer explicit orderNo from API, otherwise derive a short id
        if ((order as any).orderNo) return (order as any).orderNo
        if (order.id) return String(order.id).slice(-6).toUpperCase()
        return '—'
    })()

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-2xl font-bold text-yellow-300">{tableLabel}</h3>
                    <div className="text-sm text-gray-300">Order #{orderNumber}</div>
                </div>
                <OrderTimer createdAt={order.createdAt} />
            </div>

            <div className="space-y-2 mb-4">
                {order.items.map((item: any) => (
                    <div key={item.name} className="text-lg font-medium">
                        <span className="text-cyan-300">{item.qty}×</span> {item.name}
                    </div>
                ))}
            </div>

            {order.status !== 'ready' && (
                <button
                    onClick={onNext}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-lg text-lg transition transform hover:scale-105 active:scale-95"
                >
                    {order.status === 'pending' ? 'START COOKING' : 'MARK AS READY'}
                </button>
            )}
        </motion.div>
    )
}