import { useState, useEffect } from 'react'
import { ArrowLeft, Check, Calendar, MessageSquare, Tag, CreditCard as CardIcon, Wallet, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CalculatorModal } from '../ui/CalculatorModal'
import { CategoryPickerDrawer } from './CategoryPickerDrawer'
import { FixedTransactionToggle } from './FixedTransactionToggle'
import type { Account, Category, CreditCard } from '../../types'

type TransactionType = 'income' | 'expense' | 'transfer' | 'credit_card'

interface TransactionFormModalProps {
    isOpen: boolean
    onClose: () => void
    type: TransactionType | null
}

export function TransactionFormModal({ isOpen, onClose, type }: TransactionFormModalProps) {
    const { profile } = useAuth()
    const [loading, setLoading] = useState(false)

    // Data Sources
    const [accounts, setAccounts] = useState<Account[]>([])
    const [cards, setCards] = useState<CreditCard[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    // Form State
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categoryId, setCategoryId] = useState('')
    const [accountId, setAccountId] = useState('') // Source for Transfer/Expense, Dest for Income
    const [targetAccountId, setTargetAccountId] = useState('') // Dest for Transfer
    const [cardId, setCardId] = useState('') // For Credit Card
    const [isFixed, setIsFixed] = useState(false)

    // UI State
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false)

    // Fetch dependencies
    useEffect(() => {
        if (isOpen && profile?.family_id) {
            supabase.from('accounts').select('*').eq('family_id', profile.family_id).then(({ data }) => setAccounts(data || []))
            supabase.from('credit_cards').select('*').eq('family_id', profile.family_id).then(({ data }) => setCards(data || []))
            supabase.from('categories').select('*').eq('family_id', profile.family_id).then(({ data }) => setCategories(data || []))
        }
    }, [isOpen, profile?.family_id])

    // Reset form when type changes
    useEffect(() => {
        if (type) {
            setAmount(0)
            setDescription('')
            setDate(new Date().toISOString().split('T')[0])
            setCategoryId('')
            setAccountId('')
            setTargetAccountId('')
            setCardId('')
            setIsFixed(false)

            // Auto-open calculator
            const timer = setTimeout(() => {
                setIsCalculatorOpen(true);
            }, 400);

            return () => clearTimeout(timer);
        }
    }, [type, isOpen])

    if (!isOpen || !type) return null

    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (!profile?.family_id) throw new Error("Família não identificada")
            if (amount <= 0) throw new Error("Valor inválido")
            if (!categoryId) throw new Error("Selecione uma categoria")

            const recurrence = isFixed ? 'fixed' : 'none'

            if (type === 'transfer') {
                if (!accountId || !targetAccountId) throw new Error("Selecione as contas")

                const { error: err1 } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    account_id: accountId,
                    amount: -amount,
                    date,
                    description: `Transf. para: ${accounts.find(a => a.id === targetAccountId)?.name} - ${description}`,
                    category_id: categoryId,
                    status: 'pago',
                    recurrence
                })
                if (err1) throw err1
                const { error: err2 } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    account_id: targetAccountId,
                    amount: amount,
                    date,
                    description: `Transf. de: ${accounts.find(a => a.id === accountId)?.name} - ${description}`,
                    category_id: categoryId,
                    status: 'pago',
                    recurrence: 'none' // Destination usually not fixed? Or should it mirror? Usually transfer is fixed on source.
                })
                if (err2) throw err2

            } else if (type === 'credit_card') {
                if (!cardId) throw new Error("Selecione um cartão")
                const { error } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    card_id: cardId,
                    amount: -amount,
                    date,
                    description,
                    category_id: categoryId,
                    status: 'pago',
                    recurrence
                })
                if (error) throw error

            } else {
                if (!accountId) throw new Error("Selecione uma conta")
                const isExpense = type === 'expense'
                const finalAmount = isExpense ? -amount : amount
                const { error } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    account_id: accountId,
                    amount: finalAmount,
                    date,
                    description,
                    category_id: categoryId,
                    status: 'pago',
                    recurrence
                })
                if (error) throw error
            }

            onClose()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const titleMap = {
        income: 'Nova Receita',
        expense: 'Nova Despesa',
        transfer: 'Nova Transferência',
        credit_card: 'Despesa no Cartão'
    }

    const selectedCategory = categories.find(c => c.id === categoryId)

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-medium text-white">{titleMap[type]}</h1>
                <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">

                {/* 1. Value Display */}
                <div className="py-8 flex flex-col items-center justify-center">
                    <div className="text-sm text-slate-400 mb-1 uppercase tracking-wide font-medium">Valor</div>
                    <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className={`text-5xl font-bold ${amount === 0 ? 'text-slate-600' : 'text-white'} tracking-tight flex items-center gap-1 active:scale-95 transition-transform`}
                    >
                        <span className="text-2xl font-light text-slate-600 self-start mt-2">R$</span>
                        {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </button>
                </div>

                {/* Form Fields List */}
                <div className="space-y-1">
                    {/* 2. Date */}
                    <div className="flex items-center p-4 border-y border-white/5 bg-surface/30">
                        <Calendar className="text-slate-500 mr-4" size={20} />
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="bg-transparent text-white w-full focus:outline-none h-full py-2"
                        />
                    </div>

                    {/* 3. Category (Drawer Trigger) */}
                    <div
                        onClick={() => setIsCategoryDrawerOpen(true)}
                        className="flex items-center p-4 border-b border-white/5 bg-surface/30 cursor-pointer active:bg-white/5 transition-colors"
                    >
                        <Tag className="text-slate-500 mr-4" size={20} />
                        <div className="flex-1">
                            {selectedCategory ? (
                                <span className="text-white font-medium">{selectedCategory.name}</span>
                            ) : (
                                <span className="text-slate-500">Selecionar Categoria</span>
                            )}
                        </div>
                        <ChevronDown className="text-slate-600" size={16} />
                    </div>

                    {/* 4. Description */}
                    <div className="flex items-center p-4 border-b border-white/5 bg-surface/30">
                        <MessageSquare className="text-slate-500 mr-4" size={20} />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-transparent text-white w-full focus:outline-none h-full py-2 placeholder-slate-600"
                        />
                    </div>

                    {/* 5. Account/Card Selection */}
                    <div className="bg-surface/30 border-b border-white/5">
                        {type === 'credit_card' ? (
                            <div className="relative flex items-center p-4">
                                <CardIcon className="text-slate-500 mr-4" size={20} />
                                <select
                                    value={cardId}
                                    onChange={e => setCardId(e.target.value)}
                                    className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                    style={{ color: cardId ? 'white' : '#64748b' }}
                                >
                                    <option value="" disabled>Selecione o Cartão</option>
                                    {cards.map(c => (
                                        <option key={c.id} value={c.id} className="bg-[#1e1e24] text-white">{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 pointer-events-none text-slate-600">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        ) : type === 'transfer' ? (
                            <div className="divide-y divide-white/5">
                                <div className="relative flex items-center p-4">
                                    <Wallet className="text-slate-500 mr-4" size={20} />
                                    <select
                                        value={accountId}
                                        onChange={e => setAccountId(e.target.value)}
                                        className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                        style={{ color: accountId ? 'white' : '#64748b' }}
                                    >
                                        <option value="" disabled>De: Conta Origem</option>
                                        {accounts.map(a => (
                                            <option key={a.id} value={a.id} className="bg-[#1e1e24] text-white">{a.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 pointer-events-none text-slate-600">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                                <div className="relative flex items-center p-4">
                                    <Wallet className="text-slate-500 mr-4" size={20} />
                                    <select
                                        value={targetAccountId}
                                        onChange={e => setTargetAccountId(e.target.value)}
                                        className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                        style={{ color: targetAccountId ? 'white' : '#64748b' }}
                                    >
                                        <option value="" disabled>Para: Conta Destino</option>
                                        {accounts.map(a => (
                                            <option key={a.id} value={a.id} className="bg-[#1e1e24] text-white">{a.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 pointer-events-none text-slate-600">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex items-center p-4">
                                <Wallet className="text-slate-500 mr-4" size={20} />
                                <select
                                    value={accountId}
                                    onChange={e => setAccountId(e.target.value)}
                                    className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                    style={{ color: accountId ? 'white' : '#64748b' }}
                                >
                                    <option value="" disabled>Conta</option>
                                    {accounts.map(a => (
                                        <option key={a.id} value={a.id} className="bg-[#1e1e24] text-white">{a.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 pointer-events-none text-slate-600">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 6. Fixed Transaction Toggle */}
                    <div className="p-4">
                        <FixedTransactionToggle
                            isFixed={isFixed}
                            onToggle={setIsFixed}
                            color={type === 'expense' || type === 'credit_card' ? 'rose' : type === 'transfer' ? 'blue' : 'emerald'}
                        />
                    </div>
                </div>
            </div>

            {/* Footer FAB (Submit) */}
            <div className="p-6 flex justify-center pb-8 safe-area-bottom">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`h-16 w-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${type === 'income' ? 'bg-emerald-600 shadow-emerald-600/30' :
                        type === 'expense' ? 'bg-red-600 shadow-red-600/30' :
                            type === 'transfer' ? 'bg-cyan-600 shadow-cyan-600/30' :
                                'bg-amber-600 shadow-amber-600/30'
                        }`}
                >
                    {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={32} strokeWidth={3} />}
                </button>
            </div>

            {/* Modals/Drawers */}
            <CalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
                onConfirm={(val) => setAmount(val)}
                initialValue={amount}
            />

            <CategoryPickerDrawer
                isOpen={isCategoryDrawerOpen}
                onClose={() => setIsCategoryDrawerOpen(false)}
                onSelect={(cat) => setCategoryId(cat.id)}
                selectedCategoryId={categoryId}
            />
        </div>
    )
}

