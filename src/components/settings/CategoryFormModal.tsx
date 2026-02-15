import { useState, useEffect } from 'react'
import { X, Tag, Check, ChevronDown, Grid, Palette } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input } from '../ui'
import type { CategoryKind, Category } from '../../types'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/categoryOptions'

interface CategoryFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    categoryToEdit?: Category | null
}

export function CategoryFormModal({ isOpen, onClose, onSuccess, categoryToEdit }: CategoryFormModalProps) {
    const { profile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [kind, setKind] = useState<CategoryKind>('expense')
    const [selectedIcon, setSelectedIcon] = useState('Tag')
    const [selectedColor, setSelectedColor] = useState('Slate')
    const [parentId, setParentId] = useState<string | null>(null)
    const [potentialParents, setPotentialParents] = useState<Category[]>([])
    const [error, setError] = useState('')

    // Selection Modals State
    const [showIconPicker, setShowIconPicker] = useState(false)
    const [showColorPicker, setShowColorPicker] = useState(false)

    // Reset or Populate Form
    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                setName(categoryToEdit.name)
                setKind(categoryToEdit.kind)
                setSelectedIcon(categoryToEdit.icon || 'Tag')
                setSelectedColor(categoryToEdit.color || 'Slate')
                setParentId(categoryToEdit.parent_id || null)
            } else {
                setName('')
                setKind('expense')
                setSelectedIcon('Tag')
                setSelectedColor('Slate')
                setParentId(null)
            }
            setError('')
        }
    }, [isOpen, categoryToEdit])

    // Fetch potential parents
    useEffect(() => {
        if (isOpen && profile?.family_id) {
            const fetchParents = async () => {
                let query = supabase
                    .from('categories')
                    .select('*')
                    .eq('family_id', profile.family_id)
                    .eq('kind', kind)
                    .is('parent_id', null)
                    .order('name')

                // If editing, exclude itself from being a parent to avoid cycles (simple check)
                if (categoryToEdit) {
                    query = query.neq('id', categoryToEdit.id)
                }

                const { data } = await query
                if (data) setPotentialParents(data)
            }
            fetchParents()
        }
    }, [isOpen, kind, profile?.family_id, categoryToEdit])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!profile?.family_id) throw new Error("Família não identificada")
            if (!name.trim()) throw new Error("Nome é obrigatório")

            const payload = {
                family_id: profile.family_id,
                name: name.trim(),
                kind: kind,
                icon: selectedIcon,
                color: selectedColor,
                parent_id: parentId
            }

            let error;

            if (categoryToEdit) {
                const { error: updateError } = await supabase
                    .from('categories')
                    .update(payload)
                    .eq('id', categoryToEdit.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('categories')
                    .insert(payload)
                error = insertError
            }

            if (error) throw error

            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const currentColor = CATEGORY_COLORS.find(c => c.name === selectedColor) || CATEGORY_COLORS[0]
    const currentIconObj = CATEGORY_ICONS.find(i => i.name === selectedIcon)
    const CurrentIcon = currentIconObj ? currentIconObj.icon : Tag

    // Compact lists (first 4 + 1 trigger)
    const compactColors = CATEGORY_COLORS.slice(0, 4)
    const compactIcons = CATEGORY_ICONS.slice(0, 4)

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

                <div className="relative w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <div className={`p-2 rounded-xl border ${currentColor.bg} ${currentColor.border} ${currentColor.shadow}`}>
                                    <CurrentIcon className={currentColor.class} size={20} />
                                </div>
                                {categoryToEdit ? 'Editar Categoria' : 'Nova Categoria'}
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</div>}

                            {/* Type Toggle */}
                            <div className="flex p-1 bg-surface border border-white/10 rounded-xl">
                                {(['expense', 'income'] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setKind(t)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${kind === t
                                                ? t === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'bg-rose-500/20 text-rose-400 shadow-sm'
                                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {t === 'income' ? 'Receita' : 'Despesa'}
                                    </button>
                                ))}
                            </div>

                            <Input
                                label="Nome"
                                placeholder="Ex: Alimentação"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus={!categoryToEdit}
                            />

                            {/* Parent Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Categoria Pai (Opcional)</label>
                                <div className="relative">
                                    <select
                                        value={parentId || ''}
                                        onChange={e => setParentId(e.target.value || null)}
                                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    >
                                        <option value="">Nenhuma (Categoria Principal)</option>
                                        {potentialParents.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Compact Color Picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cor</label>
                                <div className="flex gap-2">
                                    {compactColors.map(c => (
                                        <button
                                            key={c.name}
                                            type="button"
                                            onClick={() => setSelectedColor(c.name)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${c.bg} ${selectedColor === c.name ? `ring-2 ring-offset-2 ring-offset-[#121214] ring-white scale-110` : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full ${c.class.replace('text-', 'bg-')}`} />
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setShowColorPicker(true)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-surface border border-white/10 hover:bg-white/10 text-slate-400 ${!compactColors.find(c => c.name === selectedColor) ? 'ring-2 ring-offset-2 ring-offset-[#121214] ring-purple-500 text-purple-400' : ''}`}
                                    >
                                        <Palette size={16} />
                                    </button>
                                </div>
                                {!compactColors.find(c => c.name === selectedColor) && (
                                    <p className="text-xs text-slate-500 ml-1">Cor selecionada: <span className={currentColor.class}>{selectedColor}</span></p>
                                )}
                            </div>

                            {/* Compact Icon Picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ícone</label>
                                <div className="flex gap-2">
                                    {compactIcons.map(i => (
                                        <button
                                            key={i.name}
                                            type="button"
                                            onClick={() => setSelectedIcon(i.name)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${selectedIcon === i.name ? `bg-white/10 border-white/30 text-white shadow-lg scale-105` : 'bg-surface border-white/5 text-slate-500 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <i.icon size={20} />
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setShowIconPicker(true)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border bg-surface border-white/10 text-slate-400 hover:bg-white/5 hover:text-white ${!compactIcons.find(i => i.name === selectedIcon) ? 'border-purple-500/50 text-purple-400' : ''}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                </div>
                                {!compactIcons.find(i => i.name === selectedIcon) && (
                                    <p className="text-xs text-slate-500 ml-1">Ícone selecionado: {selectedIcon}</p>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-slate-400 hover:text-white hover:bg-white/5">
                                    Cancelar
                                </Button>
                                <Button type="submit" isLoading={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/20">
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Color Picker Modal (Secondary) */}
            {showColorPicker && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowColorPicker(false)} />
                    <div className="relative w-full max-w-sm bg-[#121214] border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">Escolher Cor</h3>
                            <button onClick={() => setShowColorPicker(false)} className="p-1 text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {CATEGORY_COLORS.map(c => (
                                <button
                                    key={c.name}
                                    onClick={() => { setSelectedColor(c.name); setShowColorPicker(false) }}
                                    className={`aspect-square rounded-full flex items-center justify-center transition-all ${c.bg} ${selectedColor === c.name ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full ${c.class.replace('text-', 'bg-')}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Icon Picker Modal (Secondary) */}
            {showIconPicker && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowIconPicker(false)} />
                    <div className="relative w-full max-w-sm bg-[#121214] border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">Escolher Ícone</h3>
                            <button onClick={() => setShowIconPicker(false)} className="p-1 text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-5 gap-3 overflow-y-auto custom-scrollbar p-1">
                            {CATEGORY_ICONS.map(i => (
                                <button
                                    key={i.name}
                                    onClick={() => { setSelectedIcon(i.name); setShowIconPicker(false) }}
                                    className={`aspect-square rounded-xl flex items-center justify-center transition-all border ${selectedIcon === i.name ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-surface border-white/5 text-slate-500 hover:bg-white/5 hover:text-white'}`}
                                    title={i.label}
                                >
                                    <i.icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
