import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from '../../components/AdminDashboard'
import InstructorDashboard from '../../components/InstructorDashboard'
import StudentDashboard from '../../components/StudentDashboard'

export default async function DashboardPage() {
  const headerList = await headers()
  const role = headerList.get('x-user-role') || 'student'
  const email = headerList.get('x-user-email') || ''

  if (role === 'admin') return <AdminDashboard email={email} />
  if (role === 'instructor') return <InstructorDashboard email={email} />
  // return <StudentDashboard email={email} />
  redirect('/dashboard/student') // redirect to server component to get data and then to StudentDashboard
}
