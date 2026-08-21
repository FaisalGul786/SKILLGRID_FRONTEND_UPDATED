'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Field({ label, id, type = 'text', value, onChange, placeholder, icon: Icon, error }) {
  const [visible, setVisible] = useState(false)
  const inputType = type === 'password' && visible ? 'text' : type

  return <label className="auth-field" htmlFor={id}><span>{label}</span><div className={`auth-input-wrap ${error ? 'has-error' : ''}`}><Icon size={17} aria-hidden="true" /><input id={id} type={inputType} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error)} />{type === 'password' && <button type="button" className="input-action" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>}</div>{error && <small className="field-error">{error}</small>}</label>
}
