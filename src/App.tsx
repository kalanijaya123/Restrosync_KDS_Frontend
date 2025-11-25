import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MainKDS from './kds/pages/MainKDS'
import PrepStation from './kds/pages/PrepStation'
import GrillStation from './kds/pages/GrillStation'
import DrinksStation from './kds/pages/DrinksStation'
import ExpediteScreen from './kds/pages/ExpediteScreen'

const Navigation = () => (
  <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 shadow-2xl">
    <div className="max-w-7xl mx-auto flex gap-6 justify-center flex-wrap">
      {[
        { to: "/kds/main", label: "Main Kitchen", icon: "Kitchen" },
        { to: "/kds/prep", label: "Prep Station", icon: "Prep" },
        { to: "/kds/grill", label: "Grill/Fryer", icon: "Fire" },
        { to: "/kds/drinks", label: "Drinks Bar", icon: "Drink" },
        { to: "/kds/expedite", label: "Pickup", icon: "Runner" }
      ].map(item => (
        <Link
          key={item.to}
          to={item.to}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-5 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 shadow-xl border border-white/20"
        >
          <span className="text-2xl block mb-2">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<MainKDS />} />
          <Route path="/kds/main" element={<MainKDS />} />
          <Route path="/kds/prep" element={<PrepStation />} />
          <Route path="/kds/grill" element={<GrillStation />} />
          <Route path="/kds/drinks" element={<DrinksStation />} />
          <Route path="/kds/expedite" element={<ExpediteScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App