import { useState } from 'react'
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
            <div className="flex items-center justify-center space-x-4 text-white w-full">
                <button
                    onClick={handlePreviousMonth}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={() => {
                        setViewYear(selectedDate.getFullYear())
                        setIsModalOpen(true)
                    }}
                    className="font-bold text-lg text-white hover:text-cyan-400 transition-colors tracking-wide"
                >
                    {selectedDate.toLocaleString('pt-BR', { month: 'long' })}
                    {selectedDate.getFullYear() !== new Date().getFullYear() && ` ${selectedDate.getFullYear()}`}
                </button>

                <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/5">
                            <h3 className="text-white font-medium">Selecionar Data</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Year Selector */}
                        <div className="flex justify-between items-center px-6 py-4">
                            <button onClick={() => setViewYear(y => y - 1)} className="p-2 hover:bg-white/5 rounded-full">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-xl font-bold text-white text-glow">{viewYear}</span>
                            <button onClick={() => setViewYear(y => y + 1)} className="p-2 hover:bg-white/5 rounded-full">
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
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                            }`}
                                    >
                                        {m.substring(0, 3)}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
