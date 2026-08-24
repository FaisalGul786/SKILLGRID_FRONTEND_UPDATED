'use client'

import { useState } from 'react'
import { ArrowRight, KeyRound, LockKeyhole, Mail } from 'lucide-react'
import Field from '../components/Field'
import Notice from '../components/Notice'
import { emailPattern } from '../components/constants'
import { api } from '../../../lib/apiClient'
import { Loader2 } from 'lucide-react'

export default function LoginPage({ onForgot }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const next = {}
    if (!emailPattern.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 8)
      next.password = 'Password must be at least 8 characters.'
    setErrors(next)

    if (!Object.keys(next).length) {
      setLoading(true)

      const [err, data] = await api.post(
        '/auth/login',
        {
          email,
          password,
        },
        {
          credentials: 'include',
        },
      )

      setLoading(false)

      if (err) {
        console.log(`********* error `, err)
        setNotice(err.message)
        return
      }

      setNotice(data.message)
      window.location.href = '/dashboard'
    }

    setNotice('')
  }
  return (
    <>
      <div className="auth-heading">
        <span className="auth-icon">
          <LockKeyhole size={20} />
        </span>
        <span className="auth-kicker">WELCOME BACK</span>
        <h2>Log in to keep learning.</h2>
        <p>Pick up right where you left off.</p>
      </div>
      {notice && <Notice onClose={() => setNotice('')}>{notice}</Notice>}
      <form className="auth-form" onSubmit={submit} noValidate>
        <Field
          label="Email address"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={Mail}
          error={errors.email}
        />
        <Field
          label="Password"
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon={KeyRound}
          error={errors.password}
        />
        <button type="button" className="forgot-link" onClick={onForgot}>
          Forgot password?
        </button>
        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Log in...' : 'Log in'}
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
