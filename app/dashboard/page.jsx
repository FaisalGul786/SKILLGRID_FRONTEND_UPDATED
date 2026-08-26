'use client'

import { useEffect, useState } from 'react'
import AdminDashboard from '../../components/AdminDashboard'
import InstructorDashboard from '../../components/InstructorDashboard'
import StudentDashboard from '../../components/StudentDashboard'

export default function DashboardPage() {
  const [email, setEmail] = useState('student@example.com')
  const [role, setRole] = useState('Student')

  useEffect(() => {
    const session = sessionStorage.getItem('nexora-auth')
    if (!session) {
      window.location.href = '/auth'
      return
    }
    try {
      const parsed = JSON.parse(session)
      setEmail(parsed.email || 'student@example.com')
      setRole(
        parsed.role ||
          (parsed.email?.startsWith('admin')
            ? 'Admin'
            : parsed.email?.startsWith('instructor')
              ? 'Instructor'
              : 'Student'),
      )
    } catch {
      setRole('Student')
    }
  }, [])

  function logout() {
    sessionStorage.removeItem('nexora-auth')
    window.location.href = '/auth'
  }

  if (role === 'Instructor')
    return <InstructorDashboard email={email} onLogout={logout} />
  if (role === 'Admin')
    return <AdminDashboard email={email} onLogout={logout} />
  return <StudentDashboard email={email} onLogout={logout} />
}
