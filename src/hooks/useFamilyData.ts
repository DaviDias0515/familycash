import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Account, Transaction, CreditCard, CardStatement, Category, Budget } from '../types'

export function useFamilyData() {
    const { profile } = useAuth()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        accounts: [] as Account[],
        transactions: [] as Transaction[],
        cards: [] as CreditCard[],
        statements: [] as CardStatement[],
        categories: [] as Category[],
        budgets: [] as Budget[]
    })

    useEffect(() => {
        if (!profile?.family_id) return

        const fetchData = async () => {
            try {
                setLoading(true)
                const familyId = profile.family_id

                const [accounts, transactions, cards, statements, categories, budgets] = await Promise.all([
                    supabase.from('accounts').select('*').eq('family_id', familyId),
                    supabase.from('transactions').select('*').eq('family_id', familyId),
                    supabase.from('credit_cards').select('*').eq('family_id', familyId),
                    supabase.from('card_statements').select('*').eq('family_id', familyId),
                    supabase.from('categories').select('*').or(`family_id.eq.${familyId},family_id.is.null`), // Categories can be global (null) or family specific
                    supabase.from('budgets').select('*').eq('family_id', familyId)
                ])

                setData({
                    accounts: (accounts.data as Account[]) || [],
                    transactions: (transactions.data as Transaction[]) || [],
                    cards: (cards.data as CreditCard[]) || [],
                    statements: (statements.data as CardStatement[]) || [],
                    categories: (categories.data as Category[]) || [],
                    budgets: (budgets.data as Budget[]) || []
                })

            } catch (error) {
                console.error('Error fetching family data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        // Realtime subscriptions could be added here later
        // For now, simpler to refetch on focus or mutation
    }, [profile?.family_id])

    return { ...data, loading }
}
