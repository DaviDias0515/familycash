import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure render before animation starts
            const timer = requestAnimationFrame(() => {
                setIsVisible(true)
            })
            document.body.style.overflow = 'hidden'
            return () => cancelAnimationFrame(timer)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200)
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

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'
                }`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Content Wrapper - Bottom Sheet on Mobile, Dialog on Desktop */}
            <div
                className={`
                    relative w-full md:w-full md:max-w-md 
                    bg-white dark:bg-slate-900 
                    rounded-t-2xl md:rounded-2xl 
                    shadow-2xl 
                    overflow-hidden
                    transition-all duration-300 cubic-bezier(0.32, 0.72, 0, 1)
                    ${isOpen
                        ? 'translate-y-0 opacity-100 scale-100'
                        : 'translate-y-full md:translate-y-4 opacity-0 md:scale-95'
                    }
                `}
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '90vh' }}
            >
                {/* Mobile Pull Bar */}
                <div className="md:hidden w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}
