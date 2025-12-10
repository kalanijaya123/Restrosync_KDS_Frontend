// src/kds/components/Layout.tsx
import { Sidebar } from './Sidebar'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { Moon, Sun } from 'lucide-react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { darkMode, toggleDarkMode } = useDarkMode()

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-80 min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Top Navbar with Dark Mode Toggle */}
                <div className={`sticky top-0 z-40 px-8 py-4 border-b backdrop-blur-sm transition-colors ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
                    }`}>
                    <div className="flex items-center justify-end">
                        <button
                            onClick={toggleDarkMode}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${darkMode
                                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            <span className="font-medium">{darkMode ? 'Light' : 'Dark'}</span>
                        </button>
                    </div>
                </div>
                {children}
            </main>
        </div>
    )
}