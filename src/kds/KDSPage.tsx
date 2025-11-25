import React from 'react'
import { useOrders } from './hooks/useOrders'
import { StatusColumn } from './components/StatusColumn'

const KDSPage = () => {
    const { orders, updateStatus } = useOrders()

    const pending = orders.filter(o => o.status === 'pending')
    const preparing = orders.filter(o => o.status === 'preparing')
    const ready = orders.filter(o => o.status === 'ready')

    React.useEffect(() => {
        document.documentElement.requestFullscreen()
    }, [])

    return (
        <div className="min-h-screen bg-black">
            <div className="text-center py-8 bg-gradient-to-r from-purple-800 to-indigo-800">
                <h1 className="text-4xl font-bold text-yellow-400 tracking-wider">
                    RESTROSYNC KITCHEN
                </h1>
            </div>

            <div className="grid grid-cols-3 gap-10 p-10 h-screen">
                <StatusColumn title="pending" orders={pending} onNext={(id) => updateStatus(id, 'preparing')} />
                <StatusColumn title="preparing" orders={preparing} onNext={(id) => updateStatus(id, 'ready')} />
                <StatusColumn title="ready" orders={ready} onNext={() => { }} />
            </div>
        </div>
    )
}

export default KDSPage