import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function AuthShell({ children, mode, onMode }) {
  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />
      <a href="/" className="auth-brand">
        <span className="logo-mark">
          <Sparkles size={17} />
        </span>
        <span>
          NEXORA<span className="logo-dot">.</span>
        </span>
      </a>
      <section className="auth-layout">
        <aside className="auth-aside">
          <span className="auth-kicker">NEXORA LEARNING PLATFORM</span>
          <h1>
            Turn curiosity into <em>capability.</em>
          </h1>
          <p>
            One focused session at a time. Build the skills that move your
            future forward.
          </p>
          <div className="auth-aside-list">
            <span>
              <CheckCircle2 size={17} /> Expert-led courses
            </span>
            <span>
              <CheckCircle2 size={17} /> Practical projects
            </span>
            <span>
              <CheckCircle2 size={17} /> A path made for you
            </span>
          </div>
        </aside>
        <div className="auth-card">
          {children}
          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                New to Nexora?{' '}
                <button onClick={() => onMode('register')}>
                  Create an account <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <>
                Already learning with us?{' '}
                <button onClick={() => onMode('login')}>
                  Log in <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </section>
      <p className="auth-footer">
        © 2024 Nexora Learning, Inc. <span>·</span> Secure demo experience
      </p>
    </main>
  )
}
