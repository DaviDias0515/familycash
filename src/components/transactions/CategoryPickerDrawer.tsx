import { useState, useEffect } from 'react'
import { Search, X, Tag, Check, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { Category } from '../../types'

interface CategoryPickerDrawerProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (category: Category) => void
    selectedCategoryId?: string
}

export function CategoryPickerDrawer({ isOpen, onClose, onSelect, selectedCategoryId }: CategoryPickerDrawerProps) {
    const { profile } = useAuth()
    const [categories, setCategories] = useState<Category[]>([])
    const [search, setSearch] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchCategories()
            // Delay to allow mount before transition
            requestAnimationFrame(() => setIsVisible(true))
        } else {
            setIsVisible(false)
            setSearch('')
        }
    }, [isOpen])

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

    if (!isOpen && !isVisible) return null

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 300)
    }

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    const colors: Record<string, string> = {
        income: 'text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]',
        expense: 'text-rose-400 bg-rose-500/10 shadow-[0_0_10px_rgba(251,113,133,0.2)]',
        credit_card: 'text-amber-400 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
        transfer: 'text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
    }

    return (
        <div className="fixed inset-0 z-[160] flex flex-col justify-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className={`relative bg-[#121214] rounded-t-3xl border-t border-white/10 h-[80vh] flex flex-col transition-transform duration-300 ease-out transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>

                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Selecionar Categoria</h3>
                    <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar categoria..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="text-center py-10 text-slate-500 animate-pulse">Carregando categorias...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">Nenhuma categoria encontrada.</div>
                    ) : (
                        filtered.map(cat => {
                            const isSelected = selectedCategoryId === cat.id
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        onSelect(cat)
                                        handleClose()
                                    }}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.98] ${isSelected
                                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                        : 'bg-surface border-white/5 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${colors[cat.kind] || 'bg-slate-500/10 text-slate-400'}`}>
                                            <Tag size={18} />
                                        </div>
                                        <div className="text-left">
                                            <span className={`block font-medium ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                                                {cat.name}
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected ? (
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <Check size={14} className="text-emerald-400" />
                                        </div>
                                    ) : (
                                        <ChevronRight size={16} className="text-slate-600" />
                                    )}
                                </button>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
