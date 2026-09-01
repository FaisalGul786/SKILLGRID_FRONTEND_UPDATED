'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  LogOut,
  Play,
  Sparkles,
} from 'lucide-react'

import { api } from '../lib/apiClient'

function Header({ email, onLogout }) {
  return (
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
        <button onClick={onLogout} aria-label="Log out">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}

export default function StudentDashboard({
  email,
  onLogout,
  catalog,
  totalPages,
  totalCount,
  currentPage,
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState(null)

  async function fetchCourseLessons(courseItem) {
    const courseId = courseItem.id
    console.log(`working ....`)
    const [err, lessonData] = await api.get(`/courses/${courseId}/lessons`, {
      credentials: 'include',
      cache: 'no-store',
    })

    console.log(`err & data `, err, lessonData.lessons)
    if (err) {
      alert('Failed to load lessons')
      return
    }
    // Combine catalog item + fetched lessons into one state object

    setCourse({
      ...courseItem,
      lessons: lessonData?.lessons.lessons || [],
      isEnrolled: lessonData?.lessons.isEnrolled || false,
    })
  }

  const handlePageChange = (newPage) => {
    // Construct the new URL and push it to the router
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (course)
    return (
      <CourseDetails
        course={course}
        onBack={() => setCourse(null)}
        fetchFreshLessons={() => fetchCourseLessons(course)}
      />
    )

  return (
    <main className="dashboard-page">
      <Header email={email} onLogout={onLogout} />
      <section className="instructor-content">
        <span className="auth-kicker">STUDENT WORKSPACE</span>
        <h1>My Learning &amp; Catalog</h1>
        <p className="student-intro">
          Discover practical courses and keep your learning moving forward.
        </p>
        <div className="management-toolbar">
          <div>
            <strong>{totalCount}</strong>
            <span>published courses</span>
          </div>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="instructor-course-grid">
          {/* Map directly over catalog since the backend already sliced it to 4 items */}
          {catalog.map((item) => (
            <article
              className="instructor-course-card"
              key={item.id || item._id}
            >
              <div className="instructor-thumbnail">
                <img src={item.thumbnail} alt={`${item.title} thumbnail`} />
                <span className="status-badge">
                  {item.price
                    ? `$${parseFloat(item.price).toFixed(2)}`
                    : 'Free'}
                </span>
              </div>
              <div className="instructor-course-body">
                <div className="course-tags">
                  <span>{item.category}</span>
                  <span>{item.difficulty}</span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="course-footer">
                  {/*<span>{item.lessons?.length || 0} lessons</span>*/}
                  <button
                    className="button"
                    onClick={() => {
                      fetchCourseLessons(item)
                    }}
                  >
                    View Course <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pagination">
          <button
            className="button button-secondary"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={15} /> Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="button button-secondary"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </section>
    </main>
  )
}

function CourseDetails({ course, onBack, fetchFreshLessons }) {
  const [enrolled, setEnrolled] = useState(course.isEnrolled || false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [active, setActive] = useState(0)
  const lessons = course.lessons || []
  const activeLesson = lessons[active]

  const enroll = async () => {
    console.log(`***** course data `, course.lessons)
    setLoading(true)
    const [err, enrollment] = await api.post(
      `/courses/${course.lessons[0].courseId}/enrollments`,
      {
        credentials: 'include',
      },
    )

    console.log(`****** err , enrollment `, {
      err,
      enrollment,
    })

    if (err) {
      alert('Failed to create enrollment')
      setLoading(false)
      return
    }

    await fetchFreshLessons()

    setEnrolled(true)
    setLoading(false)
    setMessage('You are enrolled. All course materials are now unlocked.')
  }
  const selectLesson = (index) => {
    if (!enrolled) {
      setMessage('Access Denied: You must be enrolled to view this lesson.')
      return
    }
    setActive(index)
    setMessage('')
  }

  return (
    <main className="dashboard-page">
      <Header email="Student workspace" onLogout={() => {}} />
      <section className="instructor-content">
        <button className="text-link back-link" onClick={onBack}>
          <ArrowLeft size={15} /> Back to courses
        </button>
        <div className="detail-hero">
          <img src={course.thumbnail} alt={`${course.title} thumbnail`} />
          <div>
            <span className="auth-kicker">
              {course.category} · {course.difficulty}
            </span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <button
              className="button enrollment-button"
              disabled={loading || enrolled || course.price > 0}
              onClick={enroll}
            >
              {loading
                ? 'Enrolling...'
                : enrolled
                  ? 'Enrolled'
                  : course.price > 0
                    ? 'Paid Enrollment Coming Soon'
                    : 'Enroll Now for Free'}
            </button>
          </div>
        </div>
        {message && (
          <div
            className={`course-alert ${enrolled ? 'success' : 'error'}`}
            role="status"
          >
            {enrolled ? <CheckCircle2 size={17} /> : <Lock size={17} />}
            {message}
          </div>
        )}
        <div className="lesson-layout">
          <aside className="lesson-sidebar">
            <span className="auth-kicker">SYLLABUS</span>
            <h2>{course.lessons?.length} lessons</h2>
            {course.lessons.map((item, index) => (
              <button
                className={`lesson-item ${enrolled && active === index ? 'active' : ''}`}
                key={item.title}
                onClick={() => selectLesson(index)}
              >
                {enrolled ? <Play size={14} /> : <Lock size={14} />}
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.duration}</small>
                </span>
              </button>
            ))}
          </aside>
          <div className="lesson-main">
            {enrolled ? (
              <>
                <div className="video-frame">
                  <video
                    controls
                    poster={course.thumbnail}
                    src={activeLesson?.mainUrl}
                  >
                    <track kind="captions" />
                  </video>
                </div>
                <div className="notes-panel">
                  <div>
                    <BookOpen size={18} />
                    <strong>{activeLesson?.title}</strong>
                  </div>
                  <p>{activeLesson?.notes}</p>
                  <a
                    className="text-link"
                    href="#notes"
                    onClick={(event) => event.preventDefault()}
                  >
                    <Download size={15} /> Download Notes.pdf
                  </a>
                </div>
              </>
            ) : (
              <div className="locked-player">
                <Lock size={28} />
                <strong>Enrolled Students Only</strong>
                <p>Please enroll to access video content.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
