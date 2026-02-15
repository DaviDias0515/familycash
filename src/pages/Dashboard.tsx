import { useState } from 'react'
import { useFinanceEngine } from '../hooks/useFinanceEngine'
import { useFamilyData } from '../hooks/useFamilyData'
import { HomeHeader } from '../components/layout/HomeHeader'
import { CreditCard, Wallet, Plus } from 'lucide-react'

export function Dashboard() {
    const { accounts, transactions, cards, statements, loading } = useFamilyData()
    const [selectedDate, setSelectedDate] = useState(new Date())

    const {
        availableNow,
        projectedBalance,
        monthlyFlow,
        cardUtilizations,
        monthlyCumulativeBalance
    } = useFinanceEngine({
        accounts,
        transactions,
        cards,
        statements,
        targetDate: selectedDate
    })

    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 text-sm font-medium animate-pulse">Sincronizando Aura...</p>
            </div>
        )
    }

    return (
        <div className="pb-32 bg-background min-h-screen transition-colors duration-300">
            <HomeHeader
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                availableNow={availableNow}
                projectedBalance={projectedBalance}
                monthlyFlow={monthlyFlow}
                monthlyData={monthlyCumulativeBalance}
            />

            <div className="px-4 space-y-6">
                {/* Credit Cards Section - Bento Style */}
                {cardUtilizations.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                <CreditCard size={16} className="text-primary" />
                                Cartões
                            </h3>
                        </div>

                        <div className="grid gap-4">
                            {cardUtilizations.map(card => {
                                const percentage = Math.min((card.limit_used / card.credit_limit) * 100, 100)
                                const isHighUsage = percentage > 80

                                return (
                                    <div key={card.id} className="relative group bg-surface rounded-2xl p-5 border border-border shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)] dark:hover:border-primary/30 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHighUsage ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                                    <CreditCard size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{card.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium tracking-wide">**** **** 1234</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Fatura Atual</p>
                                                <p className="font-bold text-foreground text-lg">{formatBRL(card.limit_used)}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isHighUsage ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className={isHighUsage ? 'text-rose-500' : 'text-indigo-500'}>{percentage.toFixed(0)}% Utilizado</span>
                                                <span className="text-slate-400">Disp: {formatBRL(card.limit_available)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Accounts Placeholder if empty */}
                {accounts.length === 0 && (
                    <div className="border border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-surface-subtle/50">
                        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-4">
                            <Wallet size={32} />
                        </div>
                        <h3 className="text-foreground font-semibold mb-1">Nenhuma conta</h3>
                        <p className="text-slate-500 text-sm mb-4">Adicione suas contas bancárias para ver o fluxo.</p>
                        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
                            <Plus size={16} />
                            Adicionar Conta
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
