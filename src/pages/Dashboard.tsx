import { useState } from 'react'
import { useFinanceEngine } from '../hooks/useFinanceEngine'
import { useFamilyData } from '../hooks/useFamilyData'
import { HomeHeader } from '../components/layout/HomeHeader'

export function Dashboard() {
    const { accounts, transactions, cards, statements, loading } = useFamilyData()
    const [selectedDate, setSelectedDate] = useState(new Date())

    const {
        availableNow,
        projectedBalance,
        cardUtilizations,
        monthlyCumulativeBalance
    } = useFinanceEngine({
        accounts,
        transactions,
        cards,
        statements,
        targetDate: selectedDate
    })

    // Format currency
    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    if (loading) {
        return <div className="p-4 text-center text-slate-400 animate-pulse">Carregando finanças...</div>
    }

    return (
        <div className="space-y-6 pb-20">
            {/* New Floating Header with everything included */}
            <HomeHeader
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                availableNow={availableNow}
                projectedBalance={projectedBalance}
                monthlyData={monthlyCumulativeBalance}
            />

            <div className="grid gap-4">
                {/* Cartões (Keep existing logic) */}
                {cardUtilizations.length > 0 && (
                    <h2 className="text-lg font-semibold text-white mt-4 border-l-2 border-purple-500 pl-3">Cartões de Crédito</h2>
                )}
                {cardUtilizations.map(card => (
                    <div key={card.id} className="p-5 bg-surface border border-white/5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            {/* Abstract card bg decoration */}
                            <div className="w-32 h-32 bg-purple-500 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <p className="font-medium text-white">{card.name}</p>
                                <span className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">
                                    Fatura
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Utilizado</span>
                                    <span className="font-medium text-purple-300 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">{formatBRL(card.limit_used)}</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                                        style={{ width: `${Math.min((card.limit_used / card.credit_limit) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 pt-1">
                                    <span>Disponível <span className="text-slate-300">{formatBRL(card.limit_available)}</span></span>
                                    <span>Limite {formatBRL(card.credit_limit)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {accounts.length === 0 && (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl mt-4 bg-white/5">
                        <p className="text-slate-400 mb-2">Nenhuma conta cadastrada</p>
                        <p className="text-sm text-slate-500">Cadastre contas e cartões em Ajustes</p>
                    </div>
                )}
            </div>
        </div>
    )
}
