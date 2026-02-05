import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '../../components/ui'

export function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            // We will handle Profile creation in Onboarding step or via trigger if implemented
            // But user mentioned 'Register -> Onboarding'. 
            // Supabase Auth usually auto-confirms or sends email. Assuming auto-confirm for dev or handling 'session'.

            // If sign up successful, user might need to verify email unless disabled.
            if (data.session) {
                navigate('/onboarding')
            } else {
                setError('Verifique seu email para confirmar o cadastro.')
            }

        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Criar Conta</h1>
                    <p className="text-slate-500">Comece a usar o FamilyCash</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                        label="Nome Completo"
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    // Assuming we pass this to onboarding or save metadata
                    />
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
                        minLength={6}
                    />
                    <Button type="submit" className="w-full" isLoading={loading}>
                        Criar Conta
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-500">Já tem uma conta? </span>
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Entrar
                    </Link>
                </div>
            </div>
        </div>
    )
}
