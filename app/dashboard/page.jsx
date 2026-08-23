'use client'

import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LogOut,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react'

const lessons = [
  {
    title: 'Build your first responsive interface',
    course: 'Full-Stack Web Development',
    progress: 68,
    color: 'indigo',
  },
  {
    title: 'Data storytelling with dashboards',
    course: 'Practical Data Science',
    progress: 32,
    color: 'blue',
  },
]

export default function DashboardPage() {
  const [email, setEmail] = useState('learner@example.com')
  // useEffect(() => {
  //   const session = sessionStorage.getItem('nexora-auth')
  //   if (!session) {
  //     window.location.href = '/auth'
  //     return
  //   }
  //   setEmail(JSON.parse(session).email)
  // }, [])
  function logout() {
    sessionStorage.removeItem('nexora-auth')
    window.location.href = '/auth'
  }
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <a href="/" className="logo">
          <span className="logo-mark">
            <Sparkles size={17} />
          </span>
          <span>
            NEXORA<span className="logo-dot">.</span>
          </span>
        </a>
        <div className="dashboard-user">
          <span>{email}</span>
          <button onClick={logout} aria-label="Log out">
            <LogOut size={17} />
          </button>
        </div>
      </header>
      <section className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <span className="auth-kicker">YOUR LEARNING SPACE</span>
            <h1>Keep moving forward.</h1>
            <p>
              Two focused sessions today can change what you&apos;re capable of
              tomorrow.
            </p>
          </div>
          <div className="streak-card">
            <Trophy size={22} />
            <div>
              <strong>7 day streak</strong>
              <small>Best: 12 days</small>
            </div>
          </div>
        </div>
        <div className="dashboard-grid">
          <section className="learning-panel">
            <div className="panel-heading">
              <div>
                <span className="auth-kicker">CONTINUE LEARNING</span>
                <h2>Your active courses</h2>
              </div>
              <a href="/" className="text-link">
                Browse courses <ArrowRight size={15} />
              </a>
            </div>
            {lessons.map((lesson) => (
              <article className="lesson-card" key={lesson.title}>
                <div className={`lesson-icon ${lesson.color}`}>
                  <BookOpen size={20} />
                </div>
                <div className="lesson-details">
                  <span>{lesson.course}</span>
                  <h3>{lesson.title}</h3>
                  <div className="progress-track">
                    <span style={{ width: `${lesson.progress}%` }} />
                  </div>
                  <small>{lesson.progress}% complete</small>
                </div>
                <button
                  className="lesson-play"
                  aria-label={`Continue ${lesson.title}`}
                >
                  <Play size={16} fill="currentColor" />
                </button>
              </article>
            ))}
          </section>
          <aside className="dashboard-side">
            <div className="side-card">
              <span className="auth-kicker">THIS WEEK</span>
              <strong className="big-stat">
                4.5<span>h</span>
              </strong>
              <p>Learning time</p>
              <div className="week-bars">
                <i style={{ height: '38%' }} />
                <i style={{ height: '56%' }} />
                <i style={{ height: '30%' }} />
                <i style={{ height: '74%' }} />
                <i style={{ height: '48%' }} />
                <i style={{ height: '90%' }} />
                <i style={{ height: '24%' }} />
              </div>
              <small>
                Mon&nbsp;&nbsp; Tue&nbsp;&nbsp; Wed&nbsp;&nbsp; Thu&nbsp;&nbsp;
                Fri&nbsp;&nbsp; Sat&nbsp;&nbsp; Sun
              </small>
            </div>
            <div className="side-card milestone">
              <CheckCircle2 size={22} />
              <div>
                <span className="auth-kicker">NEXT MILESTONE</span>
                <strong>Complete 2 more lessons</strong>
                <p>Unlock your first certificate.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
