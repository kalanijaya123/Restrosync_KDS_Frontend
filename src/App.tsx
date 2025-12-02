import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MainKDS from './kds/pages/MainKDS'
import PrepStation from './kds/pages/PrepStation'
import GrillStation from './kds/pages/GrillStation'
import DrinksStation from './kds/pages/DrinksStation'
import ExpediteScreen from './kds/pages/ExpediteScreen'


const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">

        <Routes>
          <Route path="/" element={<MainKDS />} />
          <Route path="/kds/main" element={<MainKDS />} />
          <Route path="/kds/prep" element={<PrepStation />} />
          <Route path="/kds/grill" element={<GrillStation />} />
          <Route path="/kds/expedite" element={<ExpediteScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App