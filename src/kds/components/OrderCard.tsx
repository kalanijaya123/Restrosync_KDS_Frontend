// src/components/OrderCard.tsx
import React from 'react'
import { Clock, User, Package, AlertCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

// Make sure this matches your backend Order model exactly
interface SelectedExtra {
    extraId: string
    name: string
    price: number
    qty: number
}

interface OrderItem {
    menuItemId: string
    menuItemName: string
    sizeName: string
    basePrice: number
    qty: number
    extras: SelectedExtra[]
}

interface Order {
    id: string
    orderNo: number
    kotToken: string
    tableId?: string | null
    customerName: string
    customerPhone?: string | null
    notes?: string | null
    source: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid'
    createdAt: string
    servedAt?: string
}

interface OrderCardProps {
    order: Order
    onNext: () => void
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onNext }) => {
    const timeAgo = () => {
        const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)
        if (mins < 1) return 'Just now'
        if (mins === 1) return '1 min ago'
        if (mins < 60) return `${mins} mins ago`
        const hours = Math.floor(mins / 60)
        const remainingMins = mins % 60
        return remainingMins > 0 ? `${hours}h ${remainingMins}m ago` : `${hours}h ago`
    }

    const isTakeaway = !order.tableId

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-black/80 to-purple-900/40 backdrop-blur-xl rounded-3xl p-7 border border-white/30 shadow-2xl hover:shadow-purple-600/40 transition-all duration-300"
        >
            {/* HEADER - KOT + TABLE/TAKEAWAY */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="text-4xl font-extrabold text-cyan-400 tracking-wider">
                        {order.kotToken || `KOT-${String(order.orderNo).padStart(3, '0')}`}
                    </div>
                    <div className="text-lg text-gray-300 flex items-center gap-2 mt-2">
                        <Clock className="w-5 h-5" />
                        {timeAgo()}
                    </div>
                </div>

                <div>
                    {isTakeaway ? (
                        <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-2xl font-bold shadow-lg">
                            TAKEAWAY
                        </div>
                    ) : (
                        <div className="px-8 py-5 bg-gradient-to-r from-orange-600 to-red-700 rounded-full text-4xl font-extrabold shadow-2xl">
                            T{order.tableId?.slice(-4).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="bg-white/10 rounded-2xl p-5 mb-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                    <User className="w-7 h-7 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">
                        {order.customerName || 'Guest'}
                    </span>
                </div>
                {order.customerPhone && (
                    <div className="flex items-center gap-3 text-gray-300">
                        <Phone className="w-5 h-5" />
                        <span>{order.customerPhone}</span>
                    </div>
                )}
                {order.notes && (
                    <div className="mt-4 flex items-start gap-3 text-orange-400 font-semibold bg-orange-900/30 rounded-xl p-4">
                        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <span>{order.notes}</span>
                    </div>
                )}
            </div>

            {/* ORDER ITEMS - FULL DETAILS */}
            <div className="space-y-5 mb-6">
                {order.items.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-xl font-bold text-white">
                                {item.qty} × {item.sizeName} {item.menuItemName}
                            </div>
                            <div className="text-xl text-gray-300">
                                Rs {(item.basePrice * item.qty).toFixed(0)}
                            </div>
                        </div>

                        {/* EXTRAS */}
                        {item.extras && item.extras.length > 0 && (
                            <div className="ml-4 mt-3 space-y-2 border-l-4 border-yellow-500 pl-4">
                                {item.extras.map((extra, i) => (
                                    <div key={i} className="flex items-center gap-3 text-yellow-400 font-medium">
                                        <Package className="w-5 h-5" />
                                        <span>+ {extra.name} ×{extra.qty}</span>
                                        <span className="text-sm text-gray-400 ml-auto">
                                            +Rs {(extra.price * extra.qty).toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* TOTAL + ACTION BUTTON */}
            <div className="border-t-2 border-white/20 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-white">Total</span>
                    <span className="text-5xl font-extrabold text-emerald-400">
                        Rs {order.total}
                    </span>
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-6 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-600 hover:to-pink-700 rounded-2xl font-extrabold text-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                    {order.status === 'pending' && 'START COOKING'}
                    {order.status === 'preparing' && 'MARK AS READY'}
                    {order.status === 'ready' && 'READY TO SERVE'}
                </button>
            </div>
        </motion.div>
    )
}