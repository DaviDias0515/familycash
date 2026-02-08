import type { ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    isLoading?: boolean
}

export function Button({ variant = 'primary', isLoading, className = '', children, ...props }: ButtonProps) {
    const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
    const sizes = "px-4 py-3 text-sm md:text-base"

    const variants = {
        primary: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-white/10",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5",
        outline: "border border-white/20 text-slate-300 hover:text-white hover:border-white/40 hover:bg-white/5",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5"
    }

    return (
        <button className={`${base} ${sizes} ${variants[variant]} ${className}`} {...props}>
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Carregando...</span>
                </div>
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
        <div className="space-y-1.5">
            {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
            <input
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20'
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-sm text-red-400 ml-1">{error}</p>}
        </div>
    )
}
export { Select } from './Select'
