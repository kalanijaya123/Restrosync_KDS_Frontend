// src/components/OrderCard.tsx
import React, { useEffect, useState } from 'react'
import { Clock, User, Package, AlertCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Order } from '../types/order'

interface OrderCardProps {
    order: Order
    onNext: () => void
}

// FIX FOR MONGODB ARRAY DATE FORMAT [year, month, day, ...]
const parseDate = (dateInput: any): Date => {
    if (!dateInput) return new Date()
    if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput
        return new Date(year, month - 1, day, hour, minute, second)
    }
    return new Date(dateInput)
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onNext }) => {
    const [elapsed, setElapsed] = useState<string>(() => {
        const created = parseDate(order.createdAt)
        const diff = Math.max(0, Date.now() - created.getTime())
        const s = Math.floor(diff / 1000)
        const hh = Math.floor(s / 3600)
        const mm = Math.floor((s % 3600) / 60)
        const ss = s % 60
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    })

    useEffect(() => {
        const created = parseDate(order.createdAt)
        const tick = () => {
            const diff = Math.max(0, Date.now() - created.getTime())
            const s = Math.floor(diff / 1000)
            const hh = Math.floor(s / 3600)
            const mm = Math.floor((s % 3600) / 60)
            const ss = s % 60
            setElapsed(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [order.createdAt])

    // Local untyped accessor for optional/variant fields from backend payloads
    const o: any = order as any

    // Determine order mode: explicit flags (orderType/type/source/isTakeaway) take precedence,
    // otherwise fall back to presence of `tableId`.
    const _explicitIsTakeaway = ((): boolean | null => {
        if (typeof o?.isTakeaway === 'boolean') return o.isTakeaway
        if (typeof o?.takeaway === 'boolean') return o.takeaway
        return null
    })()

    const typeHint = String(o?.orderType ?? o?.type ?? o?.source ?? '').toLowerCase()

    const isTakeaway = (() => {
        if (_explicitIsTakeaway !== null) return _explicitIsTakeaway
        if (typeHint) {
            if (typeHint.includes('take') || typeHint.includes('delivery') || typeHint.includes('parcel') || typeHint.includes('pickup')) return true
            if (typeHint.includes('dine') || typeHint.includes('table') || typeHint.includes('eat')) return false
        }
        return !o?.tableId && !o?.tableNo
    })()

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
        >
            {/* KOT TOKEN + TIME + TABLE/TAKEAWAY */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                        {order.kotToken || `KOT-${String(order.orderNo).padStart(3, '0')}`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                        <Clock className="w-6 h-6" />
                        <span className="ml-1 font-mono">{elapsed}</span>
                    </div>
                </div>

                <div>
                    {isTakeaway ? (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold shadow">
                            TAKEAWAY
                        </span>
                    ) : (
                        // Dine-in: prefer showing tableId/tableNo when available, otherwise show DINE-IN
                        o.tableId || o.tableNo ? (
                            <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-base font-extrabold shadow">
                                T{String(o.tableId ?? o.tableNo).slice(-4).toUpperCase()}
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold shadow">
                                DINE-IN
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-2">
                    <User className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{order.customerName || 'Guest'}</span>
                </div>
                {order.customerPhone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <Phone className="w-4 h-4" />
                        {order.customerPhone}
                    </div>
                )}
                {order.notes && order.notes.trim() && (
                    <div className="mt-3 flex items-start gap-2 text-orange-600 dark:text-orange-400 font-medium bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm">{order.notes}</span>
                    </div>
                )}
            </div>

            {/* ORDER ITEMS */}
            <div className="space-y-4 mb-4">
                {
                    (() => {
                        const items = Array.isArray(order.items) ? order.items : []
                        if (items.length === 0) return <p className="text-center text-gray-400 dark:text-gray-500 text-sm">No items</p>

                        return items.map((raw: any, i: number) => {
                            const qty = Number(raw?.qty ?? raw?.quantity ?? 1)
                            const name = raw?.menuItemName || raw?.name || raw?.title || raw?.itemName || 'Item'
                            const size = raw?.sizeName ? `${raw.sizeName} ` : ''
                            const unitPrice = Number(raw?.basePrice ?? raw?.price ?? 0)
                            const lineTotal = (unitPrice * (qty || 1))
                            const extras = Array.isArray(raw?.extras) ? raw.extras : []

                            return (
                                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{qty} × {size}{name}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Rs {Number(lineTotal).toFixed(0)}</div>
                                    </div>

                                    {extras.length > 0 && (
                                        <div className="ml-4 mt-2 space-y-1 border-l-4 border-emerald-500 pl-3">
                                            {extras.map((extra: any, ei: number) => (
                                                <div key={ei} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                                                    <Package className="w-4 h-4" />
                                                    <span>+ {extra.name ?? extra.title ?? 'Extra'} ×{extra.qty ?? extra.quantity ?? 1}</span>
                                                    <span className="text-xs text-gray-400 ml-auto">+Rs {Number((extra.price ?? extra.amount ?? 0) * (extra.qty ?? extra.quantity ?? 1)).toFixed(0)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    })()
                }
            </div>

            {/* TOTAL + ACTION BUTTON */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Rs {order.total?.toFixed(0) || '0'}</span>
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-semibold text-sm shadow-md transform hover:scale-105 transition-all"
                >
                    {order.status === 'pending' && 'START COOKING'}
                    {order.status === 'preparing' && 'MARK AS READY'}
                    {order.status === 'ready' && 'READY TO SERVE'}
                </button>
            </div>
        </motion.div>
    )
}