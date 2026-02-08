import { useFinanceEngine } from '../hooks/useFinanceEngine'
import { useFamilyData } from '../hooks/useFamilyData'

export function Dashboard() {
    const { accounts, transactions, cards, statements, loading } = useFamilyData()

    const { availableNow, projectedBalance, cardUtilizations } = useFinanceEngine({
        accounts,
        transactions,
        cards,
        statements
    })

    // Format currency
    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    if (loading) {
        return <div className="p-4 text-center text-slate-400 animate-pulse">Carregando finanças...</div>
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white text-glow">Visão Geral</h1>
                    <p className="text-slate-400">Bem-vindo ao FamilyCash</p>
                </div>
            </header>

            <div className="grid gap-4">
                {/* Disponível Agora - Cyber Card */}
                <div className="relative p-6 rounded-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-surface border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all group-hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent"></div>

                    <div className="relative z-10">
                        <p className="text-sm text-cyan-200/80 font-medium uppercase tracking-wider">Disponível Agora</p>
                        <p className="text-4xl font-bold mt-2 text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            {formatBRL(availableNow)}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">Saldo real em contas</p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute right-4 bottom-4 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse"></div>
                </div>

                {/* Projeção */}
                <div className="p-5 glass-panel rounded-2xl">
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Projeção Fim do Mês</p>
                    <div className="flex items-end space-x-3 mt-2">
                        <p className="text-2xl font-semibold text-white">{formatBRL(projectedBalance)}</p>
                        {projectedBalance < availableNow && (
                            <span className="text-xs text-red-400 mb-1 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">↓ Caindo</span>
                        )}
                        {projectedBalance > availableNow && (
                            <span className="text-xs text-emerald-400 mb-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">↑ Subindo</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Considerando pendentes do mês</p>
                </div>

                {/* Cartões */}
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
