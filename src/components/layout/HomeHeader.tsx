import { useAuth } from '../../contexts/AuthContext'
import { Bell, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react'
import { MonthYearPicker } from '../ui/MonthYearPicker'
import { MonthlyBalanceChart } from '../charts/MonthlyBalanceChart'
import { usePrivacy } from '../../hooks/usePrivacy'

interface HomeHeaderProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
    availableNow: number
    projectedBalance: number
    monthlyData: { day: number; balance: number }[]
}

export function HomeHeader({
    selectedDate,
    onDateChange,
    availableNow,
    projectedBalance,
    monthlyData
}: HomeHeaderProps) {
    const { profile } = useAuth()
    const { isPrivate, togglePrivacy } = usePrivacy()
    const firstName = profile?.full_name?.split(' ')[0] || 'Usuário'

    const formatCurrency = (val: number) => {
        if (isPrivate) return '••••'
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    }

    const isPositiveMonth = (monthlyData[monthlyData.length - 1]?.balance || 0) >= 0

    return (
        <div className="relative z-20 mb-10 -mx-4">
            {/* 1. Header Background (Subtle Gradient) */}
            <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-slate-100 to-transparent -z-10"></div>

            <div className="px-6 pt-6">
                {/* 2. Top Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                {firstName[0]}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Olá,</span>
                            <span className="text-xl font-bold text-slate-900 -mt-0.5">{firstName}</span>
                        </div>
                    </div>
                    <button className="p-2.5 bg-white text-slate-500 hover:text-indigo-600 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-indigo-100 transition-all active:scale-95 relative group">
                        <Bell size={20} className="stroke-[1.5]" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border border-white"></span>
                    </button>
                </div>

                {/* 3. Main Financial Card (Aura Glass) */}
                <div className="relative glass-card rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)]">
                    {/* Decorative Blob */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Month Picker + Privacy */}
                    <div className="relative z-10 flex justify-between items-start mb-6">
                        <div className="bg-slate-50/50 rounded-2xl p-1 border border-slate-100/50 backdrop-blur-md">
                            <MonthYearPicker selectedDate={selectedDate} onChange={onDateChange} />
                        </div>
                        <button
                            onClick={togglePrivacy}
                            className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                        >
                            {isPrivate ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Balance Info */}
                    <div className="relative z-10 space-y-1 mb-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Saldo Disponível
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </p>
                        <h2 className={`text-4xl font-bold tracking-tight ${availableNow < 0 ? 'text-rose-500' : 'text-slate-900'}`}>
                            {formatCurrency(availableNow)}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                                {projectedBalance >= availableNow ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                Previsto: {formatCurrency(projectedBalance)}
                            </span>
                        </div>
                    </div>

                    {/* Compact Chart */}
                    <div className="h-24 w-full -mb-2">
                        <MonthlyBalanceChart data={monthlyData} isPositive={isPositiveMonth} />
                    </div>
                </div>
            </div>
        </div>
    )
}
