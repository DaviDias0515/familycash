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
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-sm glass-panel p-6 md:p-8 rounded-2xl shadow-2xl space-y-8 relative z-10 border border-white/10">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        FamilyCash
                    </h1>
                    <p className="text-slate-400">Entre para gerenciar suas finanças</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="seu@email.com"
                    />
                    <Input
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                    <div className="pt-2">
                        <Button type="submit" className="w-full shadow-lg shadow-cyan-500/20" isLoading={loading}>
                            Entrar
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-500">Não tem uma conta? </span>
                    <Link to="/register" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline transition-colors">
                        Criar conta
                    </Link>
                </div>
            </div>

            <footer className="absolute bottom-4 text-center text-xs text-slate-600">
                &copy; {new Date().getFullYear()} FamilyCash. Cyber Neon Edition.
            </footer>
        </div>
    )
}
