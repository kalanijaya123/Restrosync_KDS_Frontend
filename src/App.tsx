import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainKDS from './kds/pages/MainKDS'
import PrepStation from './kds/pages/PrepStation'
import GrillStation from './kds/pages/GrillStation'
import DrinksStation from './kds/pages/DrinksStation'
import ExpediteScreen from './kds/pages/ExpediteScreen'
import SettingsPage from './kds/pages/SettingsPage'
import LoginPage from './kds/pages/Login'
import RegisterPage from './kds/pages/Register'

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null')
  } catch {
    return null
  }
}

const hasKdsAccess = () => {
  const user = getCurrentUser()
  return user && (user.role === 'Manager' || user.canAccessKds)
}

const KdsGuard = ({ children }: { children: React.ReactNode }) => {
  if (!hasKdsAccess()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}


const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Toaster />
        <Routes>
          <Route path="/login" element={hasKdsAccess() ? <Navigate to="/kds/main" replace /> : <LoginPage />} />
          <Route path="/register" element={hasKdsAccess() ? <Navigate to="/kds/main" replace /> : <RegisterPage />} />
          <Route path="/" element={<Navigate to={hasKdsAccess() ? '/kds/main' : '/login'} replace />} />
          <Route path="/kds/main" element={<KdsGuard><MainKDS /></KdsGuard>} />
          <Route path="/kds/prep" element={<KdsGuard><PrepStation /></KdsGuard>} />
          <Route path="/kds/grill" element={<KdsGuard><GrillStation /></KdsGuard>} />
          <Route path="/kds/drinks" element={<KdsGuard><DrinksStation /></KdsGuard>} />
          <Route path="/kds/expedite" element={<KdsGuard><ExpediteScreen /></KdsGuard>} />
          <Route path="/kds/settings" element={<KdsGuard><SettingsPage /></KdsGuard>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App