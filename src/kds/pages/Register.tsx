import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const RegisterPage = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
    const [errors, setErrors] = useState<{ [k: string]: string }>({})
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    const validate = () => {
        const e: any = {}
        if (!form.username || form.username.trim().length < 3) e.username = 'Username must be at least 3 characters.'
        if (!EMAIL_RE.test(form.email)) e.email = 'Please enter a valid email address.'
        if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!validate()) return
        setSubmitting(true)

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    role: 'Staff',
                    canAccessPos: false,
                    canAccessKds: false,
                    canAccessOnlineOrder: false,
                    canManageDiscounts: false
                })
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data?.error || data?.message || 'Registration failed.')
            }

            navigate('/login', { replace: true })
        } catch (error: any) {
            setErrors({ general: error?.message || 'Registration failed. Try again.' })
        } finally {
            setSubmitting(false)
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
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-10">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-1">Create Account</h1>
                <p className="text-sm text-center text-gray-500 mb-8">Join RestroSync KDS</p>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="e.g. kds.staff"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.username ? 'border-red-400' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="kitchen@restrosync.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-400' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.password ? 'border-red-400' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-70 text-white font-bold py-4 rounded-lg text-lg transition shadow-lg"
                    >
                        {submitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold hover:underline text-orange-700">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage