import { ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, CreditCard } from 'lucide-react'
import { Modal } from '../ui/Modal'

interface TransactionTypeModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectType: (type: 'income' | 'expense' | 'transfer' | 'credit_card') => void
}

export function TransactionTypeModal({ isOpen, onClose, onSelectType }: TransactionTypeModalProps) {
    const types = [
        {
            id: 'income',
            label: 'Receita',
            icon: ArrowUpCircle,
            description: 'Salário, rendimentos',
            iconColor: 'text-emerald-500'
        },
        {
            id: 'expense',
            label: 'Despesa',
            icon: ArrowDownCircle,
            description: 'Pagamentos, compras',
            iconColor: 'text-rose-500'
        },
        {
            id: 'transfer',
            label: 'Transferência',
            icon: ArrowRightLeft,
            description: 'Entre contas',
            iconColor: 'text-blue-500'
        },
        {
            id: 'credit_card',
            label: 'Despesa Cartão',
            icon: CreditCard,
            description: 'Fatura de crédito',
            iconColor: 'text-amber-500'
        },
    ] as const

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
            <div className="flex flex-col">
                {types.map((type, index) => (
                    <button
                        key={type.id}
                        onClick={() => {
                            onSelectType(type.id)
                            onClose()
                        }}
                        className={`
                            flex items-center p-4 w-full transition-all duration-200 
                            hover:bg-slate-50 dark:hover:bg-slate-800/50 
                            active:bg-slate-100 dark:active:bg-slate-800
                            group rounded-xl
                        `}
                    >
                        <div className={`
                            p-2 rounded-lg bg-slate-50 dark:bg-slate-800 
                            group-hover:bg-white dark:group-hover:bg-slate-700 
                            shadow-sm transition-colors
                            ${type.iconColor}
                        `}>
                            <type.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="ml-4 text-left flex-1">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                {type.label}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {type.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </Modal>
    )
}
