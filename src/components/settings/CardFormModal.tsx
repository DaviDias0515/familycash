import { useState } from 'react'
import { X, CreditCard } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui'

interface CardFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CardFormModal({ isOpen, onClose, onSuccess }: CardFormModalProps) {
    const { profile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [limit, setLimit] = useState('')
    const [closingDay, setClosingDay] = useState('')
    const [dueDay, setDueDay] = useState('')
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!profile?.family_id) throw new Error("Família não identificada")
            if (!name.trim()) throw new Error("Nome é obrigatório")
            if (!limit) throw new Error("Limite é obrigatório")
            if (!closingDay || !dueDay) throw new Error("Dias de fechamento e vencimento são obrigatórios")

            const limitValue = parseFloat(limit.replace(',', '.'))
            if (isNaN(limitValue) || limitValue < 0) throw new Error("Limite inválido")

            const closing = parseInt(closingDay)
            const due = parseInt(dueDay)

            if (closing < 1 || closing > 31 || due < 1 || due > 31) throw new Error("Dias devem ser entre 1 e 31")

            const { error: insertError } = await supabase
                .from('credit_cards')
                .insert({
                    family_id: profile.family_id,
                    owner_id: profile.id, // Mandatory field
                    name: name.trim(),
                    credit_limit: limitValue,
                    closing_day: closing,
                    due_day: due
                })

            if (insertError) throw insertError

            // Reset form
            setName('')
            setLimit('')
            setClosingDay('')
            setDueDay('')

            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-[#121214] border border-amber-500/20 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                                <CreditCard className="text-amber-400" size={20} />
                            </div>
                            Novo Cartão
                        </h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">{error}</div>}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nome do Cartão</label>
                            <input
                                type="text"
                                placeholder="Ex: Nubank, Inter..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Limite (R$)</label>
                            <input
                                type="number"
                                placeholder="0,00"
                                value={limit}
                                onChange={e => setLimit(e.target.value)}
                                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600 font-mono"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Dia Fechamento</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    placeholder="Dia"
                                    value={closingDay}
                                    onChange={e => setClosingDay(e.target.value)}
                                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600 text-center"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Dia Vencimento</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    placeholder="Dia"
                                    value={dueDay}
                                    onChange={e => setDueDay(e.target.value)}
                                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600 text-center"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-slate-400 hover:text-white hover:bg-white/5">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 border border-amber-400/20"
                            >
                                Salvar Cartão
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
