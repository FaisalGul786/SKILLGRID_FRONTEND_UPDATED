'use client'

import { BookOpen, ImagePlus, LogOut, Sparkles } from 'lucide-react'

export default function InstructorDashboard({ email = 'instructor@example.com', onLogout }) {
  return <main className="dashboard-page"><header className="dashboard-header"><a href="/" className="logo"><span className="logo-mark"><Sparkles size={17} /></span><span>NEXORA<span className="logo-dot">.</span></span></a><div className="dashboard-user"><span>{email}</span><button onClick={onLogout} aria-label="Log out"><LogOut size={17} /></button></div></header><section className="instructor-content"><span className="auth-kicker">INSTRUCTOR WORKSPACE</span><h1>Course Management</h1><p className="student-intro">Create, publish, and manage your learning content.</p><div className="admin-placeholder instructor-placeholder"><BookOpen size={30} /><h2>Your course library is ready.</h2><p>Use the course management tools to build your next class.</p><button className="button"><ImagePlus size={16} /> Create New Course</button></div></section></main>
}
