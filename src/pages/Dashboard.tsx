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
        return <div className="p-4 text-center text-slate-500">Carregando finanças...</div>
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
                    <p className="text-slate-500">Bem-vindo ao FamilyCash</p>
                </div>
                {/* Quick Actions placeholder */}
                {/* <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
            <Plus size={24} />
        </button> */}
            </header>

            <div className="grid gap-4">
                {/* Disponível Agora */}
                <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm opacity-80 font-medium">Disponível Agora</p>
                        <p className="text-3xl font-bold mt-1 tracking-tight">{formatBRL(availableNow)}</p>
                        <p className="text-xs opacity-70 mt-2">Saldo real em contas</p>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                </div>

                {/* Projeção */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Projeção Fim do Mês</p>
                    <div className="flex items-end space-x-2 mt-1">
                        <p className="text-2xl font-semibold text-slate-900">{formatBRL(projectedBalance)}</p>
                        {projectedBalance < availableNow && (
                            <span className="text-xs text-red-500 mb-1 font-medium">↓ Caindo</span>
                        )}
                        {projectedBalance > availableNow && (
                            <span className="text-xs text-green-500 mb-1 font-medium">↑ Subindo</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Considerando pendentes do mês</p>
                </div>

                {/* Cartões */}
                {cardUtilizations.length > 0 && (
                    <h2 className="text-lg font-semibold text-slate-900 mt-2">Cartões de Crédito</h2>
                )}
                {cardUtilizations.map(card => (
                    <div key={card.id} className="p-4 bg-slate-800 text-white rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">{card.name}</p>
                            {/* Placeholder for statement status */}
                            <span className="text-[10px] uppercase tracking-wider bg-slate-700 px-2 py-1 rounded text-slate-300">
                                Fatura
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="opacity-70">Utilizado</span>
                                <span className="font-medium text-orange-400">{formatBRL(card.limit_used)}</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                                    style={{ width: `${Math.min((card.limit_used / card.credit_limit) * 100, 100)}% ` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs opacity-60 pt-1">
                                <span>Disponível {formatBRL(card.limit_available)}</span>
                                <span>Limite {formatBRL(card.credit_limit)}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {accounts.length === 0 && (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl mt-4">
                        <p className="text-slate-400 mb-2">Nenhuma conta cadastrada</p>
                        <p className="text-sm text-slate-400">Cadastre contas e cartões em Ajustes</p>
                    </div>
                )}
            </div>
        </div>
    )
}
