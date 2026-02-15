import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, History, PieChart, Settings, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import { TransactionGlassMenu } from '../transactions/TransactionGlassMenu'
import { TransactionFormModal } from '../transactions/TransactionFormModal'

type TransactionType = 'income' | 'expense' | 'transfer' | 'credit_card'

export function Navbar() {
    const { signOut } = useAuth()
    const location = useLocation()
    const [isGlassMenuOpen, setIsGlassMenuOpen] = useState(false)
    const [formType, setFormType] = useState<TransactionType | null>(null)

    // Hide mobile nav on settings sub-pages (e.g. /settings/accounts)
    // But show on /settings (the menu hub)
    const isSubSettings = location.pathname.startsWith('/settings/') && location.pathname !== '/settings'

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Home' },
        { to: '/timeline', icon: History, label: 'Transações' },
        { to: '/budgets', icon: PieChart, label: 'Orçamentos' },
        { to: '/settings', icon: Settings, label: 'Configurações' },
    ]

    const handleCreateTransaction = (type: string) => {
        setFormType(type as TransactionType)
        setIsGlassMenuOpen(false)
    }

    return (
        <>
            <TransactionGlassMenu
                isOpen={isGlassMenuOpen}
                onClose={() => setIsGlassMenuOpen(false)}
                onSelectType={(type) => handleCreateTransaction(type)}
            />

            <TransactionFormModal
                isOpen={!!formType}
                type={formType}
                onClose={() => setFormType(null)}
            />

            {/* Mobile Bottom Nav - Hidden on Settings Sub-pages */}
            {!isSubSettings && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-aura border-t border-border/50 safe-area-bottom pb-safe z-50">
                    <div className="flex justify-around items-center h-16 px-2">
                        {/* First 2 items */}
                        {navItems.slice(0, 2).map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive
                                        ? 'text-primary text-glow'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[10px] font-medium mt-1">{label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}

                        {/* Middle Plus Button */}
                        <div className="relative -top-5">
                            <button
                                onClick={() => setIsGlassMenuOpen(true)}
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all active:scale-95"
                            >
                                <Plus size={32} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Last 2 items */}
                        {navItems.slice(2).map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive
                                        ? 'text-primary text-glow'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-foreground'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[10px] font-medium mt-1">{label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-surface/50 backdrop-blur-md border-r border-border p-4 transition-colors duration-300">
                <div className="mb-8 px-4 py-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        FamilyCash
                    </h1>
                </div>

                {/* New Transaction Button */}
                <div className="px-2 mb-6">
                    <button
                        onClick={() => setIsGlassMenuOpen(true)}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        <span className="font-semibold">Novo</span>
                    </button>
                </div>

                <div className="flex flex-col space-y-2 flex-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 w-full h-12 px-4 rounded-xl transition-all ${isActive
                                    ? 'bg-surface text-foreground shadow-sm border border-border/50'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-surface/50'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={20} strokeWidth={2} className={`w-5 h-5 ${isActive ? 'text-primary drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]' : ''}`} />
                                    <span className="text-sm font-medium">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 w-full px-4 h-12 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-auto"
                >
                    <LogOut size={20} strokeWidth={2} />
                    <span className="text-sm font-medium">Sair</span>
                </button>
            </aside>
        </>
    )
}
