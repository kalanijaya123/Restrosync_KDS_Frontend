// src/hooks/useOrders.ts
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface Order {
    id: string
    orderNo: number
    kotToken: string
    tableId?: string | null
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
}

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/orders/kds`)
            if (!res.ok) throw new Error()
            const data = await res.json()

            // FIX: Convert MongoDB array dates to proper Date strings
            const normalized = data.map((order: any) => ({
                ...order,
                createdAt: Array.isArray(order.createdAt)
                    ? new Date(order.createdAt[0], order.createdAt[1] - 1, order.createdAt[2],
                        order.createdAt[3] || 0, order.createdAt[4] || 0, order.createdAt[5] || 0).toISOString()
                    : order.createdAt,
                updatedAt: Array.isArray(order.updatedAt)
                    ? new Date(order.updatedAt[0], order.updatedAt[1] - 1, order.updatedAt[2]).toISOString()
                    : order.updatedAt,
            }))

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

    return { orders, updateStatus, refetch: fetchOrders }
}