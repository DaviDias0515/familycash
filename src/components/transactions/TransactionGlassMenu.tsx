import { ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, CreditCard, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface TransactionGlassMenuProps {
    isOpen: boolean
    onClose: () => void
    onSelectType: (type: 'income' | 'expense' | 'transfer' | 'credit_card') => void
}

export function TransactionGlassMenu({ isOpen, onClose, onSelectType }: TransactionGlassMenuProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            const timer = requestAnimationFrame(() => {
                setIsVisible(true)
            })
            document.body.style.overflow = 'hidden'
            return () => cancelAnimationFrame(timer)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            document.body.style.overflow = 'unset'
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    if (!isVisible && !isOpen) return null

    const types = [
        {
            id: 'income',
            label: 'Receita',
            icon: ArrowUpCircle,
            color: 'text-emerald-400',
            // Strong neon glow behind the icon
            glow: 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
            // Arc Geometry
            mobileTranslate: 'translate-x-[-110px] translate-y-[-10px] sm:translate-x-0 sm:translate-y-0',
            delay: 'delay-0'
        },
        {
            id: 'transfer',
            label: 'Transf.',
            icon: ArrowRightLeft,
            color: 'text-cyan-400',
            glow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
            mobileTranslate: 'translate-x-[-55px] translate-y-[-85px] sm:translate-x-0 sm:translate-y-0',
            delay: 'delay-75'
        },
        {
            id: 'expense',
            label: 'Despesa',
            icon: ArrowDownCircle,
            color: 'text-rose-400',
            glow: 'drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]',
            mobileTranslate: 'translate-x-[55px] translate-y-[-85px] sm:translate-x-0 sm:translate-y-0',
            delay: 'delay-100'
        },
        {
            id: 'credit_card',
            label: 'Cartão',
            icon: CreditCard,
            color: 'text-amber-400',
            glow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]',
            mobileTranslate: 'translate-x-[110px] translate-y-[-10px] sm:translate-x-0 sm:translate-y-0',
            delay: 'delay-150'
        },
    ] as const

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            {/* Deep Dark Backdrop with stronger blur for tech feel */}
            <div
                className={`absolute inset-0 bg-[#000000]/70 backdrop-blur-xl transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Mobile: Cyber Fan Layout */}
            <div className="relative w-full h-full sm:hidden flex items-end justify-center pb-safe-offset-20 pointer-events-none">
                {/* Container for Arc Items (pointer-events-auto for buttons) */}
                <div className="absolute bottom-24 flex items-center justify-center w-0 h-0">
                    {types.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                onSelectType(type.id)
                                onClose()
                            }}
                            className={`
                                absolute pointer-events-auto
                                flex flex-col items-center justify-center
                                w-[4.5rem] h-[4.5rem]
                                bg-[#111111] border border-white/10
                                rounded-full shadow-xl shadow-black/80
                                transition-all duration-400 cubic-bezier(0.34, 1.56, 0.64, 1)
                                group
                                ${isOpen ? `${type.mobileTranslate} scale-100 opacity-100` : 'translate-x-0 translate-y-0 scale-50 opacity-0'}
                            `}
                        >
                            {/* Inner Glow Circle */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent opacity-50" />

                            <div className={`${type.color} ${type.glow} mb-1 transition-transform group-active:scale-90`}>
                                <type.icon size={26} strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wide">
                                {type.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Mobile Close Button (FAB) */}
                <button
                    onClick={onClose}
                    className={`
                        pointer-events-auto
                        absolute bottom-8
                        flex items-center justify-center w-16 h-16
                        bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                        text-white rounded-full 
                        shadow-2xl shadow-blue-600/40 border border-blue-400/20
                        transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275)
                        z-50
                        ${isOpen ? 'rotate-90 scale-100' : 'rotate-0 scale-0'}
                    `}
                >
                    <X size={32} strokeWidth={2.5} />
                </button>
            </div>

            {/* Desktop: Grid HUD Container */}
            <div
                className={`
                    hidden sm:grid
                    relative 
                    grid-cols-2 gap-4 p-8
                    bg-[#0B1120]/90 backdrop-blur-2xl 
                    border border-white/5
                    rounded-[2.5rem] 
                    shadow-2xl shadow-black/60
                    transform transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-90 translate-y-8'
                    }
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 md:-right-12 md:top-0 p-3 text-white/70 hover:text-white bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-md transition-colors border border-white/5"
                >
                    <X size={24} />
                </button>

                {types.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => {
                            onSelectType(type.id)
                            onClose()
                        }}
                        className={`
                            flex flex-col items-center justify-center
                            w-36 h-36
                            bg-white/5 hover:bg-white/10 active:bg-white/15
                            rounded-3xl border border-white/5
                            transition-all duration-300 ease-out
                            group relative overflow-hidden
                            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                            ${type.delay}
                        `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div
                            className={`
                                mb-4 p-4 rounded-2xl bg-black/40 
                                transition-transform duration-300 group-hover:scale-110 
                                ${type.color} ${type.glow} border border-white/5
                            `}
                        >
                            <type.icon size={32} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white tracking-widest uppercase">
                            {type.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>,
        document.body
    )
}
