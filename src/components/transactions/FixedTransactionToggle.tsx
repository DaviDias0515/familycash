import { Repeat } from 'lucide-react'

interface FixedTransactionToggleProps {
    isFixed: boolean
    onToggle: (checked: boolean) => void
    color?: string // 'emerald', 'rose', etc for neon glow based on kind
}

export function FixedTransactionToggle({ isFixed, onToggle, color = 'emerald' }: FixedTransactionToggleProps) {

    // Map colors to tailwind classes
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        rose: 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
        blue: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        amber: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
    }

    const activeClass = colorMap[color] || colorMap.emerald

    return (
        <div
            onClick={() => onToggle(!isFixed)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all cursor-pointer bg-surface hover:bg-white/5 ${isFixed ? 'border-white/20' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isFixed ? 'bg-white/10 text-white' : 'bg-transparent text-slate-500'}`}>
                    <Repeat size={20} />
                </div>
                <div className="flex flex-col">
                    <span className={`font-medium ${isFixed ? 'text-white' : 'text-slate-300'}`}>
                        {isFixed ? 'Transação Fixa' : 'Transação Única'}
                    </span>
                    <span className="text-xs text-slate-500">
                        {isFixed ? 'Repete todo mês' : 'Ocorre apenas uma vez'}
                    </span>
                </div>
            </div>

            {/* Switch UI */}
            <div className={`w-12 h-7 rounded-full transition-colors relative flex items-center ${isFixed ? 'bg-white/20' : 'bg-white/5 border border-white/10'}`}>
                <div
                    className={`w-5 h-5 rounded-full absolute transition-all duration-300 ${isFixed ? `right-1 ${activeClass}` : 'left-1 bg-slate-400'}`}
                />
            </div>
        </div>
    )
}
