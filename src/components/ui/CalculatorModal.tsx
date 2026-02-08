import { Delete } from 'lucide-react'
import { useState, useEffect } from 'react'

interface CalculatorModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (value: number) => void
    initialValue?: number
}

export function CalculatorModal({ isOpen, onClose, onConfirm, initialValue = 0 }: CalculatorModalProps) {
    const [display, setDisplay] = useState('0,00')
    const [expression, setExpression] = useState('')

    useEffect(() => {
        if (isOpen) {
            setDisplay(initialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
            setExpression('')
        }
    }, [isOpen, initialValue])

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setIsVisible(true))
        } else {
            setIsVisible(false)
        }
    }, [isOpen])

    if (!isOpen && !isVisible) return null

    const updateDisplay = (rawValue: string) => {
        const value = parseInt(rawValue || '0') / 100
        setDisplay(value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
    }

    const handleNumberConfig = (num: string) => {
        if (num === ',') return // Ignore comma as it is automatic

        const rawCurrent = display.replace(/\D/g, '')
        const newRaw = rawCurrent + num
        updateDisplay(newRaw)
    }

    const parseDisplayValue = () => {
        // Remove thousands separators (.) and replace decimal separator (,) with (.)
        return parseFloat(display.replace(/\./g, '').replace(',', '.'))
    }

    const handleOperation = (op: string) => {
        const val = parseDisplayValue()
        setExpression(prev => `${prev} ${val} ${op}`)
        setDisplay('0,00')
    }

    const calculate = () => {
        try {
            const currentVal = parseDisplayValue()
            if (!expression) return currentVal

            const fullExpr = `${expression} ${currentVal}`
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${fullExpr}`)()
            return result
        } catch (e) {
            return 0
        }
    }

    const handleDone = () => {
        const finalVal = expression ? calculate() : parseDisplayValue()
        onConfirm(finalVal)
        setIsVisible(false)
        setTimeout(onClose, 300)
    }

    const handleBackspace = () => {
        const rawCurrent = display.replace(/\D/g, '')
        const newRaw = rawCurrent.slice(0, -1)
        updateDisplay(newRaw)
    }

    const ButtonKey = ({ children, onClick, variant = 'default', className = '' }: any) => {
        const base = "h-16 rounded-2xl text-2xl font-medium transition-all active:scale-95 flex items-center justify-center"
        const styles = {
            default: "bg-surface hover:bg-white/5 text-white",
            primary: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
            secondary: "bg-white/10 text-slate-300 hover:bg-white/20"
        }
        return (
            <button
                onClick={onClick}
                className={`${base} ${styles[variant as keyof typeof styles]} ${className}`}
            >
                {children}
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end">
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(onClose, 300)
                }}
            />

            <div className={`relative bg-[#121214] rounded-t-3xl border-t border-white/10 p-4 transition-transform duration-300 ease-out transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Display Area */}
                <div className="flex justify-between items-center mb-6 px-4">
                    <span className="text-slate-500 text-sm font-mono h-4">{expression}</span>
                    <div className="text-4xl font-bold text-white tracking-tight">R$ {display}</div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                    <ButtonKey onClick={() => handleNumberConfig('7')}>7</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('8')}>8</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('9')}>9</ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('/')}>/</ButtonKey>

                    <ButtonKey onClick={() => handleNumberConfig('4')}>4</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('5')}>5</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('6')}>6</ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('*')}>x</ButtonKey>

                    <ButtonKey onClick={() => handleNumberConfig('1')}>1</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('2')}>2</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('3')}>3</ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('-')}>-</ButtonKey>

                    <ButtonKey onClick={() => handleNumberConfig(',')}>,</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('0')}>0</ButtonKey>
                    <ButtonKey variant="secondary" onClick={handleBackspace}><Delete size={24} /></ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('+')}>+</ButtonKey>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => {
                            setIsVisible(false)
                            setTimeout(onClose, 300)
                        }}
                        className="h-14 rounded-full border border-white/10 text-slate-400 font-medium hover:bg-white/5 transition-colors"
                    >
                        CANCELAR
                    </button>
                    <button
                        onClick={handleDone}
                        className="h-14 rounded-full bg-emerald-600 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all active:scale-95"
                    >
                        CONCLUÍDO
                    </button>
                </div>
            </div>
        </div>
    )
}
