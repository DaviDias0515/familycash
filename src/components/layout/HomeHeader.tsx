import { useAuth } from '../../contexts/AuthContext'

export function HomeHeader() {
    const { profile } = useAuth()

    // Get first name
    const firstName = profile?.full_name?.split(' ')[0] || 'Usuário'

    return (
        <div className="flex items-center space-x-4 mb-4">
            {/* Avatar Placeholder - Future: Navigate to Profile Manager */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-white/10">
                <span className="text-xl font-bold text-white uppercase">{firstName[0]}</span>
            </div>

            <div className="flex flex-col">
                <span className="text-slate-400 text-sm">Bem-vindo de volta,</span>
                <span className="text-xl font-bold text-white text-glow">{firstName}</span>
            </div>
        </div>
    )
}
