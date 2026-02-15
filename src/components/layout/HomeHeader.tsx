import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, TrendingUp } from 'lucide-react'
import { MonthYearPicker } from '../ui/MonthYearPicker'
import { MonthlyBalanceChart } from '../charts/MonthlyBalanceChart'
import { usePrivacy } from '../../hooks/usePrivacy'

interface HomeHeaderProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
    availableNow: number
    projectedBalance: number
    monthlyFlow: number
    monthlyData: { day: number; balance: number }[]
}

export function HomeHeader({
    selectedDate,
    onDateChange,
    availableNow,
    projectedBalance,
    monthlyFlow,
    monthlyData
}: HomeHeaderProps) {
    const { profile } = useAuth()
    const { isPrivate, togglePrivacy } = usePrivacy()
    const firstName = profile?.full_name?.split(' ')[0] || 'U'

    const formatCurrency = (val: number) => {
        if (isPrivate) return '••••'
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    }

    const isPositiveMonth = (monthlyData[monthlyData.length - 1]?.balance || 0) >= 0

    return (
        <div className="relative z-20 mb-6 -mx-4">
            {/* 1. Gradient Background + Noise with Fade Out */}
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent to-background z-0 pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-cyan-400/35 via-purple-400/35 to-pink-400/35 -z-20"></div>
            <div className="absolute top-0 left-0 right-0 h-80 opacity-[0.15] mix-blend-overlay -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.5%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E")' }}></div>
            {/* Fade out mask at the bottom of the gradient area */}
            <div className="absolute top-40 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background -z-10"></div>

            <div className="px-6 pt-4 pb-0">
                {/* 2. Greeting & Top Navigation */}

                {/* Greeting Row - Compact 3-line Layout */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col leading-tight">
                        {/* 1. Greeting - EXTRA SMALL */}
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                            {(() => {
                                const hour = new Date().getHours()
                                if (hour < 12) return 'Bom dia,'
                                if (hour < 18) return 'Boa tarde,'
                                return 'Boa noite,'
                            })()}
                        </span>

                        {/* 2. Name - Hero Style (Reduced size to text-base) */}
                        <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                            {firstName}
                        </span>

                        {/* 3. Microcopy - Tech/Finance Vibe */}
                        <span className="text-[9px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold mt-0.5 opacity-90">
                            Vamos controlar as finanças?
                        </span>
                    </div>

                    {/* Notification Bell (Aligned with top) */}
                    <button
                        className="relative w-10 h-10 flex items-center justify-center dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors active:scale-95 group -mr-2 -mt-1"
                        style={{ color: '#475569' }}
                    >
                        <div className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-background z-10"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                    </button>
                </div>

                {/* Date Picker Row (Centered below greeting) */}
                <div className="flex items-center justify-center mb-4 relative z-30 transform scale-95 origin-center">
                    <MonthYearPicker selectedDate={selectedDate} onChange={onDateChange} />
                </div>

                {/* 3. Main Financial Card (Compact & Elevated) */}
                <div className="relative glass-card rounded-[2rem] p-6 overflow-hidden transition-all duration-300 -mt-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border-white/40 dark:border-white/10">

                    {/* Privacy Toggle (Absolute Right) */}
                    <button
                        onClick={togglePrivacy}
                        className="absolute top-6 right-6 z-20 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors active:scale-95"
                    >
                        {isPrivate ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>

                    <div className="flex flex-col items-center justify-center text-center mb-6 relative z-10 pt-2">
                        {/* Saldo Disponível (Hero) */}
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1">
                            Saldo Disponível
                        </p>
                        <h2
                            className={`text-4xl font-bold tracking-tighter mb-2 ${availableNow < 0 ? 'text-rose-600' : ''}`}
                            style={{ color: availableNow < 0 ? undefined : '#0F172A' }}
                        >
                            {formatCurrency(availableNow)}
                        </h2>

                        {/* Tags: Previsto e Balanço */}
                        {/* Tags: Previsto e Balanço */}
                        {/* Cards: Previsto e Balanço */}
                        <div className="grid grid-cols-2 gap-3 w-full px-2">
                            {/* Previsto Card */}
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 shadow-sm">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                                    Previsto
                                </span>
                                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                                    <TrendingUp size={14} />
                                    <span className="text-sm font-bold">{formatCurrency(projectedBalance)}</span>
                                </div>
                            </div>

                            {/* Balanço Card */}
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 shadow-sm">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                                    Balanço
                                </span>
                                <div className={`flex items-center gap-1.5 text-sm font-bold ${monthlyFlow >= 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-rose-600 dark:text-rose-400'
                                    }`}>
                                    <span>{monthlyFlow > 0 ? '+' : ''}{formatCurrency(monthlyFlow)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Chart - With Margins */}
                    <div className="h-24 w-[105%] -ml-[2.5%] opacity-60 hover:opacity-100 transition-opacity mt-2">
                        <MonthlyBalanceChart data={monthlyData} isPositive={isPositiveMonth} />
                    </div>
                </div>
            </div>
        </div>
    )
}
