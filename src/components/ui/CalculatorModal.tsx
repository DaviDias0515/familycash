import { Delete, Check, Equal } from 'lucide-react'
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

    const handleMainAction = () => {
        if (expression) {
            // Solve calculation
            const result = calculate()
            setDisplay(result.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
            setExpression('')
        } else {
            // Done/Confirm
            const finalVal = parseDisplayValue()
            onConfirm(finalVal)
            setIsVisible(false)
            setTimeout(onClose, 300)
        }
    }

    const handleBackspace = () => {
        const rawCurrent = display.replace(/\D/g, '')
        const newRaw = rawCurrent.slice(0, -1)
        updateDisplay(newRaw)
    }

    const ButtonKey = ({ children, onClick, variant = 'default', className = '' }: any) => {
        const base = "h-16 rounded-2xl text-2xl font-medium transition-all active:scale-95 flex items-center justify-center backdrop-blur-md"
        const styles = {
            default: "bg-surface-subtle/50 hover:bg-surface-subtle text-foreground border border-white/10 dark:border-white/5",
            primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500",
            secondary: "bg-indigo-100/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
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

            <div className={`relative glass-aura rounded-t-3xl p-4 transition-transform duration-300 ease-out transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Display Area */}
                <div className="flex justify-between items-center mb-6 px-4 pt-2">
                    <span className="text-slate-500 text-sm font-mono h-4">{expression}</span>
                    <div className="text-4xl font-bold text-foreground tracking-tight">R$ {display}</div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-3">
                    {/* Row 1 */}
                    <ButtonKey variant="secondary" onClick={() => setDisplay('0,00')}>C</ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('/')}>/</ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('*')}>x</ButtonKey>
                    <ButtonKey variant="secondary" onClick={handleBackspace}><Delete size={24} /></ButtonKey>

                    {/* Row 2 */}
                    <ButtonKey onClick={() => handleNumberConfig('7')}>7</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('8')}>8</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('9')}>9</ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('-')}>-</ButtonKey>

                    {/* Row 3 */}
                    <ButtonKey onClick={() => handleNumberConfig('4')}>4</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('5')}>5</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('6')}>6</ButtonKey>
                    <ButtonKey variant="secondary" onClick={() => handleOperation('+')}>+</ButtonKey>

                    {/* Row 4 */}
                    <ButtonKey onClick={() => handleNumberConfig('1')}>1</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('2')}>2</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig('3')}>3</ButtonKey>
                    <ButtonKey
                        variant="primary"
                        className="row-span-2 !h-full bg-indigo-600 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:bg-indigo-500"
                        onClick={handleMainAction}
                    >
                        {expression ? (
                            <Equal size={28} />
                        ) : (
                            <Check size={28} />
                        )}
                    </ButtonKey>

                    {/* Row 5 */}
                    <ButtonKey className="col-span-2" onClick={() => handleNumberConfig('0')}>0</ButtonKey>
                    <ButtonKey onClick={() => handleNumberConfig(',')}>,</ButtonKey>
                </div>
            </div>
        </div>
    )
}
