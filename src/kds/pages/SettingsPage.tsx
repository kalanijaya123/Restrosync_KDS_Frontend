import React from 'react'
import { Layout } from '../components/Layout'
import { Settings, Bell, Volume2, Monitor } from 'lucide-react'

const SettingsPage = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Settings className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 space-y-6">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Display Settings</h2>
                            <p className="text-gray-600 dark:text-gray-400">Configure your kitchen display preferences</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Auto-refresh Orders</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Automatically update order status</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Sound Notifications</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Play sound for new orders</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Volume2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Alert Volume</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Notification sound level</p>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    defaultValue="70"
                                    className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-lg shadow-md transition-all">
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SettingsPage
