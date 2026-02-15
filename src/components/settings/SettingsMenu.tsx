import { Tag, CreditCard, Wallet, Users, ChevronRight, Moon, Sun, Monitor } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

export function SettingsMenu() {
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()

    const menuItems = [
        {
            id: 'categories',
            path: 'categories',
            label: 'Categorias',
            description: 'Gerenciar receitas e despesas',
            icon: Tag,
            color: 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]',
            bg: 'bg-purple-500/10 group-hover:bg-purple-500/20'
        },
        {
            id: 'cards',
            path: 'cards',
            label: 'Cartões de Crédito',
            description: 'Limites e faturas',
            icon: CreditCard,
            color: 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]',
            bg: 'bg-amber-500/10 group-hover:bg-amber-500/20'
        },
        {
            id: 'accounts',
            path: 'accounts',
            label: 'Minhas Contas',
            description: 'Bancos e carteiras',
            icon: Wallet,
            color: 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]',
            bg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20'
        },
        {
            id: 'family',
            path: 'family',
            label: 'Membros da Família',
            description: 'Gerenciar acesso',
            icon: Users,
            color: 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]',
            bg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20'
        }
    ]

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                <p className="text-slate-400">Gerencie todos os aspectos da sua conta.</p>
            </header>

            {/* Appearance Section */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Aparência</h2>
                <div className="bg-surface border border-border rounded-2xl p-1 flex">
                    <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-slate-500 hover:text-foreground'}`}
                    >
                        <Sun size={18} />
                        Claro
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-slate-500 hover:text-foreground'}`}
                    >
                        <Moon size={18} />
                        Escuro
                    </button>
                    <button
                        onClick={() => setTheme('system')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${theme === 'system' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-slate-500 hover:text-foreground'}`}
                    >
                        <Monitor size={18} />
                        Auto
                    </button>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Geral</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className="group flex items-center p-4 bg-surface border border-border rounded-2xl shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:border-primary/30 transition-all duration-300 text-left"
                        >
                            <div className={`p-3 rounded-xl mr-4 transition-colors ${item.bg}`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {item.label}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    {item.description}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
