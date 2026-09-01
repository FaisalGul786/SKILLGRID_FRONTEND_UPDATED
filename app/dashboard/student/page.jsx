import { headers } from 'next/headers'
import StudentDashboard from '../../../components/StudentDashboard'
import { api } from '../../../lib/apiClient'

import { getAuthHeaders } from '../../../lib/apiServer'

export default async function StudentDashboardPage({ searchParams }) {
  const params = await searchParams
  const page = Number(params?.page) || 1
  const limit = 4

  const headerList = await headers()
  const email = headerList.get('x-user-email') || ''

  // Fetch exactly 4 courses from your Express API
  const [courseErr, data] = await api.get(
    `/courses/list?page=${page}&limit=${limit}`,
    {
      headers: await getAuthHeaders(),
      cache: 'no-store',
    },
  )

  console.log(`error & data ******* dashboard/student/page `, courseErr, data)

  console.log(`****** courses data `, data?.courseDetails.coursesData)

  return (
    <StudentDashboard
      email={email}
      catalog={data?.courseDetails.coursesData || []}
      totalPages={data?.courseDetails.totalPages || 1}
      totalCount={data?.courseDetails.totalCoursesCount || 0}
      currentPage={page}
    />
  )
}
