// src/hooks/useOrders.ts
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface Order {
    id: string
    orderNo: number
    kotToken: string
    tableId?: string | null
    tableNumber?: string | null
    source: string
    items: any[]
    total: number
    status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled' | 'paid'
    createdAt: any // Accept array or string
    updatedAt: any
    customerName: string
    customerPhone?: string | null
    notes?: string | null
    waiterName: string
    hasNewItems?: boolean
    newItemsCount?: number
}

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const previousItemCountsRef = useRef<Map<string, number>>(new Map())
    const recentItemAlertsRef = useRef<Map<string, { count: number; expiresAt: number }>>(new Map())

    const playAlertSound = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGWi56+aeUwwN')
        audio.volume = 0.3
        audio.play().catch(() => { })
    }

    const pruneExpiredAlerts = () => {
        const now = Date.now()
        const next = new Map<string, { count: number; expiresAt: number }>()

        recentItemAlertsRef.current.forEach((value, key) => {
            if (value.expiresAt > now) {
                next.set(key, value)
            }
        })

        recentItemAlertsRef.current = next
    }

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/orders/kds`)
            if (!res.ok) throw new Error()
            const data = await res.json()

            pruneExpiredAlerts()

            const currentItemCounts = new Map<string, number>()
            const now = Date.now()
            const updatedAlertMap = new Map(recentItemAlertsRef.current)

            // FIX: Convert MongoDB array dates to proper Date strings
            const normalized = data.map((order: any) => {
                const currentItemCount = Array.isArray(order.items) ? order.items.length : 0
                const previousItemCount = previousItemCountsRef.current.get(order.id) ?? currentItemCount
                const addedItems = currentItemCount - previousItemCount
                const isOngoing = ['pending', 'preparing', 'ready'].includes(order.status)

                currentItemCounts.set(order.id, currentItemCount)

                if (isOngoing && addedItems > 0) {
                    updatedAlertMap.set(order.id, {
                        count: addedItems,
                        expiresAt: now + 15000,
                    })

                    const orderLabel = order.kotToken || `Order #${order.orderNo || order.id.slice(-6).toUpperCase()}`
                    toast(`⚠️ ${orderLabel} received ${addedItems} new item${addedItems > 1 ? 's' : ''}`, {
                        icon: '🔔',
                        duration: 4000,
                        position: 'top-right',
                        style: {
                            background: '#f97316',
                            color: '#fff',
                            fontWeight: '700',
                            border: '1px solid #fb923c'
                        }
                    })
                    playAlertSound()
                }

                const alert = updatedAlertMap.get(order.id)

                return {
                    ...order,
                    createdAt: Array.isArray(order.createdAt)
                        ? new Date(order.createdAt[0], order.createdAt[1] - 1, order.createdAt[2],
                            order.createdAt[3] || 0, order.createdAt[4] || 0, order.createdAt[5] || 0).toISOString()
                        : order.createdAt,
                    updatedAt: Array.isArray(order.updatedAt)
                        ? new Date(order.updatedAt[0], order.updatedAt[1] - 1, order.updatedAt[2]).toISOString()
                        : order.updatedAt,
                    hasNewItems: Boolean(alert),
                    newItemsCount: alert?.count ?? 0,
                }
            })

            previousItemCountsRef.current = currentItemCounts
            recentItemAlertsRef.current = updatedAlertMap

            setOrders(normalized)
        } catch (err) {
            toast.error('KDS: Failed to load orders')
        }
    }

    useEffect(() => {
        fetchOrders()
        const interval = setInterval(fetchOrders, 3000) // Auto-refresh every 3s
        return () => clearInterval(interval)
    }, [])

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch(`${API_URL}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            fetchOrders()
            toast.success(`Order moved to ${status.toUpperCase()}!`)
        } catch (err) {
            toast.error('Failed to update status')
        }
    }

    const toggleItemChecked = async (id: string, itemIndex: number, checked: boolean) => {
        try {
            await fetch(`${API_URL}/api/orders/${id}/items/${itemIndex}/checked`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checked })
            })
            fetchOrders()
        } catch (err) {
            toast.error('Failed to update item tick')
        }
    }

    return { orders, updateStatus, toggleItemChecked, refetch: fetchOrders }
}