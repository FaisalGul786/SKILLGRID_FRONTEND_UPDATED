'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ImagePlus,
  Loader2,
  LogOut,
  Pencil,
  Play,
  Sparkles,
  Trophy,
  UploadCloud,
  X,
} from 'lucide-react'

import { api } from '../../lib/apiClient'
const initialCourses = [
  {
    id: 'course-1',
    title: 'Full-Stack Web Development',
    description: 'Build modern web applications from interface to deployment.',
    category: 'Development',
    difficulty: 'intermediate',
    price: 79,
    status: 'published',
    thumbnail:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'course-2',
    title: 'Practical Data Science',
    description: 'Turn raw data into decisions with practical analysis skills.',
    category: 'Data Science',
    difficulty: 'beginner',
    price: 59,
    status: 'draft',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'course-3',
    title: 'Product Design Systems',
    description: 'Create consistent, accessible systems that scale with teams.',
    category: 'Design',
    difficulty: 'advanced',
    price: 99,
    status: 'published',
    thumbnail:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80',
  },
]

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

const emptyForm = {
  title: '',
  description: '',
  category: '',
  price: '0.00',
  difficulty: 'beginner',
  status: 'draft',
  thumbnail: '',
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function DashboardPage() {
  const [email, setEmail] = useState('instructor@example.com')
  const [role, setRole] = useState('Instructor')
  const [courses, setCourses] = useState(initialCourses)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canCreate = useMemo(
    () =>
      form.title.trim() &&
      form.category.trim() &&
      form.thumbnail.startsWith('https://') &&
      !isUploadingImage &&
      !isSubmitting,
    [form, isUploadingImage, isSubmitting],
  )

  function logout() {
    sessionStorage.removeItem('nexora-auth')
    window.location.href = '/auth'
  }
  function openModal() {
    setError('')
    setSuccess('')
    setForm(emptyForm)
    setIsModalOpen(true)
  }
  function closeModal() {
    if (!isUploadingImage && !isSubmitting) setIsModalOpen(false)
  }
  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
    setError('')
  }

  async function uploadThumbnail(file) {
    // 1. Validation
    if (!file || !file.type.startsWith('image/')) {
      return setError('Please choose a valid image file.')
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError('Thumbnail must be smaller than 5MB.')
    }

    setError('')
    setIsUploadingImage(true)

    try {
      // 2. Fetch Signature
      const [sigErr, sigData] = await api.get('/media/upload/signature', {
        credentials: 'include',
      })

      console.log(`**** err & data from signature `, sigErr, sigData)
      if (sigErr) {
        return setError(sigErr.message || 'Failed to generate upload signature')
      }

      // 3. Prepare Payload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', sigData.signature)
      formData.append('timestamp', sigData.timestamp)
      formData.append('folder', sigData.folder)
      formData.append('api_key', sigData.apiKey)

      console.log(
        `******** multipart form data before uploading to cloudinary `,
        formData,
      )
      // 4. Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`
      const [uploadErr, uploadData] = await api.post(cloudinaryUrl, formData)

      console.log(`********* cloudinary `, uploadErr, uploadData)

      if (uploadErr) {
        return setError(uploadErr.message || 'Image upload failed')
      }

      // 5. Success
      setForm((current) => ({ ...current, thumbnail: uploadData.secure_url }))
    } catch (error) {
      // Catches unexpected JavaScript runtime crashes (e.g., undefined property access)
      console.error('Unexpected upload error:', error)
      setError('An unexpected error occurred during upload.')
    } finally {
      // Guaranteed to run on success, error, or early return
      setIsUploadingImage(false)
    }
  }
  // async function uploadThumbnail(file) {
  //   console.log('********** File uploaded *********', file)
  //   if (!file || !file.type.startsWith('image/')) {
  //     setError('Please choose a valid image file.')
  //     return
  //   }
  //   if (file.size > 5 * 1024 * 1024) {
  //     setError('Thumbnail must be smaller than 5MB.')
  //     return
  //   }
  //   setError('')
  //   setIsUploadingImage(true)

  //   /* getting Signature **/

  //   const [err, data] = await api.get('/media/upload/signature', {
  //     credentials: 'include',
  //   })
  //   console.log(`****** err & signature `, err, data)

  //   if (err.success === false) {
  //     setError(err.message || 'no signature generated 🙅🏿‍♂️')
  //     setIsUploadingImage(false)
  //     return
  //   }
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   formData.append('signature', response.signature)
  //   formData.append('timestamp', response.timestamp)
  //   formData.append('folder', response.folder)
  //   formData.append('api_key', response.apiKey)

  //   console.log(`****** send form data `, formData)

  //   const cloudinary = `https://api.cloudinary.com/v1_1/${err.cloudName}/image/upload`
  //   console.log(`cloudinary response `, cloudinary)
  //   setForm((current) => ({ ...current, thumbnail: cloudinary.secure_url }))

  //   setIsUploadingImage(false)
  //   return
  // }

  function handleFileChange(event) {
    console.log(
      '************* event.target.files?.[0] ',
      event.target.files?.[0],
    )

    uploadThumbnail(event.target.files?.[0])
  }
  function handleDrop(event) {
    event.preventDefault()
    console.log(
      `********* event.dataTransfer.files?.[0] `,
      event.dataTransfer.files?.[0],
    )
    uploadThumbnail(event.dataTransfer.files?.[0])
  }

  async function createCourse(event) {
    console.log('******* form before sending database ', form)
    event.preventDefault()
    if (
      !form.title.trim() ||
      !form.category.trim() ||
      (!form.thumbnail.startsWith('https://') &&
        !form.thumbnail.startsWith('blob:'))
    ) {
      setError(
        'Add a title, category, and upload a thumbnail before creating the course.',
      )
      return
    }
    setError('')
    setIsSubmitting(true)

    const [courseErr, courseData] = await api.post('/course/create', form, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    console.log(`***** course Error , course Data `, courseErr, courseData)

    if (courseErr) {
      setError(courseErr.message)
      setIsUploadingImage(false)
      return
    }

    setSuccess(courseData.message)

    setForm(emptyForm)
    setSuccess('')
    setIsSubmitting(false)
    setIsModalOpen(false)
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

      {role === 'Instructor' ? (
        <section className="instructor-content">
          <div className="instructor-heading">
            <div>
              <span className="auth-kicker">INSTRUCTOR WORKSPACE</span>
              <h1>Course Management</h1>
              <p>Create and manage your courses.</p>
            </div>
            <div className="role-switcher" aria-label="Dashboard role">
              <span>Viewing as</span>
              {['Instructor', 'Student', 'Admin'].map((item) => (
                <button
                  key={item}
                  className={role === item ? 'active' : ''}
                  onClick={() => setRole(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="management-toolbar">
            <div>
              <strong>{courses.length}</strong>
              <span>courses in your library</span>
            </div>
            <button className="button" onClick={openModal}>
              <ImagePlus size={17} /> Create New Course
            </button>
          </div>
          <div className="instructor-course-grid">
            {courses.map((course) => (
              <article className="instructor-course-card" key={course.id}>
                <div className="instructor-thumbnail">
                  <img
                    src={course.thumbnail}
                    alt={`${course.title} thumbnail`}
                  />
                  <span className={`status-badge ${course.status}`}>
                    {course.status}
                  </span>
                </div>
                <div className="instructor-course-body">
                  <div className="course-tags">
                    <span>{course.category}</span>
                    <span>{course.difficulty}</span>
                  </div>
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                  <div className="course-footer">
                    <strong>${Number(course.price).toFixed(2)}</strong>
                    <button aria-label={`Manage ${course.title}`}>
                      <Pencil size={15} /> Manage
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="dashboard-content">
          <div className="dashboard-welcome">
            <div>
              <span className="auth-kicker">YOUR LEARNING SPACE</span>
              <h1>Keep moving forward.</h1>
              <p>
                Two focused sessions today can change what you&apos;re capable
                of tomorrow.
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
                <small>Mon Tue Wed Thu Fri Sat Sun</small>
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
      )}

      {isModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={closeModal}
        >
          <section
            className="course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-course-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <span className="auth-kicker">NEW COURSE</span>
            <h2 id="create-course-title">Create a course</h2>
            <p className="modal-copy">
              Add the essentials and publish when your course is ready.
            </p>
            {error && (
              <div className="course-alert error" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="course-alert success" role="status">
                <CheckCircle2 size={17} />
                {success}
              </div>
            )}
            <form className="course-form" onSubmit={createCourse}>
              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  maxLength={255}
                  placeholder="e.g. Mastering React"
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows="3"
                  placeholder="What will students learn?"
                />
              </label>
              <div className="form-row">
                <label>
                  Category
                  <input
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    placeholder="Development"
                    required
                  />
                </label>
                <label>
                  Price
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={updateField}
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Difficulty
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={updateField}
                  >
                    <option>beginner</option>
                    <option>intermediate</option>
                    <option>advanced</option>
                  </select>
                </label>
                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateField}
                  >
                    <option>draft</option>
                    <option>published</option>
                    <option>archived</option>
                  </select>
                </label>
              </div>
              <div
                className={`thumbnail-dropzone ${form.thumbnail ? 'has-image' : ''}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
              >
                {form.thumbnail ? (
                  <>
                    <img
                      src={form.thumbnail}
                      alt="Selected course thumbnail preview"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({ ...current, thumbnail: '' }))
                      }
                    >
                      Change image
                    </button>
                  </>
                ) : isUploadingImage ? (
                  <>
                    <Loader2 className="spin" size={25} />
                    <strong>
                      Generating upload signature &amp; uploading...
                    </strong>
                  </>
                ) : (
                  <>
                    <UploadCloud size={28} />
                    <strong>
                      Drag &amp; drop thumbnail or click to browse
                    </strong>
                    <span>PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploadingImage || isSubmitting}
                    />
                  </>
                )}
              </div>
              <button
                className="button create-course-button"
                type="submit"
                disabled={!canCreate}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="spin" size={17} /> Creating Course...
                  </>
                ) : (
                  'Create Course'
                )}
              </button>
              {!form.thumbnail && (
                <small className="form-hint">
                  Upload a thumbnail to enable course creation.
                </small>
              )}
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
