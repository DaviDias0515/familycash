import { useAuth } from '../../contexts/AuthContext'
import { Bell, Eye, EyeOff } from 'lucide-react'
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
        <div className="relative z-20 mb-8 -mx-4">
            {/* 1. Background Layer (Cor 1: Slate-950) 
                - Absolute positioning
                - Fixed height to create overlap
                - Straight bottom (no rounded corners)
            */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-slate-950 -z-10 shadow-sm border-b border-white/5"></div>

            {/* Content Container */}
            <div className="px-4 pt-4">
                {/* 2. Top Bar (Avatar + Greeting) */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg border border-white/10">
                            <span className="text-sm font-bold text-white uppercase">{firstName[0]}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Bem vindo,</span>
                            <span className="text-lg font-bold text-white leading-none">{firstName}</span>
                        </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
                    </button>
                </div>

                {/* 3. Floating Card (Cor 2: Slate-900 Strong + Glass) */}
                <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden ring-1 ring-white/5">
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    {/* Month Picker (Centered) + Privacy (Absolute) */}
                    <div className="relative z-10 mb-6 flex justify-center w-full">
                        <div className="w-2/3">
                            <MonthYearPicker selectedDate={selectedDate} onChange={onDateChange} />
                        </div>
                        <button
                            onClick={togglePrivacy}
                            className="absolute right-0 top-1 p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"
                        >
                            {isPrivate ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Balances */}
                    <div className="relative z-10 text-center mb-6">
                        {/* Saldo Atual */}
                        <div className="mb-4">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Saldo Atual</p>
                            <h2 className="text-4xl font-bold text-white tracking-tighter drop-shadow-md">
                                {formatCurrency(availableNow)}
                            </h2>
                        </div>

                        {/* Saldo Previsto (Stacked) */}
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-0.5">Previsto</span>
                            <span className={`text-sm font-semibold ${projectedBalance >= availableNow ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {formatCurrency(projectedBalance)}
                            </span>
                        </div>
                    </div>

                    {/* 4. Chart Area (Cor 3: Slate-900/40) */}
                    <div className="h-20 w-full bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden relative shadow-inner">
                        <MonthlyBalanceChart data={monthlyData} isPositive={isPositiveMonth} />

                        {/* Empty State */}
                        {monthlyData.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 uppercase font-medium">
                                Sem dados
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
