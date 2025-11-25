// src/kds/hooks/useOrders.ts
import { useState, useEffect } from 'react'
import type { Order } from '../types'

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        const API_BASE = import.meta.env.VITE_API_URL || ''

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/kds`)
                if (res.ok) {
                    const data = await res.json()
                    const raw = Array.isArray(data) ? data : []

                    // Normalize incoming orders to avoid null/undefined fields
                    const newOrders = raw.map(o => ({
                        id: o.id,
                        tableId: o.tableId ?? '—',
                        status: o.status ?? 'pending',
                        createdAt: o.createdAt ?? new Date().toISOString(),
                        total: o.total ?? 0,
                        items: Array.isArray(o.items) ? o.items.map((it: any) => ({
                            name: typeof it?.name === 'string' && it.name.trim() !== '' ? it.name : 'Unknown item',
                            qty: typeof it?.qty === 'number' ? it.qty : 1,
                            price: typeof it?.price === 'number' ? it.price : 0
                        })) : []
                    }))

                    // Sound for new order
                    if (newOrders.length > orders.length && newOrders.some(o => o.status === 'pending')) {
                        new Audio('/ding.mp3').play().catch(() => { })
                    }

                    setOrders(newOrders)
                }
            } catch (err) {
                console.log('Backend not running yet — waiting...')
            }
        }

        fetchOrders()
        const interval = setInterval(fetchOrders, 3000)
        return () => clearInterval(interval)
    }, [orders.length])

    const updateStatus = async (id: string, status: Order['status']) => {
        await fetch(`http://localhost:8080/api/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }

    return { orders, updateStatus }
}