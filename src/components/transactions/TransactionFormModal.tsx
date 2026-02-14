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
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest">{titleMap[type]}</h1>
                <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-background">

                {/* 1. Value Display */}
                <div className="py-12 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

                    <div className="text-xs text-cyan-400 mb-2 uppercase tracking-[0.2em] font-medium z-10">Valor da Transação</div>
                    <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className={`
                            relative z-10
                            text-6xl font-bold tracking-tighter flex items-center gap-1 
                            active:scale-95 transition-transform duration-200
                            ${amount === 0 ? 'text-slate-700' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]'}
                        `}
                    >
                        <span className="text-3xl font-light text-slate-600 self-start mt-2">R$</span>
                        {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </button>
                </div>

                {/* Form Fields List - Cyber HUD Style */}
                <div className="px-4 space-y-4">

                    {/* 2. Date */}
                    <div className="flex items-center p-4 rounded-2xl bg-surface border border-white/5 shadow-lg shadow-black/20 group focus-within:border-cyan-500/30 transition-colors">
                        <div className="p-2 rounded-lg bg-white/5 text-cyan-400 mr-4 group-hover:text-cyan-300 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all">
                            <Calendar size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Data</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="bg-transparent text-white w-full focus:outline-none font-medium h-6 text-base"
                            />
                        </div>
                    </div>

                    {/* 3. Category (Drawer Trigger) */}
                    <div
                        onClick={() => setIsCategoryDrawerOpen(true)}
                        className="flex items-center p-4 rounded-2xl bg-surface border border-white/5 shadow-lg shadow-black/20 cursor-pointer active:scale-[0.98] transition-all group"
                    >
                        <div className="p-2 rounded-lg bg-white/5 text-fuchsia-400 mr-4 group-hover:text-fuchsia-300 group-hover:shadow-[0_0_10px_rgba(217,70,239,0.2)] transition-all">
                            <Tag size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Categoria</label>
                            {selectedCategory ? (
                                <span className="text-white font-medium text-base">{selectedCategory.name}</span>
                            ) : (
                                <span className="text-slate-600 text-base">Selecionar...</span>
                            )}
                        </div>
                        <ChevronDown className="text-slate-600" size={16} />
                    </div>

                    {/* 4. Description */}
                    <div className="flex items-center p-4 rounded-2xl bg-surface border border-white/5 shadow-lg shadow-black/20 group focus-within:border-white/10 transition-colors">
                        <div className="p-2 rounded-lg bg-white/5 text-amber-400 mr-4 group-hover:text-amber-300 group-hover:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all">
                            <MessageSquare size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Descrição</label>
                            <input
                                type="text"
                                placeholder="Do que se trata?"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="bg-transparent text-white w-full focus:outline-none font-medium placeholder-slate-700 h-6 text-base"
                            />
                        </div>
                    </div>

                    {/* 5. Account/Card Selection */}
                    <div className="rounded-2xl bg-surface border border-white/5 shadow-lg shadow-black/20 overflow-hidden">
                        {type === 'credit_card' ? (
                            <div className="relative flex items-center p-4 group">
                                <div className="p-2 rounded-lg bg-white/5 text-purple-400 mr-4 group-hover:text-purple-300 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all">
                                    <CardIcon size={20} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Cartão</label>
                                    <select
                                        value={cardId}
                                        onChange={e => setCardId(e.target.value)}
                                        className="w-full bg-transparent text-white appearance-none focus:outline-none font-medium h-6 text-base"
                                        style={{ color: cardId ? 'white' : '#52525b' }}
                                    >
                                        <option value="" disabled>Selecione o Cartão</option>
                                        {cards.map(c => (
                                            <option key={c.id} value={c.id} className="bg-[#18181b] text-white">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="absolute right-4 pointer-events-none text-slate-600">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        ) : type === 'transfer' ? (
                            <div className="divide-y divide-white/5">
                                <div className="relative flex items-center p-4 group">
                                    <div className="p-2 rounded-lg bg-white/5 text-blue-400 mr-4 group-hover:text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.0)] group-hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all">
                                        <Wallet size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">De (Origem)</label>
                                        <select
                                            value={accountId}
                                            onChange={e => setAccountId(e.target.value)}
                                            className="w-full bg-transparent text-white appearance-none focus:outline-none font-medium h-6 text-base"
                                            style={{ color: accountId ? 'white' : '#52525b' }}
                                        >
                                            <option value="" disabled>Selecione...</option>
                                            {accounts.map(a => (
                                                <option key={a.id} value={a.id} className="bg-[#18181b] text-white">{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="absolute right-4 pointer-events-none text-slate-600">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                                <div className="relative flex items-center p-4 group">
                                    <div className="p-2 rounded-lg bg-white/5 text-emerald-400 mr-4 group-hover:text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.0)] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                                        <Wallet size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Para (Destino)</label>
                                        <select
                                            value={targetAccountId}
                                            onChange={e => setTargetAccountId(e.target.value)}
                                            className="w-full bg-transparent text-white appearance-none focus:outline-none font-medium h-6 text-base"
                                            style={{ color: targetAccountId ? 'white' : '#52525b' }}
                                        >
                                            <option value="" disabled>Selecione...</option>
                                            {accounts.map(a => (
                                                <option key={a.id} value={a.id} className="bg-[#18181b] text-white">{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="absolute right-4 pointer-events-none text-slate-600">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex items-center p-4 group">
                                <div className="p-2 rounded-lg bg-white/5 text-emerald-400 mr-4 group-hover:text-emerald-300 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                                    <Wallet size={20} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Conta</label>
                                    <select
                                        value={accountId}
                                        onChange={e => setAccountId(e.target.value)}
                                        className="w-full bg-transparent text-white appearance-none focus:outline-none font-medium h-6 text-base"
                                        style={{ color: accountId ? 'white' : '#52525b' }}
                                    >
                                        <option value="" disabled>Selecione...</option>
                                        {accounts.map(a => (
                                            <option key={a.id} value={a.id} className="bg-[#18181b] text-white">{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="absolute right-4 pointer-events-none text-slate-600">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 6. Fixed Transaction Toggle */}
                    <div className="px-1">
                        <FixedTransactionToggle
                            isFixed={isFixed}
                            onToggle={setIsFixed}
                            color={type === 'expense' || type === 'credit_card' ? 'rose' : type === 'transfer' ? 'cyan' : 'emerald'}
                        />
                    </div>
                </div>

                {/* Spacer for bottom FAB */}
                <div className="h-32" />
            </div>

            {/* Footer FAB (Submit) */}
            <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`
                        pointer-events-auto
                        h-16 w-16 
                        rounded-full 
                        flex items-center justify-center 
                        text-white 
                        shadow-[0_0_20px_rgba(0,0,0,0.5)] 
                        border border-white/20
                        transition-all duration-300 active:scale-95
                        ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/40' :
                            type === 'expense' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/40' :
                                type === 'transfer' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/40' :
                                    'bg-amber-600 hover:bg-amber-500 shadow-amber-500/40'
                        }
                    `}
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

