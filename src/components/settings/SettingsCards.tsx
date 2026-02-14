import { useState, useEffect } from 'react'
import { Plus, CreditCard, ChevronLeft, Trash2, Calendar, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { CardFormModal } from './CardFormModal'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { CreditCard as CreditCardType } from '../../types'

export function SettingsCards() {
    const { profile } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [cards, setCards] = useState<CreditCardType[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCards = async () => {
        if (!profile?.family_id) return
        setLoading(true)
        const { data } = await supabase
            .from('credit_cards')
            .select('*')
            .eq('family_id', profile.family_id)
            .order('name')

        if (data) setCards(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchCards()
    }, [profile?.family_id])

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja remover o cartão "${name}"?`)) return

        const { error } = await supabase.from('credit_cards').delete().eq('id', id)
        if (error) {
            alert('Erro ao remover cartão. Verifique se existem transações vinculadas.')
        } else {
            fetchCards()
        }
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-24 md:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link
                        to="/settings"
                        className="p-2 -ml-2 mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <CreditCard className="w-6 h-6 mr-2 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            Seus Cartões
                        </h2>
                        <p className="text-xs text-slate-400">Gerencie limites e datas</p>
                    </div>
                </div>

                {/* Desktop Button */}
                <div className="hidden md:block">
                    <Button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-500 text-white border-none shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Cartão
                    </Button>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500 animate-pulse">Carregando cartões...</div>
            ) : cards.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <CreditCard className="text-slate-600" size={32} />
                    </div>
                    <p className="text-slate-300 font-medium">Nenhum cartão cadastrado</p>
                    <p className="text-sm text-slate-500 mt-1 mb-6 max-w-xs mx-auto">Adicione seus cartões de crédito para controlar faturas e limites.</p>
                    <Button onClick={() => setShowForm(true)} variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                        Adicionar Agora
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {cards.map(card => (
                        <div key={card.id} className="group relative bg-surface border border-white/5 rounded-2xl p-5 overflow-hidden transition-all hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-gradient-to-br from-[#222] to-[#111] rounded-xl border border-white/10 shadow-inner">
                                    <CreditCard className="text-amber-400" size={24} />
                                </div>
                                <button
                                    onClick={() => handleDelete(card.id, card.name)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-50 transition-colors">{card.name}</h3>
                            <p className="text-2xl font-mono text-amber-400 font-bold tracking-tight mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                                {formatCurrency(card.credit_limit)}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider flex items-center gap-1 mb-1">
                                        <Calendar size={10} /> Fechamento
                                    </span>
                                    <span className="text-white font-mono">Dia {card.closing_day}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider flex items-center gap-1 mb-1">
                                        <DollarSign size={10} /> Vencimento
                                    </span>
                                    <span className="text-white font-mono">Dia {card.due_day}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CardFormModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={fetchCards}
            />

            {/* Mobile FAB */}
            <button
                onClick={() => setShowForm(true)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center active:scale-95 transition-transform z-50 border border-white/20"
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>
        </div>
    )
}
