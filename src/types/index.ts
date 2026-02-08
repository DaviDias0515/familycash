export type Profile = {
    id: string
    family_id: string
    full_name: string
    role: UserRole
    created_at: string
}

// Add other shared types here
// Database Enums
export type UserRole = 'admin' | 'member' | 'child'
export type AccountType = 'corrente' | 'poupanca' | 'investimento' | 'dinheiro'
export type TransactionStatus = 'pago' | 'pendente' | 'estornado'
export type CardStatementStatus = 'open' | 'closed' | 'paid'
export type CategoryKind = 'income' | 'expense' | 'transfer' | 'credit_card'

export interface Account {
    id: string
    family_id: string
    owner_id: string
    name: string
    type: AccountType
    initial_balance: number
}

export interface Transaction {
    id: string
    family_id: string
    account_id: string | null
    card_id: string | null
    statement_id: string | null
    category_id: string
    amount: number
    date: string
    description: string
    status: TransactionStatus
    recurrence?: 'none' | 'fixed' | 'installment'
    parent_id?: string | null
}

export interface CreditCard {
    id: string
    name: string
    credit_limit: number
    closing_day: number
    due_day: number
    default_account_id?: string
}

export interface CardStatement {
    id: string
    card_id: string
    month: number
    year: number
    status: CardStatementStatus
}

export interface Category {
    id: string
    family_id: string | null
    name: string
    kind: CategoryKind
    icon?: string
    color?: string
}

export interface Budget {
    id: string
    family_id: string
    category_id: string
    amount: number
    month?: number // If we want monthly specific budgets later
    year?: number
}
