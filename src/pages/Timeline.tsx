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

    if (loading) return <div className="p-4 text-center text-slate-500">Carregando extrato...</div>

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Extrato</h1>
            </header>

            {groupedTransactions.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400">Nenhuma transação registrada.</p>
                </div>
            )}

            <div className="space-y-6">
                {groupedTransactions.map(group => (
                    <div key={group.date}>
                        <h3 className="text-sm font-medium text-slate-500 mb-3 ml-2 sticky top-[70px] bg-slate-50 py-2 z-10">
                            {format(parseISO(group.date), "dd 'de' MMMM", { locale: ptBR })}
                            <span className="text-slate-400 font-normal ml-2">
                                {format(parseISO(group.date), "EEEE", { locale: ptBR })}
                            </span>
                        </h3>
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {group.items.map((t, index) => (
                                <div key={t.id} className={`p-4 flex items-center justify-between ${index !== group.items.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.amount < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                                            }`}>
                                            {t.amount < 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{t.description}</p>
                                            <div className="flex items-center text-xs text-slate-500 space-x-2">
                                                <span>{getCategoryName(t.category_id)}</span>
                                                <span>•</span>
                                                {t.card_id ? (
                                                    <span className="flex items-center">
                                                        <CardIcon size={10} className="mr-1" />
                                                        {getCardName(t.card_id)}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <Wallet size={10} className="mr-1" />
                                                        {getAccountName(t.account_id)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${t.amount < 0 ? 'text-slate-900' : 'text-green-600'}`}>
                                            {formatCurrency(t.amount)}
                                        </p>
                                        <p className="text-xs text-slate-400 capitalize">{t.status}</p>
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
