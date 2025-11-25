import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    ChefHat,
    Flame,
    Coffee,
    Package,
    Settings,
    LogOut,
    Clock,
    Home
} from 'lucide-react'

const menuItems = [
    { to: "/kds/main", label: "Main Kitchen", icon: LayoutDashboard },
    { to: "/kds/prep", label: "Prep Station", icon: ChefHat },
    { to: "/kds/grill", label: "Grill Station", icon: Flame },
    { to: "/kds/drinks", label: "Drinks Bar", icon: Coffee },
    { to: "/kds/expedite", label: "Expedite", icon: Package },
    { to: "/kds/settings", label: "Settings", icon: Settings },
]

export const Sidebar = () => {
    const location = useLocation()

    return (
        <div className="fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-gray-900 via-black to-gray-950 border-r border-gray-800 shadow-2xl z-50">
            {/* Logo & Title */}
            <div className="p-8 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl">
                        <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">RestroSync</h1>
                        <p className="text-sm text-gray-400">Kitchen Display System</p>
                    </div>
                </div>
            </div>

            {/* Current Time & Date */}
            <div className="px-8 py-6 border-b border-gray-800">
                <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-gray-400 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-6">
                <ul className="space-y-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.to

                        return (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105
                    ${isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-7 h-7" />
                                    <span>{item.label}</span>
                                    {isActive && <div className="ml-auto w-3 h-3 bg-white rounded-full animate-pulse"></div>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t border-gray-800">
                <button className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl bg-red-900/50 hover:bg-red-800 text-red-300 hover:text-white transition-all">
                    <LogOut className="w-7 h-7" />
                    <span className="font-semibold text-lg">Logout</span>
                </button>
            </div>
        </div>
    )
}