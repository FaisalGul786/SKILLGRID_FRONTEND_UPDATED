'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, KeyRound, Mail, X } from 'lucide-react'
import Field from './Field'
import Notice from './Notice'
import { demoCode, emailPattern } from './constants'
import { api } from '../../../lib/apiClient'

export default function ResetModal({ onClose }) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [key, setKey] = useState('') // temporay state

  useEffect(() => {
    if (!cooldown) return
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function sendCode(event) {
    event.preventDefault()
    setError('')
    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')

    const [err, data] = await api.post('/auth/forgot-password', {
      email,
    })

    console.log(`\n ******* err => ${err} ******* data`, data)

    if (err) {
      setError(err.message)
      return
    }

    if (data?.message) {
      setError(data.message)
    }

    setKey(data.forgotPasswordKey)
    setCooldown(30)
    setStep('otp')
  }

  async function verifyCode(event) {
    event.preventDefault()
    setError('')

    const [err, data] = await api.post('/auth/otp/verify/forgot-password', {
      otp: code,
      forgotPasswordKey: key,
    })

    console.log(`********** err => ${err} ******* data`, data)

    if (err) {
      setError(err.message)
      return
    }

    setKey(data.forgotPasswordKey)
    setStep('password')
  }

  async function updatePassword(event) {
    event.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const [err, data] = await api.patch('/auth/update-password', {
      newPassword: password,
      forgotPasswordKey: key,
    })

    console.log(`********** err => ${err} ******* data`, data)

    if (err) {
      setError(err.message)
      return
    }

    setError('')
    setStep('done')
  }
  if (step === 'done')
    return (
      <div className="modal-backdrop" role="presentation">
        <div
          className="reset-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
          <div className="modal-success">
            <CheckCircle2 size={36} />
            <h2>Password updated.</h2>
            <p>You can now log in with your new password.</p>
            <button className="auth-submit" onClick={onClose}>
              Return to login
            </button>
          </div>
        </div>
      </div>
    )
  const isOtp = step === 'otp'
  const isPassword = step === 'password'
  const submit = isOtp ? verifyCode : isPassword ? updatePassword : sendCode
  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="reset-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
        <span className="auth-kicker">ACCOUNT RECOVERY</span>
        <h2 id="reset-title">
          {isPassword
            ? 'Create a new password.'
            : isOtp
              ? 'Verify your email.'
              : 'Reset your password.'}
        </h2>
        <p className="modal-copy">
          {isPassword
            ? 'Choose a strong password for your account.'
            : isOtp
              ? `Enter the code sent to ${email}.`
              : "We'll send a verification code to your email."}
        </p>
        {error && <Notice tone="error">{error}</Notice>}
        <form className="auth-form" onSubmit={submit}>
          {!isOtp && !isPassword && (
            <Field
              label="Email address"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
            />
          )}
          {isOtp && (
            <>
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
            </>
          )}
          {isPassword && (
            <>
              <Field
                label="New password"
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                icon={KeyRound}
              />
              <Field
                label="Confirm password"
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                icon={KeyRound}
              />
            </>
          )}
          <button className="auth-submit" type="submit">
            {isOtp
              ? 'Verify code'
              : isPassword
                ? 'Update password'
                : 'Send code'}{' '}
            <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  )
}
