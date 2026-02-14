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
        cyan: 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]',
        amber: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
    }

    const activeClass = colorMap[color] || colorMap.emerald

    return (
        <div
            onClick={() => onToggle(!isFixed)}
            className={`
                w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer button-press
                ${isFixed
                    ? 'bg-surface border-white/20 opacity-100 shadow-lg shadow-black/20'
                    : 'bg-transparent border-white/5 opacity-60 hover:opacity-100 hover:bg-white/5'
                }
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full transition-colors ${isFixed ? 'bg-white/10 text-white' : 'bg-transparent text-slate-500'}`}>
                    <Repeat size={20} />
                </div>
                <span className={`font-medium transition-colors ${isFixed ? 'text-white' : 'text-slate-400'}`}>
                    Transação Fixa
                </span>
            </div>

            {/* Switch UI */}
            <div className={`w-12 h-7 rounded-full transition-colors relative flex items-center ${isFixed ? 'bg-white/20' : 'bg-white/5 border border-white/10'}`}>
                <div
                    className={`w-5 h-5 rounded-full absolute transition-all duration-300 shadow-sm ${isFixed ? `right-1 ${activeClass} shadow-[0_0_10px_currentColor]` : 'left-1 bg-slate-500'}`}
                />
            </div>
        </div>
    )
}
