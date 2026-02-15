import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppShell() {
    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-1 pb-24 md:pb-8 p-4 md:p-8 md:ml-64 w-full max-w-5xl mx-auto md:mx-0">
                <Outlet />
            </main>
        </div>
    )
}
