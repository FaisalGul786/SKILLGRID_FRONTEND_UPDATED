'use client'

import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  Loader2,
  UserRound,
} from 'lucide-react'
import Field from '../components/Field'
import Notice from '../components/Notice'
import { demoCode, emailPattern } from '../components/constants'
import { api } from '../../../lib/apiClient'

export default function RegisterPage({ onMode }) {
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [tempKey, setTempKey] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cooldown) return
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function submit(event) {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Tell us your name.'
    if (!emailPattern.test(form.email))
      next.email = 'Enter a valid email address.'
    if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    setErrors(next)

    if (!Object.keys(next).length) {
      setLoading(true)
      console.log('\n ******** form data ', form)
      const [err, data] = await api.post('/auth/register', form)

      console.log('******** account temp key ', data)

      setLoading(false)

      if (err) {
        console.log('********** ', err)
        setNotice(err.message)
        return
      }

      setTempKey(`${data.registerKey}`)
      setStep('otp')
      setCooldown(30)
      setNotice('')
    }
  }
  async function verify(event) {
    event.preventDefault()

    setLoading(true)
    const [err, data] = await api.post('/auth/verify/otp', {
      otp: code,
      registerKey: tempKey,
    })

    setLoading(false)

    if (err) {
      console.log('\n ******* error while verifying otp ', err)
      setNotice(err.message)
      return
    }

    console.log('**********data after otp Verification  ', data)
    setNotice(data.message)
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
              disabled={loading}
            />
          </label>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify email'}
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <CheckCircle2 size={17} />
            )}
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
        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <ArrowRight size={17} />
          )}
        </button>
      </form>
    </>
  )
}
