import { useMemo } from 'react'
import { useFamilyData } from '../hooks/useFamilyData'
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'

export function Budgets() {
    const { budgets, transactions, categories, loading } = useFamilyData()

    const budgetProgress = useMemo(() => {
        const now = new Date()
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)

        // Filter transactions for this month and expenses only
        const monthTransactions = transactions.filter(t => {
            const date = parseISO(t.date)
            return isWithinInterval(date, { start: monthStart, end: monthEnd }) && t.amount < 0
        })

        // Calculate spent per category (absolute value)
        const spentByCategory: Record<string, number> = {}
        monthTransactions.forEach(t => {
            const catId = t.category_id
            spentByCategory[catId] = (spentByCategory[catId] || 0) + Math.abs(t.amount)
        })

        // Map budgets to progress
        return budgets.map(b => {
            const spent = spentByCategory[b.category_id] || 0
            const percentage = Math.min((spent / b.amount) * 100, 100)
            return {
                ...b,
                spent,
                percentage,
                categoryName: categories.find(c => c.id === b.category_id)?.name || 'Desconhecida'
            }
        }).sort((a, b) => b.percentage - a.percentage) // Sort by most used

    }, [budgets, transactions, categories])

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    if (loading) return <div className="p-4 text-center text-slate-500">Carregando orçamentos...</div>

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Orçamentos Mensais</h1>
                {/* Placeholder for Add Budget */}
            </header>

            {budgetProgress.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400">Nenhum orçamento definido para este mês.</p>
                    <p className="text-sm text-slate-400 mt-2">Defina limites de gastos por categoria nos Ajustes.</p>
                </div>
            )}

            <div className="grid gap-4">
                {budgetProgress.map(item => (
                    <div key={item.id} className="p-4 bg-white rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-slate-900">{item.categoryName}</span>
                            <span className="text-sm font-medium text-slate-500">
                                {formatCurrency(item.spent)} <span className="text-xs font-normal opacity-70">de {formatCurrency(item.amount)}</span>
                            </span>
                        </div>

                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 rounded-full ${item.percentage >= 100 ? 'bg-red-500' :
                                        item.percentage >= 80 ? 'bg-orange-400' : 'bg-blue-500'
                                    }`}
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                            <span>{item.percentage.toFixed(0)}% utilizado</span>
                            <span>Restam {formatCurrency(Math.max(item.amount - item.spent, 0))}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
