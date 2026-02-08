// import { useState } from 'react'
import { Plus, Users, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

export function SettingsFamily() {
    // const [showForm, setShowForm] = useState(false)

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24 md:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <Link
                        to="/settings"
                        className="p-1 -ml-1 mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="text-lg font-bold text-white flex items-center">
                        <Users className="w-5 h-5 mr-2 text-emerald-400" />
                        Membros da Família
                    </h2>
                </div>

                {/* Desktop Button */}
                <div className="hidden md:block">
                    <Button variant="outline" onClick={() => {/* setShowForm(true) */ }} className="py-2">
                        <Plus className="w-4 h-4 mr-1" />
                        Convidar
                    </Button>
                </div>
            </div>

            <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                <p className="text-slate-500">Gerenciamento de família em breve.</p>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={() => {/* setShowForm(true) */ }}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center active:scale-95 transition-transform z-50"
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>
        </div>
    )
}
