import { useState } from 'react'
import { useFinanceEngine } from '../hooks/useFinanceEngine'
import { useFamilyData } from '../hooks/useFamilyData'
import { HomeHeader } from '../components/layout/HomeHeader'
import { MonthSelector } from '../components/ui/MonthSelector'

export function Dashboard() {
    const { accounts, transactions, cards, statements, loading } = useFamilyData()
    const [selectedDate, setSelectedDate] = useState(new Date())

    const { availableNow, projectedBalance, cardUtilizations } = useFinanceEngine({
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
            {/* 1. Header & Month Selector */}
            <div className="space-y-4">
                <HomeHeader />
                <MonthSelector
                    selectedDate={selectedDate}
                    onChange={setSelectedDate}
                />
            </div>

            <div className="grid gap-4">
                {/* 2. Balance Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Saldo Atual (Real) */}
                    <div className="relative p-6 rounded-2xl overflow-hidden group bg-surface border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent"></div>
                        <div className="relative z-10">
                            <p className="text-sm text-cyan-200/80 font-medium uppercase tracking-wider">Saldo Atual</p>
                            <p className="text-3xl font-bold mt-1 text-white">
                                {formatBRL(availableNow)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Disponível em conta hoje</p>
                        </div>
                    </div>

                    {/* Saldo Previsto (Projeção) */}
                    <div className="p-6 rounded-2xl overflow-hidden bg-surface/50 border border-white/5 border-dashed">
                        <div className="relative z-10">
                            <p className="text-sm text-purple-200/80 font-medium uppercase tracking-wider">
                                Previsão {selectedDate.toLocaleString('pt-BR', { month: 'long' })}
                            </p>
                            <div className="flex items-end space-x-2 mt-1">
                                <p className="text-3xl font-bold text-white/90">
                                    {formatBRL(projectedBalance)}
                                </p>
                            </div>

                            <div className="flex items-center space-x-2 mt-2">
                                {projectedBalance < availableNow ? (
                                    <span className="text-xs text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded">
                                        ↓ Caindo
                                    </span>
                                ) : (
                                    <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded">
                                        ↑ Subindo
                                    </span>
                                )}
                                <p className="text-xs text-slate-500">após pendências do mês</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Cartões (Keep existing logic for now) */}
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
