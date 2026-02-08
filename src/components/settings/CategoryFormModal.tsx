import { useState } from 'react'
import { X, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input, Select } from '../ui'
import type { CategoryKind } from '../../types'

interface CategoryFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CategoryFormModal({ isOpen, onClose, onSuccess }: CategoryFormModalProps) {
    const { profile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [kind, setKind] = useState<CategoryKind>('expense')
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!profile?.family_id) throw new Error("Família não identificada")
            if (!name.trim()) throw new Error("Nome é obrigatório")

            const { error: insertError } = await supabase
                .from('categories')
                .insert({
                    family_id: profile.family_id,
                    name: name.trim(),
                    kind: kind,
                    // TODO: icon, color auto-gen or selection later
                })

            if (insertError) throw insertError

            setName('')
            onSuccess() // Refresh list
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const kindOptions = [
        { value: 'expense', label: 'Despesa' },
        { value: 'income', label: 'Receita' },
        { value: 'credit_card', label: 'Cartão de Crédito' },
        { value: 'transfer', label: 'Transferência' },
    ]

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-surface border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                <Tag className="text-purple-400" />
                            </div>
                            Nova Categoria
                        </h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</div>}

                        <Input
                            label="Nome"
                            placeholder="Ex: Alimentação, Salário..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />

                        <Select
                            label="Tipo"
                            value={kind}
                            onChange={(val) => setKind(val as CategoryKind)}
                            options={kindOptions}
                        />

                        <div className="pt-4 flex gap-3">
                            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                                Cancelar
                            </Button>
                            <Button type="submit" isLoading={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
                                Salvar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
