import {
    Home, ShoppingCart, Car, Utensils, Zap, Wifi, Phone,
    Briefcase, GraduationCap, Heart, Plane, Gift,
    PiggyBank, ArrowUpCircle, ArrowDownCircle, AlertCircle,
    Music, Video, Gamepad2, Book, Smile, Coffee, Shirt,
    Baby, Dog, Landmark, CreditCard, DollarSign
} from 'lucide-react'

export const CATEGORY_ICONS = [
    { name: 'Home', icon: Home, label: 'Casa' },
    { name: 'Shopping', icon: ShoppingCart, label: 'Compras' },
    { name: 'Food', icon: Utensils, label: 'Comida' },
    { name: 'Transport', icon: Car, label: 'Transporte' },
    { name: 'Bills', icon: Zap, label: 'Contas' },
    { name: 'Internet', icon: Wifi, label: 'Internet' },
    { name: 'Phone', icon: Phone, label: 'Telefone' },
    { name: 'Work', icon: Briefcase, label: 'Trabalho' },
    { name: 'Education', icon: GraduationCap, label: 'Educação' },
    { name: 'Health', icon: Heart, label: 'Saúde' },
    { name: 'Travel', icon: Plane, label: 'Viagem' },
    { name: 'Gift', icon: Gift, label: 'Presente' },
    { name: 'Savings', icon: PiggyBank, label: 'Investimento' },
    { name: 'Salary', icon: DollarSign, label: 'Salário' },
    { name: 'Leisure', icon: Gamepad2, label: 'Lazer' },
    { name: 'Subscriptions', icon: Music, label: 'Assinaturas' },
    { name: 'Clothes', icon: Shirt, label: 'Roupas' },
    { name: 'Pet', icon: Dog, label: 'Pet' },
    { name: 'Baby', icon: Baby, label: 'Bebê' },
    { name: 'Bank', icon: Landmark, label: 'Banco' },
]

export const CATEGORY_COLORS = [
    { name: 'Emerald', class: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/20' },
    { name: 'Rose', class: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', shadow: 'shadow-rose-500/20' },
    { name: 'Amber', class: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', shadow: 'shadow-amber-500/20' },
    { name: 'Cyan', class: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', shadow: 'shadow-cyan-500/20' },
    { name: 'Purple', class: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', shadow: 'shadow-purple-500/20' },
    { name: 'Blue', class: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-blue-500/20' },
    { name: 'Orange', class: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', shadow: 'shadow-orange-500/20' },
    { name: 'Pink', class: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', shadow: 'shadow-pink-500/20' },
    { name: 'Slate', class: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', shadow: 'shadow-slate-500/20' },
]

export const getIconComponent = (name: string) => {
    const item = CATEGORY_ICONS.find(i => i.name === name)
    return item ? item.icon : Tag
}

// Fallback icon component
import { Tag } from 'lucide-react'
