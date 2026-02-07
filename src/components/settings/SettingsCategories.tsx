// import { useState } from 'react'
import { Plus, Tag, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

export function SettingsCategories() {
    // const [showForm, setShowForm] = useState(false)

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-24 md:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <Link
                        to="/settings"
                        className="p-1 -ml-1 mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-slate-500" />
                        Categorias
                    </h2>
                </div>

                {/* Desktop Button */}
                <div className="hidden md:block">
                    <Button variant="outline" onClick={() => {/* setShowForm(true) */ }} className="py-2">
                        <Plus className="w-4 h-4 mr-1" />
                        Nova Categoria
                    </Button>
                </div>
            </div>

            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">Gerenciamento de categorias em breve.</p>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={() => {/* setShowForm(true) */ }}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg shadow-purple-600/30 flex items-center justify-center active:scale-95 transition-transform z-50"
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>
        </div>
    )
}
