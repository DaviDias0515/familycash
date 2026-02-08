import { useState, useEffect } from 'react'

export function usePrivacy() {
    // Initialize from localStorage if available
    const [isPrivate, setIsPrivate] = useState(() => {
        const saved = localStorage.getItem('family-cash-privacy')
        return saved ? JSON.parse(saved) : false
    })

    useEffect(() => {
        localStorage.setItem('family-cash-privacy', JSON.stringify(isPrivate))
    }, [isPrivate])

    const togglePrivacy = () => setIsPrivate((prev: boolean) => !prev)

    return { isPrivate, togglePrivacy }
}
