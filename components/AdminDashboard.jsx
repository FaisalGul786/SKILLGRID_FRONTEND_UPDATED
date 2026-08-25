'use client'

import { BarChart3, LogOut, ShieldCheck, Sparkles, Users } from 'lucide-react'

export default function AdminDashboard({ email = 'admin@example.com', onLogout }) {
  return <main className="dashboard-page"><header className="dashboard-header"><a href="/" className="logo"><span className="logo-mark"><Sparkles size={17} /></span><span>NEXORA<span className="logo-dot">.</span></span></a><div className="dashboard-user"><span>{email}</span><button onClick={onLogout} aria-label="Log out"><LogOut size={17} /></button></div></header><section className="instructor-content"><span className="auth-kicker">ADMIN WORKSPACE</span><h1>Admin Control Panel</h1><p className="student-intro">Monitor the platform and manage the learning experience.</p><div className="admin-stat-grid"><article className="admin-stat-card"><Users size={20} /><span>Total Users</span><strong>1,248</strong></article><article className="admin-stat-card"><ShieldCheck size={20} /><span>Total Courses</span><strong>86</strong></article><article className="admin-stat-card"><BarChart3 size={20} /><span>System Revenue</span><strong>$24,680</strong></article></div><div className="admin-placeholder"><ShieldCheck size={30} /><h2>Admin analytics and user management coming soon.</h2><p>Platform controls, reports, and moderation tools will appear here.</p></div></section></main>
}
