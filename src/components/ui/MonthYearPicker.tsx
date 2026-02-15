import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface MonthYearPickerProps {
    selectedDate: Date
    onChange: (date: Date) => void
}

export function MonthYearPicker({ selectedDate, onChange }: MonthYearPickerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [viewYear, setViewYear] = useState(selectedDate.getFullYear())

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    const handlePreviousMonth = () => {
        const newDate = new Date(selectedDate)
        newDate.setMonth(selectedDate.getMonth() - 1)
        onChange(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(selectedDate)
        newDate.setMonth(selectedDate.getMonth() + 1)
        onChange(newDate)
    }

    const handleSelectMonth = (monthIndex: number) => {
        const newDate = new Date(viewYear, monthIndex, 1)
        onChange(newDate)
        setIsModalOpen(false)
    }

    return (
        <>
            {/* Inline Navigation (Centered) */}
            <div className="flex items-center justify-center space-x-4 text-foreground w-full">
                <button
                    onClick={handlePreviousMonth}
                    className="p-1 hover:bg-surface-subtle rounded-full transition-colors text-slate-400 hover:text-foreground"
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={() => {
                        setViewYear(selectedDate.getFullYear())
                        setIsModalOpen(true)
                    }}
                    className="font-bold text-lg text-foreground hover:text-primary transition-colors tracking-wide"
                >
                    {selectedDate.toLocaleString('pt-BR', { month: 'long' })}
                    {selectedDate.getFullYear() !== new Date().getFullYear() && ` ${selectedDate.getFullYear()}`}
                </button>

                <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-surface-subtle rounded-full transition-colors text-slate-400 hover:text-foreground"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-border bg-surface-subtle/50">
                            <h3 className="text-foreground font-medium">Selecionar Data</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-foreground">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Year Selector */}
                        <div className="flex justify-between items-center px-6 py-4">
                            <button onClick={() => setViewYear(y => y - 1)} className="p-2 hover:bg-surface-subtle rounded-full text-foreground">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-xl font-bold text-foreground">{viewYear}</span>
                            <button onClick={() => setViewYear(y => y + 1)} className="p-2 hover:bg-surface-subtle rounded-full text-foreground">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Months Grid */}
                        <div className="grid grid-cols-3 gap-3 p-4">
                            {months.map((m, i) => {
                                const isSelected =
                                    i === selectedDate.getMonth() &&
                                    viewYear === selectedDate.getFullYear()

                                return (
                                    <button
                                        key={m}
                                        onClick={() => handleSelectMonth(i)}
                                        className={`py-3 rounded-xl text-sm font-medium transition-all ${isSelected
                                            ? 'bg-primary/20 text-primary border border-primary/50 shadow-sm'
                                            : 'bg-surface-subtle text-slate-500 hover:bg-border hover:text-foreground'
                                            }`}
                                    >
                                        {m.substring(0, 3)}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Footer - Current Month Action */}
                        <div className="p-4 border-t border-border bg-surface-subtle/30 flex justify-center">
                            <button
                                onClick={() => {
                                    const now = new Date()
                                    onChange(now)
                                    setIsModalOpen(false)
                                }}
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Voltar para o Mês Atual
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
