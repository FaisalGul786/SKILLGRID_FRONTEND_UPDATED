import { CheckCircle2, ShieldCheck, X } from 'lucide-react'

export default function Notice({ children, tone = 'info', onClose }) {
  return <div className={`auth-notice ${tone}`} role="alert"><span>{tone === 'success' ? <CheckCircle2 size={17} /> : <ShieldCheck size={17} />}</span><p>{children}</p>{onClose && <button onClick={onClose} aria-label="Close message"><X size={16} /></button>}</div>
}
