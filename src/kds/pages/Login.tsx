import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Login failed')
      }

      const authUser = data.user || data
      const currentUser = {
        id: authUser.id || '',
        name: authUser.username || username,
        email: authUser.email || '',
        role: authUser.role || 'Staff',
        canAccessPos: Boolean(authUser.canAccessPos),
        canAccessKds: Boolean(authUser.canAccessKds),
        canAccessOnlineOrder: Boolean(authUser.canAccessOnlineOrder),
        canManageDiscounts: Boolean(authUser.canManageDiscounts)
      }

      if (currentUser.role !== 'Manager' && !currentUser.canAccessKds) {
        setError('KDS access has not been granted by a manager yet.')
        return
      }

      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      navigate('/kds/main')
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(251, 207, 232, 0.48), transparent 34%), radial-gradient(circle at top right, rgba(196, 181, 253, 0.42), transparent 30%), linear-gradient(180deg, #fff7ed 0%, #fffbeb 55%, #fef3c7 100%)'
      }}
    >
      <form onSubmit={handleLogin} className="bg-white text-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-1">KDS Access</h1>
        <p className="text-sm text-center text-gray-500 mb-8">Sign in to RestroSync Kitchen Display System</p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-70 text-white font-bold py-4 rounded-lg text-lg transition shadow-lg"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-center mt-8 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold hover:underline text-orange-700">
            Create one
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage