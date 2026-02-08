import { useState, useEffect } from 'react'
import { X, Calendar, DollarSign, FileText, ArrowRight, CreditCard as CardIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input, Select } from '../ui'
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
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categoryId, setCategoryId] = useState('')
    const [accountId, setAccountId] = useState('') // Source for Transfer/Expense, Dest for Income
    const [targetAccountId, setTargetAccountId] = useState('') // Dest for Transfer
    const [cardId, setCardId] = useState('') // For Credit Card

    // Fetch dependencies
    useEffect(() => {
        if (isOpen && profile?.family_id) {
            // Load Accounts
            supabase.from('accounts').select('*').eq('family_id', profile.family_id)
                .then(({ data }) => setAccounts(data || []))

            // Load Cards
            supabase.from('credit_cards').select('*').eq('family_id', profile.family_id) // Assuming cards have family_id? Or check schema.
                // If credit_cards doesn't have family_id directly, we might need to filter differently. 
                // Let's assume shared or via profiles. types.ts says `id, name...`. 
                // Actually types.ts definition for CreditCard implies it might be simple.
                // Let's assume 'credit_cards' table has 'family_id' consistent with others.
                .then(({ data }) => setCards(data || []))

            // Load Categories
            supabase.from('categories').select('*').eq('family_id', profile.family_id)
                .then(({ data }) => setCategories(data || []))
        }
    }, [isOpen, profile?.family_id])

    // Reset form when type changes
    useEffect(() => {
        if (type) {
            setAmount('')
            setDescription('')
            setDate(new Date().toISOString().split('T')[0])
            setCategoryId('')
            setAccountId('')
            setTargetAccountId('')
            setCardId('')
        }
    }, [type, isOpen])

    if (!isOpen || !type) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!profile?.family_id) throw new Error("Família não identificada")

            const floatAmount = parseFloat(amount)
            if (isNaN(floatAmount) || floatAmount <= 0) throw new Error("Valor inválido")

            if (!categoryId) throw new Error("Selecione uma categoria")

            // Logic based on type
            if (type === 'transfer') {
                if (!accountId || !targetAccountId) throw new Error("Selecione as contas de origem e destino")
                if (accountId === targetAccountId) throw new Error("Contas devem ser diferentes")

                // Find/Create "Transfer" category if needed, or just insert.
                // Assuming we have a category for transfer. If not, we should probably handle it.
                // For now, let's use the selected category (user should pick "Transferencia")
                // Or auto-select it.

                // 1. Withdraw from Source
                const { error: err1 } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    account_id: accountId,
                    amount: -floatAmount, // Negative for source
                    date,
                    description: `Transf. para: ${accounts.find(a => a.id === targetAccountId)?.name} - ${description}`,
                    category_id: categoryId, // User must select "Transfer" category
                    status: 'pago'
                })
                if (err1) throw err1

                // 2. Deposit to Target
                const { error: err2 } = await supabase.from('transactions').insert({
                    family_id: profile.family_id,
                    account_id: targetAccountId,
                    amount: floatAmount, // Positive for dest
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
                    card_id: cardId, // Linked to card
                    amount: -floatAmount, // Expense is negative
                    date,
                    description,
                    category_id: categoryId,
                    status: 'pago' // Or pending until invoice close?
                })
                if (error) throw error

            } else {
                // Income or Expense
                if (!accountId) throw new Error("Selecione uma conta")

                const isExpense = type === 'expense'
                const finalAmount = isExpense ? -floatAmount : floatAmount

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
            // Could trigger a toast here
        } catch (error: any) {
            console.error(error)
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Filter categories based on transaction type
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

    // Helper to format options
    const accountOptions = [
        { value: '', label: 'Selecione a conta' },
        ...accounts.map(a => ({ value: a.id, label: a.name }))
    ]
    const cardOptions = [
        { value: '', label: 'Selecione o cartão' },
        ...cards.map(c => ({ value: c.id, label: c.name }))
    ]
    const categoryOptions = [
        { value: '', label: 'Selecione a categoria' },
        ...filteredCategories.map(c => ({ value: c.id, label: c.name }))
    ]


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 120 }}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 hidden">
                    {/* We can hide standard header and use a custom one inside form */}
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {type === 'income' && <span className="text-emerald-500"><DollarSign /></span>}
                            {type === 'expense' && <span className="text-red-500"><DollarSign /></span>}
                            {type === 'transfer' && <span className="text-blue-500"><ArrowRight /></span>}
                            {type === 'credit_card' && <span className="text-amber-500"><CardIcon /></span>}
                            {titleMap[type]}
                        </h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* 1. Value Input (Prominent) */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Valor</label>
                            <div className="flex items-center">
                                <span className="text-2xl font-light text-slate-400 mr-2">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    className="w-full bg-transparent text-3xl font-bold text-slate-800 dark:text-white placeholder-slate-300 focus:outline-none"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* 2. Simple Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="date"
                                label="Data"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />

                            {/* Account / Card Selection Logic */}
                            {type === 'transfer' ? (
                                <>
                                    <Select
                                        label="Origem"
                                        value={accountId}
                                        onChange={setAccountId}
                                        options={accountOptions}
                                    />
                                    <Select
                                        label="Destino"
                                        value={targetAccountId}
                                        onChange={setTargetAccountId}
                                        options={accountOptions}
                                    />
                                </>
                            ) : type === 'credit_card' ? (
                                <Select
                                    label="Cartão"
                                    value={cardId}
                                    onChange={setCardId}
                                    options={cardOptions}
                                />
                            ) : (
                                <Select
                                    label="Conta"
                                    value={accountId}
                                    onChange={setAccountId}
                                    options={accountOptions}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Select
                                label="Categoria"
                                value={categoryId}
                                onChange={setCategoryId}
                                options={categoryOptions}
                            />

                            <Input
                                label="Descrição"
                                placeholder="Do que se trata?"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-4 flex gap-3">
                            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className={`flex-1 ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                    type === 'expense' ? 'bg-red-600 hover:bg-red-700' :
                                        type === 'credit_card' ? 'bg-amber-600 hover:bg-amber-700' :
                                            'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                Confirmar
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
