// src/kds/components/Layout.tsx
import { Sidebar } from './Sidebar'

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-80 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
                {children}
            </main>
        </div>
    )
}