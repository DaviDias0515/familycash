import { useState, useEffect } from 'react'
import { Plus, Tag, ChevronLeft, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { CategoryFormModal } from './CategoryFormModal'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { Category } from '../../types'

export function SettingsCategories() {
    const { profile } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCategories = async () => {
        if (!profile?.family_id) return
        setLoading(true)
        const { data } = await supabase
            .from('categories')
            .select('*')
            .eq('family_id', profile.family_id)
            .order('name')

        if (data) setCategories(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [profile?.family_id])

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja apagar a categoria "${name}"?`)) return

        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) {
            alert('Erro ao apagar categoria. Verifique se ela está em uso.')
        } else {
            fetchCategories()
        }
    }

    const grouped = {
        income: categories.filter(c => c.kind === 'income'),
        expense: categories.filter(c => c.kind === 'expense'),
        credit_card: categories.filter(c => c.kind === 'credit_card'),
        transfer: categories.filter(c => c.kind === 'transfer'),
    }

    const labelMap: Record<string, string> = {
        income: 'Receitas',
        expense: 'Despesas',
        credit_card: 'Cartão de Cŕedito',
        transfer: 'Transferências'
    }

    const colors: Record<string, string> = {
        income: 'text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]',
        expense: 'text-rose-400 bg-rose-500/10 shadow-[0_0_10px_rgba(251,113,133,0.2)]',
        credit_card: 'text-amber-400 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
        transfer: 'text-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-24 md:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <Link
                        to="/settings"
                        className="p-1 -ml-1 mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="text-lg font-bold text-white flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-purple-400" />
                        Categorias
                    </h2>
                </div>

                <div className="hidden md:block">
                    <Button variant="outline" onClick={() => setShowForm(true)} className="py-2">
                        <Plus className="w-4 h-4 mr-1" />
                        Nova Categoria
                    </Button>
                </div>
            </div>

            <CategoryFormModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={fetchCategories}
            />

            {loading ? (
                <div className="text-center py-10 text-slate-400">Carregando...</div>
            ) : categories.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-slate-500">Nenhuma categoria encontrada.</p>
                    <Button variant="ghost" className="mt-2 text-purple-400" onClick={() => setShowForm(true)}>Criar primeira categoria</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {(Object.keys(grouped) as Array<keyof typeof grouped>).map(key => {
                        const items = grouped[key]
                        if (items.length === 0) return null

                        return (
                            <div key={key}>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    {labelMap[key]}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {items.map(cat => (
                                        <div key={cat.id} className="flex items-center justify-between p-3 bg-surface border border-white/5 rounded-xl shadow-sm hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${colors[key]}`}>
                                                    <Tag size={16} />
                                                </div>
                                                <span className="font-medium text-white">{cat.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Mobile FAB */}
            <button
                onClick={() => setShowForm(true)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center active:scale-95 transition-transform z-50"
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>
        </div>
    )
}
