import { useMemo } from 'react'
import { useFamilyData } from '../hooks/useFamilyData'
import { format, parseISO, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowDownLeft, ArrowUpRight, CreditCard as CardIcon, Wallet } from 'lucide-react'
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

    if (loading) return <div className="p-4 text-center text-slate-400 animate-pulse">Carregando extrato...</div>

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white text-glow">Extrato</h1>
            </header>

            {groupedTransactions.length === 0 && (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-slate-400">Nenhuma transação registrada.</p>
                </div>
            )}

            <div className="space-y-6">
                {groupedTransactions.map(group => (
                    <div key={group.date}>
                        <h3 className="text-sm font-medium text-slate-400 mb-3 ml-2 sticky top-[70px] bg-background/95 backdrop-blur py-2 z-10 border-b border-white/5">
                            {format(parseISO(group.date), "dd 'de' MMMM", { locale: ptBR })}
                            <span className="text-slate-500 font-normal ml-2 capitalize">
                                {format(parseISO(group.date), "EEEE", { locale: ptBR })}
                            </span>
                        </h3>
                        <div className="bg-surface border border-white/5 rounded-2xl shadow-sm overflow-hidden">
                            {group.items.map((t, index) => (
                                <div key={t.id} className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors ${index !== group.items.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.amount < 0
                                            ? 'bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]'
                                            : 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                                            }`}>
                                            {t.amount < 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{t.description}</p>
                                            <div className="flex items-center text-xs text-slate-400 space-x-2">
                                                <span>{getCategoryName(t.category_id)}</span>
                                                <span>•</span>
                                                {t.card_id ? (
                                                    <span className="flex items-center text-purple-300">
                                                        <CardIcon size={10} className="mr-1" />
                                                        {getCardName(t.card_id)}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-cyan-300">
                                                        <Wallet size={10} className="mr-1" />
                                                        {getAccountName(t.account_id)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${t.amount < 0 ? 'text-white' : 'text-emerald-400 text-glow'}`}>
                                            {formatCurrency(t.amount)}
                                        </p>
                                        <p className="text-xs text-slate-500 capitalize">{t.status}</p>
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
