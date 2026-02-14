import { useState } from 'react'
import { Plus, Users, ChevronLeft, User, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { useFamilyData } from '../../hooks/useFamilyData'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'

export function SettingsFamily() {
    const { profiles, loading } = useFamilyData()
    const { profile: currentUser } = useAuth()
    const [copied, setCopied] = useState(false)

    const handleCopyInvite = () => {
        if (currentUser?.family_id) {
            navigator.clipboard.writeText(currentUser.family_id)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-24 md:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link
                        to="/settings"
                        className="p-2 -ml-2 mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Users className="w-6 h-6 mr-2 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            Membros da Família
                        </h2>
                        <p className="text-xs text-slate-400">Pessoas com acesso à conta</p>
                    </div>
                </div>

                {/* Desktop Invite Button */}
                <div className="hidden md:block">
                    <Button onClick={handleCopyInvite} className="bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copiado!' : 'Copiar ID Família'}
                    </Button>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500 animate-pulse">Carregando membros...</div>
            ) : profiles.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-slate-500">Nenhum membro encontrado.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {profiles.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-surface border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border border-white/10 ${member.id === currentUser?.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                                    {member.full_name?.charAt(0).toUpperCase() || <User size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        {member.full_name}
                                        {member.id === currentUser?.id && (
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">Você</span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-slate-500 capitalize">{member.role === 'admin' ? 'Administrador' : 'Membro'}</p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-slate-600">Entrou em</span>
                                <p className="text-xs text-slate-400">{format(new Date(member.created_at), 'dd/MM/yyyy')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Explanation Card */}
            <div className="bg-emerald-900/10 border border-emerald-500/10 p-4 rounded-2xl">
                <h4 className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-2">
                    <Users size={16} /> Como convidar?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Para adicionar alguém à sua família, peça para a pessoa criar uma conta e enviar o email dela para você. (Funcionalidade de convite por email em breve).
                    <br />
                    Atualmente, você pode compartilhar o ID da família: <span className="text-white font-mono bg-black/40 px-1 py-0.5 rounded select-all">{currentUser?.family_id}</span>
                </p>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={handleCopyInvite}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center active:scale-95 transition-transform z-50 border border-white/20"
            >
                {copied ? <Check size={28} strokeWidth={2.5} /> : <Copy size={28} strokeWidth={2.5} />}
            </button>
        </div>
    )
}
