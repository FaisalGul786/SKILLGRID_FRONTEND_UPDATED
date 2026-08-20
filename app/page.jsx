import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Code2,
  Compass,
  Database,
  Globe2,
  Layers3,
  Palette,
  Play,
  Star,
  Users,
  Zap,
} from 'lucide-react'

const categories = [
  { name: 'Web Development', count: '128 courses', icon: Code2 },
  { name: 'Data Science', count: '96 courses', icon: BarChart3 },
  { name: 'Design & Creative', count: '84 courses', icon: Palette },
  { name: 'Business & Finance', count: '72 courses', icon: Database },
  { name: 'Marketing', count: '58 courses', icon: Globe2 },
  { name: 'Productivity', count: '41 courses', icon: Zap },
]

const courses = [
  { category: 'DEVELOPMENT', title: 'Full-Stack Web Development', instructor: 'Maya Chen', rating: '4.9', students: '18.4k', price: '$89', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85' },
  { category: 'DATA SCIENCE', title: 'The Practical Data Science Bootcamp', instructor: 'Dr. James Wilson', rating: '4.8', students: '12.1k', price: '$74', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85' },
  { category: 'DESIGN', title: 'Design Systems in Figma', instructor: 'Ava Rodriguez', rating: '5.0', students: '9.8k', price: '$59', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85' },
]

const benefits = [
  { icon: Compass, title: 'Learn at your pace', text: 'Build momentum with flexible lessons, practical milestones, and a path that fits your life.' },
  { icon: Layers3, title: 'Certificates that matter', text: 'Showcase verified skills with certificates designed to help you stand out in the real world.' },
  { icon: Play, title: 'Learn by doing', text: 'Turn theory into confidence through guided projects, challenges, and meaningful feedback.' },
]

function Button({ children, secondary = false }) {
  return <button className={secondary ? 'button button-secondary' : 'button'}>{children}</button>
}

function Logo() {
  return <a href="#top" className="logo" aria-label="Nexora home"><span className="logo-mark"><BookOpen size={18} strokeWidth={2.5} /></span><span>NEXORA<span className="logo-dot">.</span></span></a>
}

export default function Page() {
  return (
    <main id="top" className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="nav-shell" aria-label="Main navigation">
        <div className="container nav-inner"><Logo /><div className="nav-links"><a href="#courses">Courses</a><a href="#features">Features</a><a href="#pricing">Pricing</a></div><div className="nav-actions"><button className="login-button">Log in</button><Button>Get started <ArrowRight size={16} /></Button></div></div>
      </nav>

      <section className="hero section"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> Learning for what&apos;s next</div><h1>Build skills.<br /><span>Shape your future.</span></h1><p className="hero-text">Nexora is the modern learning platform for curious minds. Learn from experts, build real projects, and move forward with confidence.</p><div className="hero-actions"><Button>Browse courses <ArrowRight size={17} /></Button><Button secondary><Play size={16} fill="currentColor" /> Try for free</Button></div><div className="stats"><div><strong>10,000<span>+</span></strong><small>Active learners</small></div><div className="stat-divider" /><div><strong>4.9<span>/5</span></strong><small>Learner rating</small></div><div className="stat-divider" /><div><strong>240<span>+</span></strong><small>Expert courses</small></div></div></div><div className="hero-visual"><div className="visual-card"><div className="visual-top"><span className="live-label"><span /> Live learning</span><span className="visual-menu">•••</span></div><div className="visual-illustration"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="visual-spark spark-one">✦</div><div className="visual-spark spark-two">✦</div><div className="play-badge"><Play size={20} fill="currentColor" /></div><div className="visual-caption"><span>01</span><div><strong>Make ideas real</strong><small>Project-based learning</small></div></div></div></div><div className="floating-note note-one"><span className="note-icon"><Check size={15} /></span><div><strong>Course complete</strong><small>Keep the momentum going</small></div></div><div className="floating-note note-two"><Users size={17} /><strong>2.4k learning now</strong></div></div></div></section>

      <section className="section categories" id="courses"><div className="container"><div className="section-heading"><div><span className="kicker">EXPLORE YOUR INTERESTS</span><h2>There&apos;s always more to learn.</h2></div><a className="text-link" href="#featured">View all categories <ArrowRight size={16} /></a></div><div className="category-grid">{categories.map(({ name, count, icon: Icon }) => <a className="category-card" href="#featured" key={name}><span className="category-icon"><Icon size={21} /></span><span><strong>{name}</strong><small>{count}</small></span><ArrowRight className="category-arrow" size={17} /></a>)}</div></div></section>

      <section className="section featured" id="featured"><div className="container"><div className="section-heading"><div><span className="kicker">CURATED FOR YOU</span><h2>Learn from the best.</h2></div><a className="text-link" href="#pricing">Explore all courses <ArrowRight size={16} /></a></div><div className="course-grid">{courses.map((course) => <article className="course-card" key={course.title}><div className="course-image"><img src={course.image} alt="" /><span>{course.category}</span><button aria-label={`Preview ${course.title}`}><Play size={15} fill="currentColor" /></button></div><div className="course-content"><h3>{course.title}</h3><p className="instructor">with {course.instructor}</p><div className="course-meta"><span><Star size={14} fill="currentColor" /> {course.rating}</span><span>{course.students} students</span><strong>{course.price}</strong></div></div></article>)}</div></div></section>

      <section className="section benefits" id="features"><div className="container"><div className="benefits-intro"><span className="kicker">WHY NEXORA</span><h2>Learning that<br /><em>moves you forward.</em></h2><p>Less passive watching. More doing, creating, and becoming the person you want to be.</p></div><div className="benefit-grid">{benefits.map(({ icon: Icon, title, text }) => <article className="benefit" key={title}><span className="benefit-icon"><Icon size={22} /></span><h3>{title}</h3><p>{text}</p><a href="#pricing">Learn more <ArrowRight size={15} /></a></article>)}</div></div></section>

      <section className="section cta" id="pricing"><div className="container"><div className="cta-panel"><div><span className="kicker">YOUR NEXT CHAPTER STARTS HERE</span><h2>Ready to learn<br /><span>something new?</span></h2><p>Join a community of people building what&apos;s next.</p></div><div className="cta-action"><Button>Start learning for free <ArrowRight size={17} /></Button><small>No credit card required</small></div></div></div></section>

      <footer className="footer"><div className="container footer-top"><Logo /><div className="footer-links"><a href="#courses">Courses</a><a href="#features">About</a><a href="#pricing">Pricing</a><a href="#features">Help center</a></div><div className="socials"><a href="#footer" aria-label="LinkedIn"><Globe2 size={17} /></a><a href="#footer" aria-label="Instagram"><Palette size={17} /></a><a href="#footer" aria-label="Facebook"><Layers3 size={17} /></a></div></div><div className="container footer-bottom"><span>© 2024 Nexora Learning, Inc.</span><span>Made for the endlessly curious.</span></div></footer>
    </main>
  )
}
