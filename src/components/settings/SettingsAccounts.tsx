import { Plus, Wallet, ChevronLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useFamilyData } from '../../hooks/useFamilyData'
import { Button } from '../ui'

export function SettingsAccounts() {
    const { accounts } = useFamilyData()
    const navigate = useNavigate()

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24 md:pb-0">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <Link
                        to="/settings"
                        className="p-1 -ml-1 mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="text-lg font-bold text-white flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-cyan-400" />
                        Minhas Contas
                    </h2>
                </div>

                {/* Desktop Button - Wrapped to ensure hiding */}
                <div className="hidden md:block">
                    <Button variant="outline" onClick={() => navigate('/settings/accounts/new')} className="py-2">
                        <Plus className="w-4 h-4 mr-1" />
                        Nova Conta
                    </Button>
                </div>
            </div>

            <div className="grid gap-3">
                {accounts.map(account => (
                    <div key={account.id} className="bg-surface p-4 rounded-xl border border-white/5 shadow-sm hover:bg-white/5 transition-colors flex justify-between items-center group">
                        <div>
                            <p className="font-medium text-white">{account.name}</p>
                            <p className="text-xs text-cyan-400 uppercase tracking-wider">{account.type}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{formatCurrency(account.initial_balance)}</p>
                            <p className="text-[10px] text-slate-500">Saldo Inicial</p>
                        </div>
                    </div>
                ))}

                {accounts.length === 0 && (
                    <p className="text-center text-slate-500 text-sm py-4">Nenhuma conta cadastrada.</p>
                )}
            </div>

            {/* Mobile Floating Action Button (FAB) */}
            <button
                onClick={() => navigate('/settings/accounts/new')}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center active:scale-95 transition-transform z-50"
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>
        </div>
    )
}
