import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '../../components/ui'

export function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error
            navigate('/')
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Erro ao realizar login')
            } else {
                setError('Erro ao realizar login')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">FamilyCash</h1>
                    <p className="text-slate-500">Entre para gerenciar suas finanças</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full" isLoading={loading}>
                        Entrar
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-500">Não tem uma conta? </span>
                    <Link to="/register" className="text-blue-600 font-medium hover:underline">
                        Criar conta
                    </Link>
                </div>
            </div>
        </div>
    )
}
