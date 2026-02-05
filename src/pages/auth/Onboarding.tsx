import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input } from '../../components/ui'
import { Plus, Users } from 'lucide-react'

export function Onboarding() {
    const { user, profile } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState<'initial' | 'create' | 'join'>('initial')
    const [loading, setLoading] = useState(false)
    const [familyName, setFamilyName] = useState('')
    const [familyId, setFamilyId] = useState('')
    const [error, setError] = useState('')

    // 1. Create Profile first if not exists (usually triggered or manual step)
    // For now we assume register might not have created profile yet if no trigger. 
    // Let's ensure profile exists or upsert it.

    const createFamily = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!user) throw new Error('Usuário não autenticado')

            // STRATEGY: Profile First (Requires profiles.family_id nullable)

            // 1. Create Profile first (if doesn't exist)
            // We upsert with family_id: null initially if creating fresh, or preserve if exists
            // Actually we just ensure it exists with correct name.
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    // Don't overwrite family_id if it exists, but init as null if new
                    // Since upsert replaces, we should be careful. 
                    // Better: Insert if not exists, or Update if exists. 
                    // UPSERT with ignoreDuplicates? No, we want to set name.
                    // Let's assume on create family we are starting fresh or admin.
                    full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Admin',
                    role: 'admin',
                    // We consciously omit family_id here so it stays null (or defaults to null)
                    // But wait, if we are upserting and row exists...
                    // Standard Postgres upsert logic.
                }, { onConflict: 'id' })
            // Note: If profile exists and has family_id, this upsert might nullify it if we pass null?
            // If we don't pass it, it keeps old value? Supabase/Postgres behavior depends.
            // Let's try to just Ensure Profile.

            if (profileError) {
                // Verify if error is just "family_id not null" (before running SQL v2)
                throw profileError
            }

            // 2. Create Family (admin_id = user.id)
            // Now that profile exists, FK works.
            const { data: family, error: familyError } = await supabase
                .from('families')
                .insert({ name: familyName, admin_id: user.id })
                .select()
                .single()

            if (familyError) throw familyError

            // 3. Update Profile to link to family
            const { error: linkError } = await supabase
                .from('profiles')
                .update({ family_id: family.id })
                .eq('id', user.id)

            if (linkError) throw linkError

            window.location.href = '/'
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const joinFamily = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!user) throw new Error('Usuário não autenticado')

            // 1. Check if family exists
            const { data: family, error: fetchError } = await supabase
                .from('families')
                .select('id, name')
                .eq('id', familyId)
                .single()

            if (fetchError || !family) throw new Error('Família não encontrada com este ID')

            // 2. Create/Update Profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    family_id: family.id,
                    full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Novo Membro',
                    role: 'member'
                })

            if (profileError) throw profileError

            navigate('/')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Redirect if already has profile/family
    if (profile?.family_id) {
        navigate('/')
        return null
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Bem-vindo!</h1>
                    <p className="text-slate-500">Para começar, você precisa fazer parte de uma família.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {mode === 'initial' && (
                    <div className="grid gap-4 mt-8">
                        <button
                            onClick={() => setMode('create')}
                            className="flex flex-col items-center p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <h3 className="font-semibold text-slate-900">Criar Nova Família</h3>
                            <p className="text-sm text-slate-500 text-center mt-1">Sou o primeiro da minha família a usar o app</p>
                        </button>

                        <button
                            onClick={() => setMode('join')}
                            className="flex flex-col items-center p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="font-semibold text-slate-900">Entrar em Família Existente</h3>
                            <p className="text-sm text-slate-500 text-center mt-1">Tenho um código de convite (ID da família)</p>
                        </button>
                    </div>
                )}

                {mode === 'create' && (
                    <form onSubmit={createFamily} className="space-y-4">
                        <Input
                            label="Nome da Família"
                            placeholder="Ex: Família Silva"
                            value={familyName}
                            onChange={e => setFamilyName(e.target.value)}
                            required
                        />
                        <div className="flex space-x-3">
                            <Button type="button" variant="ghost" onClick={() => setMode('initial')} className="flex-1">Voltar</Button>
                            <Button type="submit" isLoading={loading} className="flex-1">Criar</Button>
                        </div>
                    </form>
                )}

                {mode === 'join' && (
                    <form onSubmit={joinFamily} className="space-y-4">
                        <Input
                            label="ID da Família"
                            placeholder="Cole o ID aqui"
                            value={familyId}
                            onChange={e => setFamilyId(e.target.value)}
                            required
                        />
                        <div className="flex space-x-3">
                            <Button type="button" variant="ghost" onClick={() => setMode('initial')} className="flex-1">Voltar</Button>
                            <Button type="submit" isLoading={loading} className="flex-1">Entrar</Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
