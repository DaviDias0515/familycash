import { Tag, CreditCard, Wallet, Users, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SettingsMenu() {
    const navigate = useNavigate()

    const menuItems = [
        {
            id: 'categories',
            path: 'categories',
            label: 'Categorias',
            description: 'Gerenciar receitas e despesas',
            icon: Tag,
            color: 'text-purple-500',
            bg: 'bg-purple-50 group-hover:bg-purple-100'
        },
        {
            id: 'cards',
            path: 'cards',
            label: 'Cartões de Crédito',
            description: 'Limites e faturas',
            icon: CreditCard,
            color: 'text-amber-500',
            bg: 'bg-amber-50 group-hover:bg-amber-100'
        },
        {
            id: 'accounts',
            path: 'accounts',
            label: 'Minhas Contas',
            description: 'Bancos e carteiras',
            icon: Wallet,
            color: 'text-blue-500',
            bg: 'bg-blue-50 group-hover:bg-blue-100'
        },
        {
            id: 'family',
            path: 'family',
            label: 'Membros da Família',
            description: 'Gerenciar acesso',
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 group-hover:bg-emerald-100'
        }
    ]

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
                <p className="text-slate-500">Gerencie todos os aspectos da sua conta.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className="group flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
                    >
                        <div className={`p-3 rounded-xl mr-4 transition-colors ${item.bg}`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {item.label}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {item.description}
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    )
}
