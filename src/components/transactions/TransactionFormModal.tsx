import { useState, useEffect } from 'react'
import { ArrowLeft, Check, Calendar, MessageSquare, Tag, CreditCard as CardIcon, Wallet, ArrowRightLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CalculatorModal } from '../ui/CalculatorModal'
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

    // UI State
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

    // Fetch dependencies
    useEffect(() => {
        if (isOpen && profile?.family_id) {
            supabase.from('accounts').select('*').eq('family_id', profile.family_id).then(({ data }) => setAccounts(data || []))
            supabase.from('credit_cards').select('*').eq('family_id', profile.family_id).then(({ data }) => setCards(data || []))
            supabase.from('categories').select('*').eq('family_id', profile.family_id).then(({ data }) => setCategories(data || []))
        }
    }, [isOpen, profile?.family_id])

    // Reset form when type changes and auto-open calculator
    useEffect(() => {
        if (type) {
            setAmount(0)
            setDescription('')
            setDate(new Date().toISOString().split('T')[0])
            setCategoryId('')
            setAccountId('')
            setTargetAccountId('')
            setCardId('')

            // Auto-open calculator with specialized animation delay
            const timer = setTimeout(() => {
                setIsCalculatorOpen(true);
            }, 400); // 400ms delay for smooth entrance

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

            if (type === 'transfer') {
                if (!accountId || !targetAccountId) throw new Error("Selecione as contas")
                // ... (Logic same as before, abbreviated here for brevity but fully implemented)
                const { error: err1 } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    account_id: accountId,
                    amount: -amount,
                    date,
                    description: `Transf. para: ${accounts.find(a => a.id === targetAccountId)?.name} - ${description}`,
                    category_id: categoryId,
                    status: 'pago'
                })
                if (err1) throw err1
                const { error: err2 } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    account_id: targetAccountId,
                    amount: amount,
                    date,
                    description: `Transf. de: ${accounts.find(a => a.id === accountId)?.name} - ${description}`,
                    category_id: categoryId,
                    status: 'pago'
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
                    status: 'pago'
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
                    status: 'pago'
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

    // Filter categories
    const filteredCategories = categories.filter(c => {
        if (type === 'income') return c.kind === 'income'
        if (type === 'expense') return c.kind === 'expense'
        if (type === 'credit_card') return c.kind === 'credit_card' || c.kind === 'expense'
        if (type === 'transfer') return c.kind === 'transfer'
        return true
    })

    const titleMap = {
        income: 'Nova Receita',
        expense: 'Nova Despesa',
        transfer: 'Nova Transferência',
        credit_card: 'Despesa no Cartão'
    }

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-medium text-white">{titleMap[type]}</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">

                {/* Value Display */}
                <div className="py-10 flex flex-col items-center justify-center">
                    <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-medium">Valor da {type === 'income' ? 'receita' : 'transação'}</div>
                    <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className={`text-5xl font-bold ${amount === 0 ? 'text-slate-600' : 'text-white'} tracking-tight flex items-center gap-1 active:scale-95 transition-transform`}
                    >
                        <span className="text-2xl font-light text-slate-600 self-start mt-2">R$</span>
                        {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </button>
                </div>

                {/* Form Fields List */}
                <div className="mt-4">
                    {/* Date */}
                    <div className="flex items-center p-4 border-y border-white/5">
                        <Calendar className="text-slate-500 mr-4" size={20} />
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="bg-transparent text-white w-full focus:outline-none h-full py-2"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex items-center p-4 border-b border-white/5">
                        <MessageSquare className="text-slate-500 mr-4" size={20} />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-transparent text-white w-full focus:outline-none h-full py-2 placeholder-slate-600"
                        />
                    </div>

                    {/* Category Selection (Simple HTML Select for now, or Custom Modal later) */}
                    <div className="relative flex items-center p-4 border-b border-white/5">
                        <Tag className="text-slate-500 mr-4" size={20} />
                        <select
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            className="w-full bg-transparent text-white appearance-none focus:outline-none"
                            style={{ color: categoryId ? 'white' : '#52525b' }} // slate-600
                        >
                            <option value="" disabled>Categoria</option>
                            {filteredCategories.map(c => (
                                <option key={c.id} value={c.id} className="bg-surface text-white">{c.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 pointer-events-none text-slate-600">
                            <ArrowRightLeft size={16} /> {/* Placeholder arrow */}
                        </div>
                    </div>

                    {/* Account/Card Selection */}
                    {type === 'credit_card' ? (
                        <div className="relative flex items-center p-4 border-b border-white/5">
                            <CardIcon className="text-slate-500 mr-4" size={20} />
                            <select
                                value={cardId}
                                onChange={e => setCardId(e.target.value)}
                                className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                style={{ color: cardId ? 'white' : '#52525b' }}
                            >
                                <option value="" disabled>Selecione o Cartão</option>
                                {cards.map(c => (
                                    <option key={c.id} value={c.id} className="bg-surface text-white">{c.name}</option>
                                ))}
                            </select>
                        </div>
                    ) : type === 'transfer' ? (
                        <>
                            <div className="relative flex items-center p-4 border-b border-white/5">
                                <Wallet className="text-slate-500 mr-4" size={20} />
                                <select
                                    value={accountId}
                                    onChange={e => setAccountId(e.target.value)}
                                    className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                    style={{ color: accountId ? 'white' : '#52525b' }}
                                >
                                    <option value="" disabled>De: Conta Origem</option>
                                    {accounts.map(a => (
                                        <option key={a.id} value={a.id} className="bg-surface text-white">{a.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative flex items-center p-4 border-b border-white/5">
                                <Wallet className="text-slate-500 mr-4" size={20} />
                                <select
                                    value={targetAccountId}
                                    onChange={e => setTargetAccountId(e.target.value)}
                                    className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                    style={{ color: targetAccountId ? 'white' : '#52525b' }}
                                >
                                    <option value="" disabled>Para: Conta Destino</option>
                                    {accounts.map(a => (
                                        <option key={a.id} value={a.id} className="bg-surface text-white">{a.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : (
                        <div className="relative flex items-center p-4 border-b border-white/5">
                            <Wallet className="text-slate-500 mr-4" size={20} />
                            <select
                                value={accountId}
                                onChange={e => setAccountId(e.target.value)}
                                className="w-full bg-transparent text-white appearance-none focus:outline-none"
                                style={{ color: accountId ? 'white' : '#52525b' }}
                            >
                                <option value="" disabled>Conta</option>
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id} className="bg-surface text-white">{a.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                </div>
            </div>

            {/* Footer FAB */}
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

            {/* Calculator Modal */}
            <CalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
                onConfirm={(val) => setAmount(val)}
                initialValue={amount}
            />
        </div>
    )
}
