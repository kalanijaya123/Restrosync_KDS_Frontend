// src/kds/hooks/useOrders.ts
import { useState, useEffect } from 'react'
import type { Order } from '../types'

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const API_BASE = import.meta.env.VITE_API_URL || ''

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/kds`)
                if (res.ok) {
                    const data = await res.json()
                    const raw = Array.isArray(data) ? data : []

                    // Normalize incoming orders to avoid null/undefined fields
                    const newOrders: Order[] = raw.map((o: any, i: number) => ({
                        id: String(o.id ?? `gen-${i}`),
                        // prefer numeric orderNo if provided, else use index-based fallback
                        orderNo: (typeof o?.orderNo === 'number') ? o.orderNo : (typeof o?.orderNo === 'string' && /\d+/.test(o.orderNo) ? parseInt(o.orderNo.match(/\d+/)![0], 10) : (i + 1)),
                        kotToken: o.kotToken ?? undefined,
                        customerName: o.customerName ?? o.customerDisplayName ?? 'Guest',
                        source: o.source ?? undefined,
                        tableId: o.tableId ?? '—',
                        tableNo: o.tableNo ?? undefined,
                        status: (o.status === 'preparing' || o.status === 'ready') ? o.status : 'pending',
                        createdAt: o.createdAt ?? new Date().toISOString(),
                        total: typeof o.total === 'number' ? o.total : 0,
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
    }, [orders.length, API_BASE])

    const updateStatus = async (id: string, status: Order['status']) => {
        try {
            await fetch(`${API_BASE}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
        } catch (err) {
            console.warn('Failed to update status', err)
        }
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }

    return { orders, updateStatus }
}