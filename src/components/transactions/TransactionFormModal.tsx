import { useState, useEffect } from 'react'
import { ArrowLeft, Check, Calendar, MessageSquare, Tag, CreditCard as CardIcon, Wallet, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CalculatorModal } from '../ui/CalculatorModal'
import { CategoryPickerDrawer } from './CategoryPickerDrawer'
import { AccountPickerDrawer } from './AccountPickerDrawer'
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
    const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false)
    const [accountDrawerType, setAccountDrawerType] = useState<'source' | 'target' | 'default'>('default')

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
    const selectedAccount = accounts.find(a => a.id === accountId)
    const selectedTargetAccount = accounts.find(a => a.id === targetAccountId)

    const openAccountDrawer = (type: 'source' | 'target' | 'default') => {
        setAccountDrawerType(type)
        setIsAccountDrawerOpen(true)
    }

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-500 hover:text-foreground rounded-full hover:bg-surface-subtle transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-foreground uppercase tracking-widest">{titleMap[type]}</h1>
                <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-background">

                {/* 1. Value Display */}
                <div className="py-12 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                    <div className="text-xs text-indigo-500 dark:text-cyan-400 mb-2 uppercase tracking-[0.2em] font-medium z-10">Valor da Transação</div>
                    <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className={`
                            relative z-10
                            text-6xl font-bold tracking-tighter flex items-center gap-1 
                            active:scale-95 transition-transform duration-200
                            ${amount === 0 ? 'text-slate-400 dark:text-slate-700' : 'text-foreground drop-shadow-lg'}
                        `}
                    >
                        <span className="text-3xl font-light text-slate-400 dark:text-slate-600 self-start mt-2">R$</span>
                        {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </button>
                </div>

                {/* Form Fields List - Cyber HUD Style */}
                <div className="px-4 space-y-4">

                    {/* 2. Date */}
                    <div className="flex items-center p-4 rounded-2xl bg-surface border border-border shadow-sm group focus-within:border-indigo-500/30 transition-colors">
                        <div className="p-2 rounded-lg bg-surface-subtle text-indigo-500 dark:text-cyan-400 mr-4 group-hover:scale-110 transition-transform">
                            <Calendar size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Data</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="bg-transparent text-foreground w-full focus:outline-none font-medium h-6 text-base"
                            />
                        </div>
                    </div>

                    {/* 3. Category (Drawer Trigger) */}
                    <div
                        onClick={() => setIsCategoryDrawerOpen(true)}
                        className="flex items-center p-4 rounded-2xl bg-surface border border-border shadow-sm cursor-pointer active:scale-[0.98] transition-all group"
                    >
                        <div className="p-2 rounded-lg bg-surface-subtle text-fuchsia-500 dark:text-fuchsia-400 mr-4 group-hover:scale-110 transition-transform">
                            <Tag size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Categoria</label>
                            {selectedCategory ? (
                                <span className="text-foreground font-medium text-base">{selectedCategory.name}</span>
                            ) : (
                                <span className="text-slate-400 text-base">Selecionar...</span>
                            )}
                        </div>
                        <ChevronDown className="text-slate-400" size={16} />
                    </div>

                    {/* 4. Description */}
                    <div className="flex items-center p-4 rounded-2xl bg-surface border border-border shadow-sm group focus-within:border-border-subtle transition-colors">
                        <div className="p-2 rounded-lg bg-surface-subtle text-amber-500 dark:text-amber-400 mr-4 group-hover:scale-110 transition-transform">
                            <MessageSquare size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Descrição</label>
                            <input
                                type="text"
                                placeholder="Do que se trata?"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="bg-transparent text-foreground w-full focus:outline-none font-medium placeholder-slate-400 h-6 text-base"
                            />
                        </div>
                    </div>

                    {/* 5. Account/Card Selection */}
                    <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
                        {type === 'credit_card' ? (
                            <div className="relative flex items-center p-4 group">
                                <div className="p-2 rounded-lg bg-surface-subtle text-purple-500 dark:text-purple-400 mr-4 group-hover:scale-110 transition-transform">
                                    <CardIcon size={20} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Cartão</label>
                                    <select
                                        value={cardId}
                                        onChange={e => setCardId(e.target.value)}
                                        className="w-full bg-transparent text-foreground appearance-none focus:outline-none font-medium h-6 text-base"
                                        style={{ color: cardId ? 'var(--color-foreground)' : '#94a3b8' }}
                                    >
                                        <option value="" disabled className="dark:bg-slate-900 bg-white">Selecione o Cartão</option>
                                        {cards.map(c => (
                                            <option key={c.id} value={c.id} className="dark:bg-slate-900 bg-white text-foreground">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="absolute right-4 pointer-events-none text-slate-400">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        ) : type === 'transfer' ? (
                            <div className="divide-y divide-border">
                                {/* From Account */}
                                <div
                                    onClick={() => openAccountDrawer('source')}
                                    className="relative flex items-center p-4 cursor-pointer active:bg-surface-subtle/50 transition-colors group"
                                >
                                    <div className="p-2 rounded-lg bg-surface-subtle text-blue-500 dark:text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                                        <Wallet size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">De (Origem)</label>
                                        {selectedAccount ? (
                                            <span className="text-foreground font-medium text-base">{selectedAccount.name}</span>
                                        ) : (
                                            <span className="text-slate-400 text-base">Selecionar...</span>
                                        )}
                                    </div>
                                    <ChevronDown className="text-slate-400" size={16} />
                                </div>

                                {/* To Account */}
                                <div
                                    onClick={() => openAccountDrawer('target')}
                                    className="relative flex items-center p-4 cursor-pointer active:bg-surface-subtle/50 transition-colors group"
                                >
                                    <div className="p-2 rounded-lg bg-surface-subtle text-emerald-500 dark:text-emerald-400 mr-4 group-hover:scale-110 transition-transform">
                                        <Wallet size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Para (Destino)</label>
                                        {selectedTargetAccount ? (
                                            <span className="text-foreground font-medium text-base">{selectedTargetAccount.name}</span>
                                        ) : (
                                            <span className="text-slate-400 text-base">Selecionar...</span>
                                        )}
                                    </div>
                                    <ChevronDown className="text-slate-400" size={16} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => openAccountDrawer('default')}
                                className="relative flex items-center p-4 cursor-pointer active:bg-surface-subtle/50 transition-colors group"
                            >
                                <div className="p-2 rounded-lg bg-surface-subtle text-emerald-500 dark:text-emerald-400 mr-4 group-hover:scale-110 transition-transform">
                                    <Wallet size={20} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Conta</label>
                                    {selectedAccount ? (
                                        <span className="text-foreground font-medium text-base">{selectedAccount.name}</span>
                                    ) : (
                                        <span className="text-slate-400 text-base">Selecionar...</span>
                                    )}
                                </div>
                                <ChevronDown className="text-slate-400" size={16} />
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
                        shadow-lg
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
                type={type}
            />

            <AccountPickerDrawer
                isOpen={isAccountDrawerOpen}
                onClose={() => setIsAccountDrawerOpen(false)}
                onSelect={(acc) => {
                    if (accountDrawerType === 'target') {
                        setTargetAccountId(acc.id)
                    } else {
                        setAccountId(acc.id)
                    }
                    setIsAccountDrawerOpen(false)
                }}
                selectedAccountId={accountDrawerType === 'target' ? targetAccountId : accountId}
                accounts={accounts}
                title={accountDrawerType === 'target' ? 'Conta Destino' : accountDrawerType === 'source' ? 'Conta Origem' : 'Selecionar Conta'}
            />
        </div>
    )
}

