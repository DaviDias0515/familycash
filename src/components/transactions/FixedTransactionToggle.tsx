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
                w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer button-press group
                ${isFixed
                    ? 'bg-surface border-border opacity-100 shadow-sm'
                    : 'bg-transparent border-border opacity-60 hover:opacity-100 hover:bg-surface-subtle'
                }
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full transition-colors ${isFixed ? 'bg-surface-subtle text-foreground' : 'bg-transparent text-slate-500'}`}>
                    <Repeat size={20} />
                </div>
                <span className={`font-medium transition-colors ${isFixed ? 'text-foreground' : 'text-slate-400 group-hover:text-foreground'}`}>
                    Transação Fixa
                </span>
            </div>

            {/* Switch UI */}
            <div className={`w-12 h-7 rounded-full transition-colors relative flex items-center ${isFixed ? 'bg-surface-subtle border border-border' : 'bg-surface-subtle/50 border border-border'}`}>
                <div
                    className={`w-5 h-5 rounded-full absolute transition-all duration-300 shadow-sm ${isFixed ? `right-1 ${activeClass} shadow-[0_0_10px_currentColor]` : 'left-1 bg-slate-400'}`}
                />
            </div>
        </div>
    )
}
