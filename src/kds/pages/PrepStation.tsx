import React from 'react'
import { Layout } from '../components/Layout'
import { StatusColumn } from '../components/StatusColumn'

const PrepStation: React.FC = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-black/40 py-6">
                <div className="max-w-screen-2xl mx-auto px-8">
                    <h1 className="text-2xl font-semibold text-white mb-4">Prep Station</h1>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <StatusColumn title="preparing" />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PrepStation
