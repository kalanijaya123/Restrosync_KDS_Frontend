import { useState, useEffect } from 'react'
import type { Order } from '../types'

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/orders/kds')
                if (res.ok) {
                    const data = await res.json()
                    const newOrders = Array.isArray(data) ? data : []

                    // Sound for new pending order
                    if (newOrders.length > orders.length) {
                        const hasNew = newOrders.some(o => o.status === 'pending' && !orders.find(x => x.id === o.id))
                        if (hasNew) new Audio('/ding.mp3').play().catch(() => { })
                    }

                    setOrders(newOrders)
                }
            } catch (err) { }
        }

        fetchOrders()
        const interval = setInterval(fetchOrders, 3000)
        return () => clearInterval(interval)
    }, [orders.length])

    const updateStatus = async (id: string, status: 'preparing' | 'ready') => {
        await fetch(`http://localhost:8080/api/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }

    return { orders, updateStatus }
}