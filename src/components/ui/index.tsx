import type { ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    isLoading?: boolean
}

export function Button({ variant = 'primary', isLoading, className = '', children, ...props }: ButtonProps) {
    const base = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    const sizes = "px-4 py-3 text-sm md:text-base"

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
        outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500"
    }

    return (
        <button className={`${base} ${sizes} ${variants[variant]} ${className}`} {...props}>
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : children}
        </button>
    )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="space-y-1">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <input
                className={`w-full px-3 py-2 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}
export { Select } from './Select'
