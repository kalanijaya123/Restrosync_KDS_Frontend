// src/kds/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainKDS from './pages/MainKDS'
import PrepStation from './pages/PrepStation'
import GrillStation from './pages/GrillStation'
import DrinksStation from './pages/DrinksStation'
import ExpediteScreen from './pages/ExpediteScreen'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/kds/main" />} />

        {/* MAIN SCREENS — OPEN THESE URLs */}
        <Route path="/kds/main" element={<MainKDS />} />
        <Route path="/kds/prep" element={<PrepStation />} />
        <Route path="/kds/grill" element={<GrillStation />} />
        <Route path="/kds/drinks" element={<DrinksStation />} />
        <Route path="/kds/expedite" element={<ExpediteScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App