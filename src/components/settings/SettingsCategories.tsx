import { useState, useEffect } from 'react'
import { Plus, Tag, ChevronLeft, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { CategoryFormModal } from './CategoryFormModal'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { Category } from '../../types'
import { CATEGORY_COLORS, getIconComponent } from '../../utils/categoryOptions'

export function SettingsCategories() {
    const { profile } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense')
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

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

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setShowForm(true)
    }

    const handleCloseModal = () => {
        setShowForm(false)
        setEditingCategory(null)
    }

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering edit
        setExpandedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    // Filter and Group Logic
    const filteredCategories = categories.filter(c => c.kind === activeTab)
    const parentCategories = filteredCategories.filter(c => !c.parent_id)

    const getSubcategories = (parentId: string) => {
        return filteredCategories.filter(c => c.parent_id === parentId)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-24 md:pb-0">
            {/* Header with Toggle */}
            <div className="flex flex-col gap-4">
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
                                <Tag className="w-5 h-5 mr-2 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                Categorias
                            </h2>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-500 text-white border-none shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Categoria
                        </Button>
                    </div>
                </div>

                {/* Cyber Toggle */}
                <div className="flex p-1 bg-surface border border-white/10 rounded-2xl max-w-sm">
                    <button
                        onClick={() => setActiveTab('expense')}
                        className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === 'expense'
                            ? 'bg-rose-500/20 text-rose-400 shadow-sm border border-rose-500/20'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Despesas
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === 'income'
                            ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Receitas
                    </button>
                </div>
            </div>

            <CategoryFormModal
                isOpen={showForm}
                onClose={handleCloseModal}
                onSuccess={fetchCategories}
                categoryToEdit={editingCategory}
            />

            {loading ? (
                <div className="text-center py-10 text-slate-400 animate-pulse">Carregando categorias...</div>
            ) : parentCategories.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Tag className="text-slate-600" size={32} />
                    </div>
                    <p className="text-slate-300 font-medium">Nenhuma categoria encontrada.</p>
                    <p className="text-sm text-slate-500 mt-1 mb-6">Crie categorias para organizar suas finanças.</p>
                    <Button variant="ghost" className="text-purple-400 hover:bg-purple-500/10" onClick={() => setShowForm(true)}>Criar primeira categoria</Button>
                </div>
            ) : (
                <div className="grid gap-3">
                    {parentCategories.map(cat => {
                        const subcategories = getSubcategories(cat.id)
                        const hasSubs = subcategories.length > 0
                        const isExpanded = expandedCategories.includes(cat.id)
                        const IconComponent = getIconComponent(cat.icon || 'Tag')
                        const colorTheme = CATEGORY_COLORS.find(c => c.name === cat.color) || CATEGORY_COLORS.find(c => c.name === 'Slate')!

                        return (
                            <div key={cat.id} className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                    onClick={() => handleEdit(cat)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.shadow} transition-all`}>
                                            <IconComponent size={20} className={colorTheme.class} />
                                        </div>
                                        <span className="font-bold text-white text-lg">{cat.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {hasSubs && (
                                            <button
                                                onClick={(e) => toggleExpand(cat.id, e)}
                                                className="p-3 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-90"
                                            >
                                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(cat.id, cat.name)
                                            }}
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Subcategories */}
                                {hasSubs && isExpanded && (
                                    <div className="bg-[#0A0A0B] border-t border-white/5 p-2 pl-4 animate-in slide-in-from-top-2 duration-200">
                                        {subcategories.map(sub => {
                                            const SubIcon = getIconComponent(sub.icon || 'Tag')
                                            const subColor = CATEGORY_COLORS.find(c => c.name === sub.color) || CATEGORY_COLORS.find(c => c.name === 'Slate')!

                                            return (
                                                <div
                                                    key={sub.id}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors ml-4 border-l border-white/10 pl-4 my-1 cursor-pointer"
                                                    onClick={() => handleEdit(sub)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-1.5 rounded-lg ${subColor.bg} opacity-80`}>
                                                            <SubIcon size={14} className={subColor.class} />
                                                        </div>
                                                        <span className="text-slate-300 font-medium">{sub.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDelete(sub.id, sub.name)
                                                        }}
                                                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Mobile FAB */}
            <button
                onClick={() => setShowForm(true)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center active:scale-95 transition-transform z-50 border border-white/20"
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>
        </div>
    )
}
