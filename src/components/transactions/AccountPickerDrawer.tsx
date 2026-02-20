import { useState, useEffect } from 'react'
import { Search, X, Check, Wallet, ChevronRight } from 'lucide-react'
import type { Account } from '../../types'

interface AccountPickerDrawerProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (account: Account) => void
    selectedAccountId?: string
    accounts: Account[]
    title?: string
}

export function AccountPickerDrawer({ isOpen, onClose, onSelect, selectedAccountId, accounts, title = 'Selecionar Conta' }: AccountPickerDrawerProps) {
    const [search, setSearch] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            // Delay to allow mount before transition
            requestAnimationFrame(() => setIsVisible(true))
        } else {
            setIsVisible(false)
            setSearch('')
        }
    }, [isOpen])

    if (!isOpen && !isVisible) return null

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 300)
    }

    const filtered = accounts.filter(acc =>
        acc.name.toLowerCase().includes(search.toLowerCase())
    )

    const typeColors: Record<string, string> = {
        corrente: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
        poupanca: 'bg-blue-500/10 text-blue-500 dark:text-blue-400',
        investimento: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
        dinheiro: 'bg-green-500/10 text-green-500 dark:text-green-400'
    }

    return (
        <div className="fixed inset-0 z-[160] flex flex-col justify-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Drawer - Aura Glass Effect */}
            <div className={`
                relative 
                bg-surface/90 dark:bg-surface/80 backdrop-blur-2xl 
                rounded-t-[2.5rem] 
                border-t border-white/20 
                shadow-[0_-10px_60px_-15px_rgba(0,0,0,0.3)]
                h-[85vh] flex flex-col 
                transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) 
                transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}
            `}>

                {/* Header */}
                <div className="p-6 pb-2 flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-foreground rounded-full hover:bg-surface-subtle/50 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search - Glass Input */}
                <div className="px-6 pb-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar conta..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="
                                w-full 
                                bg-surface-subtle/50 dark:bg-black/20 
                                border border-transparent focus:border-indigo-500/30 
                                rounded-2xl 
                                py-4 pl-12 pr-4 
                                text-foreground placeholder:text-slate-400 
                                focus:outline-none focus:bg-surface-subtle dark:focus:bg-black/40
                                backdrop-blur-md transition-all duration-300
                                shadow-inner
                            "
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-3 scrollbar-hide">
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            Nenhuma conta encontrada.
                        </div>
                    ) : (
                        filtered.map(acc => {
                            const isSelected = selectedAccountId === acc.id
                            return (
                                <button
                                    key={acc.id}
                                    onClick={() => {
                                        onSelect(acc)
                                        handleClose()
                                    }}
                                    className={`
                                        w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 active:scale-[0.96] group
                                        ${isSelected
                                            ? 'bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/10'
                                            : 'bg-surface/50 border-transparent hover:border-border hover:bg-surface-subtle/50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            p-3 rounded-xl transition-transform duration-300 group-hover:scale-110
                                            ${typeColors[acc.type] || 'bg-slate-100 text-slate-400 dark:bg-slate-800'}
                                        `}>
                                            <Wallet size={20} />
                                        </div>
                                        <div className="text-left">
                                            <span className={`block text-base font-semibold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'}`}>
                                                {acc.name}
                                            </span>
                                            <span className="text-xs text-slate-400 capitalize">
                                                {acc.type}
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected ? (
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md animate-in zoom-in spin-in-180 duration-300">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
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
