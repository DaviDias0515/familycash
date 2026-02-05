import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AccountForm } from '../forms/AccountForm'

export function SettingsAccountCreate() {
    const navigate = useNavigate()

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center mb-6">
                <Link
                    to="/settings/accounts"
                    className="p-1 -ml-1 mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-xl font-bold text-slate-900">
                    Nova Conta
                </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <AccountForm
                    onSuccess={() => {
                        // In a real app we'd invalidate cache here
                        // For now, simple navigation back
                        navigate('/settings/accounts')
                        // Small hack to layout refreshing logic if needed, but navigate should be enough for now 
                        // if the parent re-fetches on mount.
                    }}
                    onCancel={() => navigate('/settings/accounts')}
                />
            </div>
        </div>
    )
}
