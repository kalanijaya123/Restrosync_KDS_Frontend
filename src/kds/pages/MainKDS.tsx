// src/pages/MainKDS.tsx
import React, { useEffect, useRef } from 'react'
import { ChefHat, AlertCircle, CheckCircle2 } from 'lucide-react'
import { OrderCard } from '../components/OrderCard'
import { useOrders } from '../hooks/useOrders'
import { Layout } from '../components/Layout'
import VoiceAssistantPanel from '../components/VoiceAssistantPanel'

const MainKDS = () => {
    const hook = useOrders()
    const ordersRaw = hook.orders ?? []
    const orders = Array.isArray(ordersRaw) ? ordersRaw : []
    const updateStatus = typeof hook.updateStatus === 'function' ? hook.updateStatus : (() => { })
    const toggleItemChecked = typeof hook.toggleItemChecked === 'function' ? hook.toggleItemChecked : (() => { })

    const pending = orders.filter(o => o.status === 'pending')
    const preparing = orders.filter(o => o.status === 'preparing')
    const ready = orders.filter(o => o.status === 'ready')

    const parseTime = (dateInput: any) => {
        if (!dateInput) return 0
        if (Array.isArray(dateInput)) {
            const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput
            return new Date(year, month - 1, day, hour, minute, second).getTime()
        }
        const t = new Date(dateInput).getTime()
        return Number.isNaN(t) ? 0 : t
    }

    const sortByCreatedAsc = (arr: any[]) => [...arr].sort((a, b) => (parseTime(a?.createdAt) - parseTime(b?.createdAt)))

    const pendingSorted = sortByCreatedAsc(pending)
    const preparingSorted = sortByCreatedAsc(preparing)
    const readySorted = sortByCreatedAsc(ready)

    const ids = orders.map(o => String(o.id)).join(',')

    const pageRef = useRef<HTMLDivElement | null>(null)
    const pendingRef = useRef<HTMLDivElement | null>(null)
    const preparingRef = useRef<HTMLDivElement | null>(null)
    const readyRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!pageRef.current) return
        setTimeout(() => pageRef.current?.scrollTo({ top: pageRef.current.scrollHeight, behavior: 'smooth' }), 60)
    }, [ids])

    // helper to auto-scroll a column ref when that column's ids change
    const scrollColumnToBottom = (ref: React.RefObject<HTMLDivElement | null> | null) => {
        if (!ref || !ref.current) return
        setTimeout(() => {
            try { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' }) } catch (e) { }
        }, 80)
    }

    const pendingIds = pendingSorted.map(o => String(o.id)).join(',')
    const preparingIds = preparingSorted.map(o => String(o.id)).join(',')
    const readyIds = readySorted.map(o => String(o.id)).join(',')

    useEffect(() => { scrollColumnToBottom(pendingRef) }, [pendingIds])
    useEffect(() => { scrollColumnToBottom(preparingRef) }, [preparingIds])
    useEffect(() => { scrollColumnToBottom(readyRef) }, [readyIds])

    return (
        <Layout>
            <div ref={pageRef} className="bg-gray-50 dark:bg-gray-900 min-h-screen overflow-auto">

                <div className="max-w-screen-2xl mx-auto px-12 py-8 pb-24">
                    <VoiceAssistantPanel orders={orders as any} onUpdateStatus={updateStatus} />
                    <div className="grid grid-cols-3 gap-14 items-start">
                        {/* PENDING */}
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border-2 border-red-300 dark:border-red-700">
                            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 text-center mb-6">PENDING ({pending.length})</h2>
                            <div ref={pendingRef} className="space-y-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                                {pendingSorted.length === 0 ? (
                                    <p className="text-center text-gray-400 dark:text-gray-500 text-2xl py-20">No pending orders</p>
                                ) : (
                                    pendingSorted.map(order => (
                                        <OrderCard key={order.id} order={order as any} onNext={() => updateStatus(order.id, 'preparing')} onToggleItemChecked={toggleItemChecked} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* PREPARING */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 shadow-lg border-2 border-amber-300 dark:border-amber-700">
                            <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 text-center mb-6">PREPARING ({preparing.length})</h2>
                            <div ref={preparingRef} className="space-y-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                                {preparingSorted.length === 0 ? (
                                    <p className="text-center text-gray-400 dark:text-gray-500 text-2xl py-20">All caught up!</p>
                                ) : (
                                    preparingSorted.map(order => (
                                        <OrderCard key={order.id} order={order as any} onNext={() => updateStatus(order.id, 'ready')} onToggleItemChecked={toggleItemChecked} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* READY */}
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 shadow-lg border-2 border-emerald-300 dark:border-emerald-700">
                            <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 text-center mb-6">READY ({ready.length})</h2>
                            <div ref={readyRef} className="space-y-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                                {readySorted.length === 0 ? (
                                    <p className="text-center text-gray-400 dark:text-gray-500 text-2xl py-20">Waiting for orders</p>
                                ) : (
                                    readySorted.map(order => (
                                        <OrderCard key={order.id} order={order as any} onNext={() => { }} onToggleItemChecked={toggleItemChecked} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default MainKDS