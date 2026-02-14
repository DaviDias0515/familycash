import { useMemo } from 'react'
import { useFamilyData } from '../hooks/useFamilyData'
import { format, parseISO, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowDownLeft, ArrowUpRight, CreditCard as CardIcon, Wallet, Filter, Calendar as CalendarIcon } from 'lucide-react'
import type { Category } from '../types'

export function Timeline() {
    const { transactions, categories, accounts, cards, loading } = useFamilyData()

    const groupedTransactions = useMemo(() => {
        // Sort desc
        const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        // Group
        const grouped: { date: string; items: typeof transactions }[] = []

        sorted.forEach(t => {
            const lastGroup = grouped[grouped.length - 1]
            if (lastGroup && isSameDay(parseISO(lastGroup.date), parseISO(t.date))) {
                lastGroup.items.push(t)
            } else {
                grouped.push({ date: t.date, items: [t] })
            }
        })

        return grouped
    }, [transactions])

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    const getCategoryName = (id: string) => categories.find((c: Category) => c.id === id)?.name || 'Sem categoria'
    const getAccountName = (id: string | null) => id ? accounts.find(a => a.id === id)?.name : null
    const getCardName = (id: string | null) => id ? cards.find(c => c.id === id)?.name : null

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
            <p className="text-slate-400 text-sm tracking-widest uppercase animate-pulse">Carregando Dados...</p>
        </div>
    )

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            {/* Header / Filter Area */}
            <header className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Extrato</h1>
                    <p className="text-xs text-cyan-400 tracking-widest uppercase mt-1">Histórico Completo</p>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                        <Filter size={20} />
                    </button>
                    <button className="p-2 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                        <CalendarIcon size={20} />
                    </button>
                </div>
            </header>

            {/* Summary Widget (Mini) - Optional, just for decoration/context */}
            {/* <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 ... stats ...
            </div> */}

            {groupedTransactions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 mx-2">
                    <div className="w-16 h-16 rounded-full bg-surface border border-white/5 flex items-center justify-center mb-4 text-slate-500">
                        <Filter size={32} strokeWidth={1.5} />
                    </div>
                    <p className="text-slate-300 font-medium">Nenhum registro encontrado</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">Suas transações aparecerão aqui. Comece adicionando uma nova receita ou despesa.</p>
                </div>
            )}

            <div className="space-y-6">
                {groupedTransactions.map(group => (
                    <div key={group.date} className="relative">
                        {/* Sticky Date Header with Cyber/Tech styling */}
                        <div className="sticky top-[70px] z-10 py-3 mb-2 flex items-center bg-background/95 backdrop-blur-xl border-b border-white/5">
                            <div className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_10px_#22d3ee] mr-3" />
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {format(parseISO(group.date), "dd 'de' MMMM", { locale: ptBR })}
                            </h3>
                            <span className="text-slate-600 text-[10px] ml-2 font-mono uppercase border border-white/5 px-2 py-0.5 rounded-full">
                                {format(parseISO(group.date), "EEEE", { locale: ptBR })}
                            </span>
                        </div>

                        {/* List Items */}
                        <div className="space-y-2">
                            {group.items.map((t) => (
                                <div
                                    key={t.id}
                                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden"
                                >
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className="flex items-center space-x-4 relative z-10">
                                        {/* Icon Box */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${t.amount < 0
                                            ? 'bg-rose-500/5 border-rose-500/20 text-rose-500 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                                            : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                            }`}>
                                            {t.amount < 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-white text-sm md:text-base group-hover:text-cyan-50 transition-colors">
                                                {t.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-slate-500">{getCategoryName(t.category_id)}</span>

                                                {/* Account/Card Tag */}
                                                {(t.card_id || t.account_id) && (
                                                    <div className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${t.card_id
                                                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                                                            : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                                        }`}>
                                                        {t.card_id ? (
                                                            <>
                                                                <CardIcon size={10} className="mr-1" />
                                                                {getCardName(t.card_id)}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Wallet size={10} className="mr-1" />
                                                                {getAccountName(t.account_id)}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right relative z-10">
                                        <p className={`font-mono font-bold tracking-tight ${t.amount < 0
                                                ? 'text-white'
                                                : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                                            }`}>
                                            {formatCurrency(t.amount)}
                                        </p>
                                        <div className="flex justify-end mt-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${t.status === 'pago' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
