import { useOrders } from '../hooks/useOrders'
import { StatusColumn } from '../components/StatusColumn'
import { Layout } from '../components/Layout'

const PrepStation = () => {
    const { orders, updateStatus } = useOrders()
    const preparing = orders.filter(o => o.status === 'preparing')
    const ready = orders.filter(o => o.status === 'ready')

    return (
        <Layout>
            <div className="min-h-screen bg-orange-950 text-white p-10">
                <h1 className="text-4xl text-center mb-6 text-orange-400 font-bold">PREP STATION</h1>
                <div className="grid grid-cols-2 gap-12">
                    <StatusColumn title="preparing" orders={preparing} onNext={(id) => updateStatus(id, 'ready')} />
                    <StatusColumn title="ready" orders={ready} onNext={() => { }} />
                </div>
            </div>
        </Layout>
    )
}

export default PrepStation