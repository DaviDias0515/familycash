import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Timeline } from './pages/Timeline'
import { Budgets } from './pages/Budgets'
import { Settings } from './pages/Settings'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { Onboarding } from './pages/auth/Onboarding'
import { SettingsCategories } from './components/settings/SettingsCategories'
import { SettingsCards } from './components/settings/SettingsCards'
import { SettingsAccounts } from './components/settings/SettingsAccounts'
import { SettingsFamily } from './components/settings/SettingsFamily'
import { SettingsMenu } from './components/settings/SettingsMenu'
import { SettingsAccountCreate } from './components/settings/SettingsAccountCreate'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/settings" element={<Settings />}>
              <Route index element={<SettingsMenu />} />
              <Route path="categories" element={<SettingsCategories />} />
              <Route path="cards" element={<SettingsCards />} />
              <Route path="accounts" element={<SettingsAccounts />} />
              <Route path="accounts/new" element={<SettingsAccountCreate />} />
              <Route path="family" element={<SettingsFamily />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

