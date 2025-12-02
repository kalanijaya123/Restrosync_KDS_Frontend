import React from 'react'
import { StatusColumn } from './components/StatusColumn'

const KDSPage = () => {
    // `StatusColumn` uses `useOrders` internally; no need to fetch orders here.

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
                <StatusColumn title="pending" />
                <StatusColumn title="preparing" />
                <StatusColumn title="ready" />
            </div>
        </div>
    )
}

export default KDSPage