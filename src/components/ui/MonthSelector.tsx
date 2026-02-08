import { useRef, useEffect } from 'react'
// import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthSelectorProps {
    selectedDate: Date
    onChange: (date: Date) => void
}

export function MonthSelector({ selectedDate, onChange }: MonthSelectorProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Generate 12 months window (2 past, current, 9 future)
    const months = []
    const today = new Date()
    for (let i = -2; i <= 9; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
        months.push(d)
    }

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

    // Auto-scroll to selected month on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            // Find selected button index logic could be here, or just simple center calculation
            // For now, let's just ensure it's scrollable
        }
    }, [])

    return (
        <div className="relative group">
            <div
                ref={scrollContainerRef}
                className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 hide-scrollbar scroll-smooth px-1"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {months.map((date, index) => {
                    const isSelected =
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getFullYear() === selectedDate.getFullYear()

                    const isTargetMonth = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()

                    return (
                        <button
                            key={index}
                            onClick={() => onChange(date)}
                            className={`flex-shrink-0 relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 scroll-snap-align-center border ${isSelected
                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                                }`}
                        >
                            {capitalize(date.toLocaleString('pt-BR', { month: 'long' }))}
                            {/* Year indicator if different from current */}
                            {date.getFullYear() !== today.getFullYear() && (
                                <span className="text-[10px] ml-1 opacity-60">{date.getFullYear()}</span>
                            )}

                            {/* Current Month Indicator */}
                            {isTargetMonth && !isSelected && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Fade gradients to indicate scroll */}
            <div className="absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none md:block hidden" />
            <div className="absolute right-0 top-0 bottom-4 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none md:block hidden" />
        </div>
    )
}
