import { useMemo } from 'react'
import type { Account, Transaction, CreditCard, CardStatement } from '../types'

interface FinanceEngineProps {
    accounts: Account[]
    transactions: Transaction[]
    cards: CreditCard[]
    statements: CardStatement[]
    targetDate?: Date // New optional prop, defaults to now
}

export function useFinanceEngine({ accounts, transactions, cards, statements, targetDate = new Date() }: FinanceEngineProps) {

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
        // Defines the horizon: End of the Target Month
        const endOfTargetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
        endOfTargetMonth.setHours(23, 59, 59, 999)

        const pendingSum = transactions
            .filter(t => {
                if (t.status !== 'pendente') return false
                const txDate = new Date(t.date + 'T12:00:00') // Force noon to avoid timezone shift dropping day
                return txDate <= endOfTargetMonth
            })
            .reduce((sum, t) => sum + Number(t.amount), 0)

        // Real Balance available now + All pending transactions up to the target date
        return availableNow + pendingSum
    }, [availableNow, transactions, targetDate])

    // 2.4 Gráfico de Saldo Mensal (Net Flow Accumulation)
    const monthlyCumulativeBalance = useMemo(() => {
        const year = targetDate.getFullYear()
        const month = targetDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // 1. Get transactions for this month
        const monthlyTx = transactions.filter(t => {
            const d = new Date(t.date + 'T12:00:00')
            return d.getFullYear() === year && d.getMonth() === month && t.status !== 'estornado'
        })

        // 2. Build daily map
        const dailyFlow = new Map<number, number>()
        for (let i = 1; i <= daysInMonth; i++) dailyFlow.set(i, 0)

        monthlyTx.forEach(t => {
            const day = new Date(t.date + 'T12:00:00').getDate()
            const current = dailyFlow.get(day) || 0

            // Income is positive, Expense is negative. 
            // Assuming amount in DB is: Income (+), Expense (-). 
            // If expense is stored as positive with type 'expense', I need to check category kind. 
            // But usually amount is signed? Let's check `Transaction` type or usage.
            // In `accountBalances` calculation: `sum + Number(t.amount)`. So amount is signed.
            dailyFlow.set(day, current + Number(t.amount))
        })

        // 3. Accumulate
        const data = []
        let currentBalance = 0
        for (let i = 1; i <= daysInMonth; i++) {
            currentBalance += dailyFlow.get(i) || 0
            data.push({
                day: i,
                balance: currentBalance
            })
        }

        return data

    }, [transactions, targetDate])


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
        monthlyCumulativeBalance,
        getStatementDateForTransaction
    }
}
