import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input, Select } from '../ui'
import type { AccountType } from '../../types'

interface AccountFormProps {
    onSuccess: () => void
    onCancel: () => void
}

interface FamilyMember {
    id: string
    full_name: string
}

export function AccountForm({ onSuccess, onCancel }: AccountFormProps) {
    const { profile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [type, setType] = useState<AccountType>('corrente')
    const [initialBalance, setInitialBalance] = useState('')
    const [ownerId, setOwnerId] = useState(profile?.id || '')
    const [members, setMembers] = useState<FamilyMember[]>([])
    const [error, setError] = useState('')

    // Fetch members
    useEffect(() => {
        if (!profile?.family_id) {
            console.log('Skipping member fetch: No family_id')
            return
        }

        console.log('Fetching members for family:', profile.family_id)

        supabase
            .from('profiles')
            .select('id, full_name')
            .eq('family_id', profile.family_id)
            .then(({ data, error }) => {
                if (data) {
                    setMembers(data)
                    if (!ownerId && profile?.id) {
                        setOwnerId(profile.id)
                    }
                }
                if (error) {
                    console.error('Error fetching members:', error)
                }
            })
    }, [profile?.family_id, profile?.id, ownerId])

    // Ensure ownerId is set once profile is loaded
    useEffect(() => {
        if (profile?.id && !ownerId) {
            setOwnerId(profile.id)
        }
    }, [profile?.id, ownerId])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!profile?.family_id) throw new Error('Família não encontrada')

            const { error: insertError } = await supabase
                .from('accounts')
                .insert({
                    family_id: profile.family_id,
                    owner_id: ownerId,
                    name,
                    type,
                    initial_balance: parseFloat(initialBalance) || 0
                })

            if (insertError) throw insertError

            onSuccess()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Ocorreu um erro desconhecido')
            }
        } finally {
            setLoading(false)
        }
    }

    const accountTypes = [
        { value: 'corrente', label: 'Conta Corrente' },
        { value: 'poupanca', label: 'Poupança' },
        { value: 'investimento', label: 'Investimento' },
        { value: 'dinheiro', label: 'Dinheiro Físico' },
    ]

    const memberOptions = [
        { value: '', label: 'Selecione um dono' },
        ...members.map(member => ({
            value: member.id,
            label: member.full_name || 'Membro sem nome'
        }))
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <Input
                label="Nome da Conta"
                placeholder="Ex: Nubank, Itaú, Carteira"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />

            <Select
                label="Tipo da Conta"
                value={type}
                onChange={(val) => setType(val as AccountType)}
                options={accountTypes}
            />

            <div className="space-y-1">
                <Select
                    label="Proprietário"
                    value={ownerId}
                    onChange={(val) => setOwnerId(val)}
                    options={memberOptions}
                />
                <p className="text-xs text-slate-500 ml-1">Quem é o dono principal desta conta?</p>
            </div>

            <Input
                label="Saldo Inicial"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={initialBalance}
                onChange={e => setInitialBalance(e.target.value)}
                required
            />

            <div className="flex space-x-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
                <Button type="submit" isLoading={loading} className="flex-1">Salvar</Button>
            </div>
        </form>
    )
}
