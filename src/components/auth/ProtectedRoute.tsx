import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { session, profile, loading } = useAuth()

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    // If user has no profile/family, force them to onboarding
    // Unless we are currently ON the onboarding page (handled by parent route config perhaps? or logic here)
    // Let's assume we use this for Dashboard/Budget etc.
    if (!profile?.family_id && session) {
        // Avoid infinite loop if this component is used for Onboarding too
        // The router in App.tsx should handle this separation
        return <Navigate to="/onboarding" replace />
    }

    return children
}
