import { useMemo } from 'react'
import type { Account, Transaction, CreditCard, CardStatement } from '../types'

interface FinanceEngineProps {
    accounts: Account[]
    transactions: Transaction[]
    cards: CreditCard[]
    statements: CardStatement[]
}

export function useFinanceEngine({ accounts, transactions, cards, statements }: FinanceEngineProps) {

    // 2.1 Saldo de Conta (dinheiro real)
    const accountBalances = useMemo(() => {
        return accounts.map(account => {
            const txSum = transactions
                .filter(t => t.account_id === account.id && t.status === 'pago')
                .reduce((sum, t) => sum + Number(t.amount), 0)
            return {
                ...account,
                current_balance: Number(account.initial_balance) + txSum
            }
        })
    }, [accounts, transactions])

    // 2.1 (Total) -> 2.3 Parte 1 (Disponível Agora)
    const availableNow = useMemo(() => {
        return accountBalances.reduce((sum, acc) => sum + acc.current_balance, 0)
    }, [accountBalances])

    // 2.2 Cartão (Limite)
    const cardUtilizations = useMemo(() => {
        return cards.map(card => {
            // Limite Utilizado = sum(abs(tx)) where status != estornado AND statement != paid
            const used = transactions
                .filter(t => {
                    if (t.card_id !== card.id) return false
                    if (t.status === 'estornado') return false
                    // Check if statement is paid
                    if (!t.statement_id) return true // No statement yet implies open usually, or handling error
                    const stmt = statements.find(s => s.id === t.statement_id)
                    return stmt ? stmt.status !== 'paid' : true
                })
                .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)

            return {
                ...card,
                limit_used: used,
                limit_available: Number(card.credit_limit) - used
            }
        })
    }, [cards, transactions, statements])

    // 2.3 Saldo Projetado Família
    const projectedBalance = useMemo(() => {
        const today = new Date()
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        const pendingSum = transactions
            .filter(t => {
                if (t.status !== 'pendente') return false
                const txDate = new Date(t.date)
                return txDate <= endOfMonth
            })
            .reduce((sum, t) => sum + Number(t.amount), 0)

        return availableNow + pendingSum
    }, [availableNow, transactions])

    // 2.4 Lógica de Fatura (Helper)
    const getStatementDateForTransaction = (dateStr: string, closingDay: number) => {
        const date = new Date(dateStr)
        const day = date.getDate()
        let month = date.getMonth() + 1 // 1-12
        let year = date.getFullYear()

        if (day > closingDay) {
            month++
            if (month > 12) {
                month = 1
                year++
            }
        }
        return { month, year }
    }

    return {
        accountBalances,
        availableNow,
        cardUtilizations,
        projectedBalance,
        getStatementDateForTransaction
    }
}
