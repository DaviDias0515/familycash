import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps {
    label?: string
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    error?: string
    className?: string
}

export function Select({ label, value, onChange, options, placeholder = "Selecione...", error, className = '' }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(opt => opt.value === value)

    return (
        <div className="space-y-1.5 relative" ref={containerRef}>
            {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}

            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-4 py-3 flex items-center justify-between
                    bg-white/5 border rounded-xl 
                    text-white cursor-pointer
                    transition-all duration-200
                    ${isOpen ? 'ring-2 ring-cyan-500/50 border-transparent shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-white/10 hover:border-white/20 hover:bg-white/10'}
                    ${error ? 'border-red-500/50 ring-red-500/50' : ''}
                    ${className}
                `}
            >
                <span className={selectedOption ? 'text-white' : 'text-slate-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {options.map((opt) => {
                            // Skip placeholder option in the list if it has empty value and we want to enforce selection
                            if (opt.value === '' && opt.label.includes('Selecione')) return null

                            const isSelected = opt.value === value
                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value)
                                        setIsOpen(false)
                                    }}
                                    className={`
                                        flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm
                                        transition-colors duration-150
                                        ${isSelected ? 'bg-cyan-500/10 text-cyan-400 font-medium' : 'text-slate-300 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check size={16} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />}
                                </div>
                            )
                        })}
                        {options.length === 0 && (
                            <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                Nenhuma opção
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-sm text-red-400 ml-1">{error}</p>}
        </div>
    )
}
