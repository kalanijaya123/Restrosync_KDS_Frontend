import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    ChefHat,
    Flame,
    Coffee,
    Package,
    Settings,
    LogOut
} from 'lucide-react'
import { useDarkMode } from '../../contexts/DarkModeContext'

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
    const navigate = useNavigate()
    const { darkMode } = useDarkMode()

    return (
        <div className={`fixed left-0 top-0 h-screen w-80 border-r shadow-2xl z-50 transition-colors ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            {/* Logo & Title */}
            <div className={`p-8 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 p-4 rounded-2xl">
                        <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>RestroSync</h1>
                        <p className="text-sm text-gray-500">Kitchen Display System</p>
                    </div>
                </div>
            </div>

            {/* Current Time & Date */}
            <div className={`px-8 py-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-500">
                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-gray-500 mt-1">
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
                                            ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-500/50'
                                            : darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                    onClick={() => {
                        localStorage.removeItem('currentUser')
                        navigate('/login')
                    }}
                    className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                    <LogOut className="w-7 h-7" />
                    <span className="font-semibold text-lg">Logout</span>
                </button>
            </div>
        </div>
    )
}