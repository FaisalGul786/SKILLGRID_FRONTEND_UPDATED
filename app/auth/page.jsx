'use client'

import { useState } from 'react'
import AuthShell from './components/AuthShell'
import ResetModal from './components/ResetModal'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [forgot, setForgot] = useState(false)

  return <AuthShell mode={mode} onMode={setMode}>{mode === 'login' ? <LoginPage onForgot={() => setForgot(true)} /> : <RegisterPage onMode={setMode} />}{forgot && <ResetModal onClose={() => setForgot(false)} />}</AuthShell>
}
