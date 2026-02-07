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

    // Ignore options with empty value if they are just placeholders in the list
    // const activeOptions = options.filter(opt => opt.value !== '')

    return (
        <div className="space-y-1 relative" ref={containerRef}>
            {label && <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>}

            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-4 py-3 flex items-center justify-between
                    bg-white border rounded-xl 
                    text-slate-900 cursor-pointer
                    transition-all duration-200
                    ${isOpen ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-slate-200 hover:border-slate-300'}
                    ${error ? 'border-red-500 ring-red-500' : ''}
                    ${className}
                `}
            >
                <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
                    <div className="max-h-60 overflow-y-auto p-1">
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
                                        ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}
                                    `}
                                >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check size={16} className="text-blue-600" />}
                                </div>
                            )
                        })}
                        {options.length === 0 && (
                            <div className="px-4 py-3 text-sm text-slate-400 text-center">
                                Nenhuma opção
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}
