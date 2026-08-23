'use client'

import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  UserRound,
} from 'lucide-react'
import Field from '../components/Field'
import Notice from '../components/Notice'
import { demoCode, emailPattern } from '../components/constants'

export default function RegisterPage({ onMode }) {
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState('')
  const [cooldown, setCooldown] = useState(0)
  useEffect(() => {
    if (!cooldown) return
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  function submit(event) {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Tell us your name.'
    if (!emailPattern.test(form.email))
      next.email = 'Enter a valid email address.'
    if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    setErrors(next)

    console.log(`******* ${!Object.keys(next).length}`)

    if (!Object.keys(next).length) {
      setStep('otp')
      setCooldown(30)
    }
  }
  function verify(event) {
    event.preventDefault()
    if (code !== demoCode) {
      setNotice('That code is not valid. Use the demo code 123456.')
      return
    }
    sessionStorage.setItem('nexora-profile', JSON.stringify(form))
    onMode('login')
  }
  if (step === 'otp')
    return (
      <>
        <div className="auth-heading">
          <span className="auth-icon">
            <Mail size={20} />
          </span>
          <span className="auth-kicker">VERIFY YOUR EMAIL</span>
          <h2>Check your inbox.</h2>
          <p>
            We sent a six-digit code to <strong>{form.email}</strong>.
          </p>
        </div>
        {notice && (
          <Notice tone="error" onClose={() => setNotice('')}>
            {notice}
          </Notice>
        )}
        <form className="auth-form" onSubmit={verify}>
          <label className="auth-field">
            <span>Verification code</span>
            <input
              className="otp-input"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              autoFocus
            />
          </label>
          <button className="auth-submit" type="submit">
            Verify email <CheckCircle2 size={17} />
          </button>
          <button
            className="resend"
            type="button"
            disabled={cooldown > 0}
            onClick={() => setCooldown(30)}
          >
            {cooldown ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
          <p className="demo-hint">
            Demo code: <strong>123456</strong>
          </p>
        </form>
      </>
    )
  return (
    <>
      <div className="auth-heading">
        <span className="auth-icon">
          <UserRound size={20} />
        </span>
        <span className="auth-kicker">START YOUR JOURNEY</span>
        <h2>Create your account.</h2>
        <p>Join thousands of curious learners building what&apos;s next.</p>
      </div>
      {notice && (
        <Notice tone="error" onClose={() => setNotice('')}>
          {notice}
        </Notice>
      )}
      <form className="auth-form" onSubmit={submit} noValidate>
        <Field
          label="Full name"
          id="register-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Alex Morgan"
          icon={UserRound}
          error={errors.name}
        />
        <Field
          label="Email address"
          id="register-email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          icon={Mail}
          error={errors.email}
        />
        <Field
          label="Password"
          id="register-password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="At least 8 characters"
          icon={KeyRound}
          error={errors.password}
        />
        <button className="auth-submit" type="submit">
          Create account <ArrowRight size={17} />
        </button>
      </form>
    </>
  )
}
