import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Headphones,
  PlayCircle,
  Sparkles,
  MessagesSquare,
  Compass,
  BookMarked,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Switch between light and dark while keeping the preference in ThemeProvider.
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <main className="min-h-screen bg-background text-primary">
      {/* Navigation: provides entry points for readers and publishers. */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background">
              <BookOpen size={22} />
            </span>
            <span className="text-2xl font-semibold tracking-tight">
              ascend
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#experience"
              className="text-sm text-secondary transition hover:text-primary"
            >
              Explore
            </a>
            <a
              href="#publishers"
              className="text-sm text-secondary transition hover:text-primary"
            >
              For publishers
            </a>
            <Link
              to="/login"
              className="text-sm font-medium transition hover:text-accent"
            >
              Sign in
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-secondary transition hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Link
              to="/signup"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
            >
              Get started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="rounded-lg p-2 md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Keep the mobile navigation usable on smaller screens. */}
        {isMenuOpen && (
          <div className="space-y-1 border-t border-border px-6 py-4 md:hidden">
            <a
              href="#experience"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm hover:bg-surface"
            >
              Explore
            </a>
            <a
              href="#publishers"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm hover:bg-surface"
            >
              For publishers
            </a>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm hover:bg-surface"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg bg-primary px-3 py-3 text-sm font-medium text-background"
            >
              Create an account
            </Link>
            <Link
              to="/publisher/signup"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-accent"
            >
              Become a publisher
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </button>
          </div>
        )}
      </header>

      {/* Hero: communicate what Ascend is and why it is different. */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold tracking-[0.16em] text-accent">
            <Sparkles size={15} />
            INTERACTIVE DIGITAL CONTENT PLATFORM
          </p>

          <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Discover more in every stories
          </h1>

          <p className="mt-6 text-lg font-medium text-primary">
            Read. Listen. Watch. Ask. Discuss.
          </p>

          <p className="mt-4 max-w-xl leading-7 text-secondary">
            Discover books and podcasts through text, audio, and video.
            Explore ideas with AI and connect with a community that loves
            learning.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-medium text-background transition hover:opacity-90"
            >
              Start exploring <ArrowRight size={18} />
            </Link>
            <Link
              to="/publisher/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3.5 font-medium transition hover:border-primary"
            >
              Become a publisher
            </Link>
          </div>

          <p className="mt-5 text-sm text-muted">
            New to Ascend? Choose how you want to experience content.
          </p>
        </div>

        {/* Editorial illustration made with CSS, so no image asset is required. */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rounded-[2rem] bg-accent/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-border bg-[#E9E2D5] p-5 dark:bg-slate-800 sm:p-8">
            <div className="rounded-2xl bg-[#FAF9F6] p-5 shadow-sm dark:bg-slate-900 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.15em] text-accent">
                  YOUR NEXT DISCOVERY
                </span>
                <Sparkles className="text-accent" size={20} />
              </div>

              <div className="mt-6 grid grid-cols-[0.8fr_1fr] gap-5">
                <div className="flex min-h-48 flex-col justify-between rounded-xl bg-[#D6BBA1] p-4 dark:bg-amber-950 sm:min-h-60">
                  <BookOpen
                    size={30}
                    className="text-[#493528] dark:text-amber-100"
                  />
                  <div>
                    <p className="font-serif text-2xl text-[#493528] dark:text-amber-100 sm:text-3xl">
                      Ideas
                    </p>
                    <p className="mt-1 text-sm text-[#493528] dark:text-amber-100">
                      Worth exploring
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                  <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-amber-100 p-2 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        <BookOpen size={19} />
                      </span>
                      <div>
                        <p className="text-sm font-medium">Read</p>
                        <p className="text-xs text-secondary">Explore the text</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-orange-100 p-2 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
                        <Headphones size={19} />
                      </span>
                      <div>
                        <p className="text-sm font-medium">Listen</p>
                        <p className="text-xs text-secondary">Take it with you</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-stone-100 p-2 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                        <PlayCircle size={19} />
                      </span>
                      <div>
                        <p className="text-sm font-medium">Watch</p>
                        <p className="text-xs text-secondary">See ideas come alive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#FEF3C7] p-4 dark:bg-amber-950">
                <Sparkles
                  className="shrink-0 text-amber-800 dark:text-amber-200"
                  size={22}
                />
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-amber-100">
                    Curious about an idea?
                  </p>
                  <p className="mt-1 text-xs text-stone-700 dark:text-amber-200">
                    Ask questions. Discover more.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-secondary">
              One platform. More ways to experience content.
            </p>
          </div>
        </div>
      </section>

      {/* Explain the three content formats that differentiate Ascend. */}
      <section id="experience" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-accent">
              YOUR CONTENT, YOUR WAY
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              One idea. More ways to experience it.
            </h2>
            <p className="mt-5 leading-7 text-secondary">
              Some moments call for reading. Others are better heard or
              watched. Ascend brings different ways to experience digital
              content together.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FormatCard
              icon={<BookOpen size={25} />}
              number="01"
              title="Read"
              description="Immerse yourself in the words, follow an idea, and explore at your own pace."
              examples="Text experiences"
            />
            <FormatCard
              icon={<Headphones size={25} />}
              number="02"
              title="Listen"
              description="Experience content through audio while you walk, travel, or take a break."
              examples="Audio experiences"
            />
            <FormatCard
              icon={<PlayCircle size={25} />}
              number="03"
              title="Watch"
              description="Engage with ideas through visual storytelling and video experiences."
              examples="Video experiences"
            />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Available formats may vary by book or podcast.
          </p>
        </div>
      </section>

      {/* AI and community are the interactive layer beyond the content formats. */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-24">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-accent">
            GO BEYOND THE PAGE
          </p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
            Don't just consume. Get curious.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-secondary">
            Content becomes more meaningful when you can ask questions,
            explore unfamiliar ideas, and hear how other people interpret
            them.
          </p>
        </div>

        <div className="space-y-4">
          <FeatureCard
            icon={<Sparkles size={23} />}
            title="Ask AI"
            description="Explore concepts, ask questions, and get help understanding the content you're engaging with."
          />
          <FeatureCard
            icon={<MessagesSquare size={23} />}
            title="Discuss"
            description="Share perspectives, join conversations, and discover ideas through other people's viewpoints."
          />
        </div>
      </section>

      {/* Make the two signup journeys obvious without creating separate login systems. */}
      <section id="publishers" className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-accent">
              A PLACE FOR EVERY KIND OF CURIOSITY
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Made for curious minds. Built for publishers.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
              <span className="inline-flex rounded-xl bg-amber-100 p-3 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
                <Compass size={27} />
              </span>
              <h3 className="mt-6 font-serif text-3xl">For readers</h3>
              <p className="mt-4 leading-7 text-secondary">
                Discover books and podcasts, choose your preferred format,
                explore ideas with AI, and take part in discussions.
              </p>
              <Link
                to="/signup"
                className="mt-7 inline-flex items-center gap-2 font-medium text-accent hover:underline"
              >
                Create an account <ArrowRight size={18} />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
              <span className="inline-flex rounded-xl bg-orange-100 p-3 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200">
                <BookMarked size={27} />
              </span>
              <h3 className="mt-6 font-serif text-3xl">For publishers</h3>
              <p className="mt-4 leading-7 text-secondary">
                Bring your content to Ascend, build your publishing presence,
                and manage your published work.
              </p>
              <Link
                to="/publisher/signup"
                className="mt-7 inline-flex items-center gap-2 font-medium text-accent hover:underline"
              >
                Become a publisher <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA gives visitors a clear next step before the footer. */}
      <section className="bg-primary px-6 py-20 text-center text-background sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-background/80">
            MAKE EVERY IDEA AN EXPERIENCE
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Discover a more engaging way to experience content.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-background/80">
            Start exploring new ideas, or bring your content to a community
            that wants to discover more.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-background px-6 py-3.5 font-medium text-primary transition hover:opacity-90"
            >
              Get started <ArrowRight size={18} />
            </Link>
            <Link
              to="/publisher/signup"
              className="inline-flex items-center justify-center rounded-lg border border-background/30 px-6 py-3.5 font-medium text-background transition hover:bg-background/10"
            >
              Publish with Ascend
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            ascend
          </Link>
          <p className="text-sm text-secondary">
            Making digital content more engaging through interaction, AI,
            and community.
          </p>
          <div className="flex gap-5 text-sm text-secondary">
            <Link to="/login" className="hover:text-primary">
              Sign in
            </Link>
            <Link to="/signup" className="hover:text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

interface FormatCardProps {
  icon: React.ReactNode
  number: string
  title: string
  description: string
  examples: string
}

function FormatCard({
  icon,
  number,
  title,
  description,
  examples,
}: FormatCardProps) {
  return (
    <article className="group rounded-2xl border border-border bg-background p-6 transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg sm:p-8">
      <div className="flex items-center justify-between">
        <span className="inline-flex rounded-xl bg-accent/10 p-3 text-accent">
          {icon}
        </span>
        <span className="text-sm font-medium text-muted">{number}</span>
      </div>
      <h3 className="mt-6 font-serif text-3xl">{title}</h3>
      <p className="mt-3 min-h-20 leading-7 text-secondary">{description}</p>
      <p className="mt-5 border-t border-border pt-4 text-sm font-medium text-accent">
        {examples}
      </p>
    </article>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="inline-flex shrink-0 rounded-xl bg-accent/10 p-3 text-accent">
          {icon}
        </span>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 leading-7 text-secondary">{description}</p>
        </div>
      </div>
    </article>
  )
}

export default HomePage


// import { Link } from 'react-router-dom'
// import {
//   ArrowRight,
//   BookOpen,
//   Headphones,
//   PlayCircle,
//   Sparkles,
//   MessagesSquare,
//   Compass,
//   BookMarked,
//   Menu,
//   X,
// } from 'lucide-react'
// import { useState } from 'react'

// function HomePage() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   return (
//     <main className="min-h-screen bg-background text-primary">
//       {/* Navigation: provides entry points for readers and publishers. */}
//       <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
//         <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
//           <Link to="/" className="flex items-center gap-2">
//             <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background">
//               <BookOpen size={22} />
//             </span>
//             <span className="text-2xl font-semibold tracking-tight">
//               ascend
//             </span>
//           </Link>

//           <div className="hidden items-center gap-8 md:flex">
//             <a
//               href="#experience"
//               className="text-sm text-secondary transition hover:text-primary"
//             >
//               Explore
//             </a>
//             <a
//               href="#publishers"
//               className="text-sm text-secondary transition hover:text-primary"
//             >
//               For publishers
//             </a>
//             <Link
//               to="/login"
//               className="text-sm font-medium transition hover:text-accent"
//             >
//               Sign in
//             </Link>
//             <Link
//               to="/signup"
//               className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
//             >
//               Get started
//             </Link>
//           </div>

//           <button
//             type="button"
//             onClick={() => setIsMenuOpen((previous) => !previous)}
//             className="rounded-lg p-2 md:hidden"
//             aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
//             aria-expanded={isMenuOpen}
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </nav>

//         {/* Keep the mobile navigation usable on smaller screens. */}
//         {isMenuOpen && (
//           <div className="space-y-1 border-t border-border px-6 py-4 md:hidden">
//             <a
//               href="#experience"
//               onClick={() => setIsMenuOpen(false)}
//               className="block rounded-lg px-3 py-3 text-sm hover:bg-surface"
//             >
//               Explore
//             </a>
//             <a
//               href="#publishers"
//               onClick={() => setIsMenuOpen(false)}
//               className="block rounded-lg px-3 py-3 text-sm hover:bg-surface"
//             >
//               For publishers
//             </a>
//             <Link
//               to="/login"
//               onClick={() => setIsMenuOpen(false)}
//               className="block rounded-lg px-3 py-3 text-sm hover:bg-surface"
//             >
//               Sign in
//             </Link>
//             <Link
//               to="/signup"
//               onClick={() => setIsMenuOpen(false)}
//               className="block rounded-lg bg-primary px-3 py-3 text-sm font-medium text-background"
//             >
//               Create an account
//             </Link>
//             <Link
//               to="/publisher/signup"
//               onClick={() => setIsMenuOpen(false)}
//               className="block rounded-lg px-3 py-3 text-sm font-medium text-accent"
//             >
//               Become a publisher
//             </Link>
//           </div>
//         )}
//       </header>

//       {/* Hero: communicate what Ascend is and why it is different. */}
//       <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
//         <div>
//           <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold tracking-[0.16em] text-accent">
//             <Sparkles size={15} />
//             INTERACTIVE DIGITAL CONTENT PLATFORM
//           </p>

//           <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
//             Discover more in every stories
//           </h1>

//           <p className="mt-6 text-lg font-medium text-primary">
//             Read. Listen. Watch. Ask. Discuss.
//           </p>

//           <p className="mt-4 max-w-xl leading-7 text-secondary">
//             Discover books and podcasts through text, audio, and video.
//             Explore ideas with AI and connect with a community that loves
//             learning.
//           </p>

//           <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//             <Link
//               to="/signup"
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-medium text-background transition hover:opacity-90"
//             >
//               Start exploring <ArrowRight size={18} />
//             </Link>
//             <Link
//               to="/publisher/signup"
//               className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3.5 font-medium transition hover:border-primary"
//             >
//               Become a publisher
//             </Link>
//           </div>

//           <p className="mt-5 text-sm text-muted">
//             New to Ascend? Choose how you want to experience content.
//           </p>
//         </div>

//         {/* Editorial illustration made with CSS, so no image asset is required. */}
//         <div className="relative mx-auto w-full max-w-xl">
//           <div className="absolute -inset-4 rounded-[2rem] bg-accent/10 blur-2xl" />

//           <div className="relative overflow-hidden rounded-3xl border border-border bg-[#E9E2D5] p-5 dark:bg-slate-800 sm:p-8">
//             <div className="rounded-2xl bg-[#FAF9F6] p-5 shadow-sm dark:bg-slate-900 sm:p-7">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-semibold tracking-[0.15em] text-accent">
//                   YOUR NEXT DISCOVERY
//                 </span>
//                 <Sparkles className="text-accent" size={20} />
//               </div>

//               <div className="mt-6 grid grid-cols-[0.8fr_1fr] gap-5">
//                 <div className="flex min-h-48 flex-col justify-between rounded-xl bg-[#D6BBA1] p-4 dark:bg-amber-950 sm:min-h-60">
//                   <BookOpen
//                     size={30}
//                     className="text-[#493528] dark:text-amber-100"
//                   />
//                   <div>
//                     <p className="font-serif text-2xl text-[#493528] dark:text-amber-100 sm:text-3xl">
//                       Ideas
//                     </p>
//                     <p className="mt-1 text-sm text-[#493528] dark:text-amber-100">
//                       Worth exploring
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center gap-3">
//                   <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
//                     <div className="flex items-center gap-3">
//                       <span className="rounded-lg bg-amber-100 p-2 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
//                         <BookOpen size={19} />
//                       </span>
//                       <div>
//                         <p className="text-sm font-medium">Read</p>
//                         <p className="text-xs text-secondary">Explore the text</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
//                     <div className="flex items-center gap-3">
//                       <span className="rounded-lg bg-orange-100 p-2 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
//                         <Headphones size={19} />
//                       </span>
//                       <div>
//                         <p className="text-sm font-medium">Listen</p>
//                         <p className="text-xs text-secondary">Take it with you</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="rounded-xl border border-border bg-background p-3 sm:p-4">
//                     <div className="flex items-center gap-3">
//                       <span className="rounded-lg bg-stone-100 p-2 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
//                         <PlayCircle size={19} />
//                       </span>
//                       <div>
//                         <p className="text-sm font-medium">Watch</p>
//                         <p className="text-xs text-secondary">See ideas come alive</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#FEF3C7] p-4 dark:bg-amber-950">
//                 <Sparkles
//                   className="shrink-0 text-amber-800 dark:text-amber-200"
//                   size={22}
//                 />
//                 <div>
//                   <p className="text-sm font-semibold text-stone-900 dark:text-amber-100">
//                     Curious about an idea?
//                   </p>
//                   <p className="mt-1 text-xs text-stone-700 dark:text-amber-200">
//                     Ask questions. Discover more.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <p className="mt-4 text-center text-sm text-secondary">
//               One platform. More ways to experience content.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Explain the three content formats that differentiate Ascend. */}
//       <section id="experience" className="border-y border-border bg-surface">
//         <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
//           <div className="mx-auto max-w-2xl text-center">
//             <p className="text-xs font-semibold tracking-[0.16em] text-accent">
//               YOUR CONTENT, YOUR WAY
//             </p>
//             <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
//               One idea. More ways to experience it.
//             </h2>
//             <p className="mt-5 leading-7 text-secondary">
//               Some moments call for reading. Others are better heard or
//               watched. Ascend brings different ways to experience digital
//               content together.
//             </p>
//           </div>

//           <div className="mt-12 grid gap-5 md:grid-cols-3">
//             <FormatCard
//               icon={<BookOpen size={25} />}
//               number="01"
//               title="Read"
//               description="Immerse yourself in the words, follow an idea, and explore at your own pace."
//               examples="Text experiences"
//             />
//             <FormatCard
//               icon={<Headphones size={25} />}
//               number="02"
//               title="Listen"
//               description="Experience content through audio while you walk, travel, or take a break."
//               examples="Audio experiences"
//             />
//             <FormatCard
//               icon={<PlayCircle size={25} />}
//               number="03"
//               title="Watch"
//               description="Engage with ideas through visual storytelling and video experiences."
//               examples="Video experiences"
//             />
//           </div>

//           <p className="mt-6 text-center text-xs text-muted">
//             Available formats may vary by book or podcast.
//           </p>
//         </div>
//       </section>

//       {/* AI and community are the interactive layer beyond the content formats. */}
//       <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-24">
//         <div>
//           <p className="text-xs font-semibold tracking-[0.16em] text-accent">
//             GO BEYOND THE PAGE
//           </p>
//           <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
//             Don't just consume. Get curious.
//           </h2>
//           <p className="mt-5 max-w-xl leading-7 text-secondary">
//             Content becomes more meaningful when you can ask questions,
//             explore unfamiliar ideas, and hear how other people interpret
//             them.
//           </p>
//         </div>

//         <div className="space-y-4">
//           <FeatureCard
//             icon={<Sparkles size={23} />}
//             title="Ask AI"
//             description="Explore concepts, ask questions, and get help understanding the content you're engaging with."
//           />
//           <FeatureCard
//             icon={<MessagesSquare size={23} />}
//             title="Discuss"
//             description="Share perspectives, join conversations, and discover ideas through other people's viewpoints."
//           />
//         </div>
//       </section>

//       {/* Make the two signup journeys obvious without creating separate login systems. */}
//       <section id="publishers" className="bg-surface">
//         <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
//           <div className="mx-auto max-w-2xl text-center">
//             <p className="text-xs font-semibold tracking-[0.16em] text-accent">
//               A PLACE FOR EVERY KIND OF CURIOSITY
//             </p>
//             <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
//               Made for curious minds. Built for publishers.
//             </h2>
//           </div>

//           <div className="mt-12 grid gap-5 md:grid-cols-2">
//             <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
//               <span className="inline-flex rounded-xl bg-amber-100 p-3 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
//                 <Compass size={27} />
//               </span>
//               <h3 className="mt-6 font-serif text-3xl">For readers</h3>
//               <p className="mt-4 leading-7 text-secondary">
//                 Discover books and podcasts, choose your preferred format,
//                 explore ideas with AI, and take part in discussions.
//               </p>
//               <Link
//                 to="/signup"
//                 className="mt-7 inline-flex items-center gap-2 font-medium text-accent hover:underline"
//               >
//                 Create an account <ArrowRight size={18} />
//               </Link>
//             </div>

//             <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
//               <span className="inline-flex rounded-xl bg-orange-100 p-3 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200">
//                 <BookMarked size={27} />
//               </span>
//               <h3 className="mt-6 font-serif text-3xl">For publishers</h3>
//               <p className="mt-4 leading-7 text-secondary">
//                 Bring your content to Ascend, build your publishing presence,
//                 and manage your published work.
//               </p>
//               <Link
//                 to="/publisher/signup"
//                 className="mt-7 inline-flex items-center gap-2 font-medium text-accent hover:underline"
//               >
//                 Become a publisher <ArrowRight size={18} />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA gives visitors a clear next step before the footer. */}
//       <section className="bg-primary px-6 py-20 text-center text-background sm:py-24">
//         <div className="mx-auto max-w-3xl">
//           <p className="text-xs font-semibold tracking-[0.16em] text-background/80">
//             MAKE EVERY IDEA AN EXPERIENCE
//           </p>
//           <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
//             Discover a more engaging way to experience content.
//           </h2>
//           <p className="mx-auto mt-5 max-w-xl leading-7 text-background/80">
//             Start exploring new ideas, or bring your content to a community
//             that wants to discover more.
//           </p>

//           <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
//             <Link
//               to="/signup"
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-background px-6 py-3.5 font-medium text-primary transition hover:opacity-90"
//             >
//               Get started <ArrowRight size={18} />
//             </Link>
//             <Link
//               to="/publisher/signup"
//               className="inline-flex items-center justify-center rounded-lg border border-background/30 px-6 py-3.5 font-medium text-background transition hover:bg-background/10"
//             >
//               Publish with Ascend
//             </Link>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-background">
//         <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
//           <Link to="/" className="text-xl font-semibold tracking-tight">
//             ascend
//           </Link>
//           <p className="text-sm text-secondary">
//             Making digital content more engaging through interaction, AI,
//             and community.
//           </p>
//           <div className="flex gap-5 text-sm text-secondary">
//             <Link to="/login" className="hover:text-primary">
//               Sign in
//             </Link>
//             <Link to="/signup" className="hover:text-primary">
//               Sign up
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </main>
//   )
// }

// interface FormatCardProps {
//   icon: React.ReactNode
//   number: string
//   title: string
//   description: string
//   examples: string
// }

// function FormatCard({
//   icon,
//   number,
//   title,
//   description,
//   examples,
// }: FormatCardProps) {
//   return (
//     <article className="group rounded-2xl border border-border bg-background p-6 transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg sm:p-8">
//       <div className="flex items-center justify-between">
//         <span className="inline-flex rounded-xl bg-accent/10 p-3 text-accent">
//           {icon}
//         </span>
//         <span className="text-sm font-medium text-muted">{number}</span>
//       </div>
//       <h3 className="mt-6 font-serif text-3xl">{title}</h3>
//       <p className="mt-3 min-h-20 leading-7 text-secondary">{description}</p>
//       <p className="mt-5 border-t border-border pt-4 text-sm font-medium text-accent">
//         {examples}
//       </p>
//     </article>
//   )
// }

// interface FeatureCardProps {
//   icon: React.ReactNode
//   title: string
//   description: string
// }

// function FeatureCard({ icon, title, description }: FeatureCardProps) {
//   return (
//     <article className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
//       <div className="flex items-start gap-4">
//         <span className="inline-flex shrink-0 rounded-xl bg-accent/10 p-3 text-accent">
//           {icon}
//         </span>
//         <div>
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <p className="mt-2 leading-7 text-secondary">{description}</p>
//         </div>
//       </div>
//     </article>
//   )
// }

// export default HomePage
