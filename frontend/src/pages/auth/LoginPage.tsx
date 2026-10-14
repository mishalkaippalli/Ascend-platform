import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

import useAuth from '../../hooks/useAuth'
import { loginSchema } from '../../schemas/authSchema'
import { login } from '../../services/auth/authService'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    form?: string
  }>({})

  const [isLoading, setIsLoading] = useState(false)
  const { setCredentials } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      const fieldErrors: {
        email?: string
        password?: string
      } = {}

      for (const issue of result.error.issues) {
        const field = issue.path[0]

        if (field === 'email' || field === 'password') {
          fieldErrors[field] = issue.message
        }
      }

      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      const response = await login(result.data)
      setCredentials(response.user, response.accessToken)

      // Send each authenticated user to the area allowed for their role.
      if (response.user.role === 'user') {
        navigate('/explore')
      } else if (response.user.role === 'publisher') {
        navigate('/publisher/dashboard')
      } else if (response.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setErrors({ form: 'Invalid email or password' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-wide text-accent">
            ASCEND
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-tight text-primary">
            Welcome back
          </h1>

          <p className="mt-3 text-base text-secondary">
            Continue your journey with Ascend.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-error">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-accent hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {errors.form && (
            <p
              role="alert"
              className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="mt-8 space-y-3 text-center text-sm">
            <p className="text-secondary">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-accent hover:underline"
              >
                Create an account
              </Link>
            </p>

            <p className="text-secondary">
              Want to publish your content?{' '}
              <Link
                to="/publisher/signup"
                className="font-medium text-accent hover:underline"
              >
                Become a publisher
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}

export default LoginPage



// import { useState } from 'react'
// import type { FormEvent } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import useAuth from '../../hooks/useAuth'
// import { loginSchema } from '../../schemas/authSchema'
// import { login } from '../../services/auth/authService'
// import { Eye, EyeOff } from 'lucide-react'

// function LoginPage() {
//   const navigate = useNavigate()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const [showPassword, setShowPassword] = useState(false)

//   const [errors, setErrors] = useState<{
//     email?: string
//     password?: string
//     form?: string
//   }>({})

//   const [isLoading, setIsLoading] = useState(false)

//   const { setCredentials } = useAuth()

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     setErrors({})

//     const result = loginSchema.safeParse({
//       email,
//       password,
//     })

//     if (!result.success) {
//       const fieldErrors: {
//         email?: string
//         password?: string
//       } = {}

//       for (const issue of result.error.issues) {
//         const field = issue.path[0]

//         if (field === 'email' || field === 'password') {
//           fieldErrors[field] = issue.message
//         }
//       }

//       setErrors(fieldErrors)
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await login(result.data)

//       setCredentials(response.user, response.accessToken)

//       // Send each authenticated user to the area allowed for their role.
//       if (response.user.role === 'user') {
//         navigate('/explore')
//       } else if (response.user.role === 'publisher') {
//         navigate('/publisher/dashboard')
//       } else if (response.user.role === 'admin') {
//         navigate('/admin/dashboard')
//       } else {
//         navigate('/')
//       }
//     } catch (error) {
//       console.error('Login failed:', error)

//       setErrors({
//         form: 'Invalid email or password',
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-screen bg-background px-6 py-8">
//       <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
//         <div className="mb-10">
//           <p className="text-sm font-semibold tracking-wide text-accent">
//             ASCEND
//           </p>

//           <h1 className="mt-6 font-serif text-5xl leading-tight text-primary">
//             Welcome back
//           </h1>

//           <p className="mt-3 text-base text-secondary">
//             Continue your journey with Ascend.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="email"
//               className="mb-2 block text-sm font-medium text-primary"
//             >
//               Email
//             </label>

//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               placeholder="you@example.com"
//               className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent"
//             />

//             {errors.email && (
//               <p className="mt-2 text-sm text-error">
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="mb-2 block text-sm font-medium text-primary"
//             >
//               Password
//             </label>

//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword((current) => !current)}
//                 className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
//                 aria-label={
//                   showPassword ? 'Hide password' : 'Show password'
//                 }
//               >
//                 {showPassword ? (
//                   <EyeOff size={19} />
//                 ) : (
//                   <Eye size={19} />
//                 )}
//               </button>
//             </div>

//             {errors.password && (
//               <p className="mt-2 text-sm text-error">
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           <div className="flex justify-end">
//             <Link
//               to="/forgot-password"
//               className="text-sm font-medium text-accent hover:underline"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           {errors.form && (
//             <p className="text-sm text-error">
//               {errors.form}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isLoading ? 'Signing in...' : 'Sign in'}
//           </button>

//           <div className="mt-8 space-y-3 text-center text-sm">
//             <p className="text-secondary">
//               Don't have an account?{' '}
//               <Link
//                 to="/signup"
//                 className="font-medium text-accent hover:underline"
//               >
//                 Create an account
//               </Link>
//             </p>

//             <p className="text-secondary">
//               Want to publish your content?{' '}
//               <Link
//                 to="/publisher/signup"
//                 className="font-medium text-accent hover:underline"
//               >
//                 Become a publisher
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </main>
//   )
// }

// export default LoginPage


// // import { useState } from 'react'
// // import type { FormEvent } from 'react'
// // import { useNavigate, Link } from 'react-router-dom'
// // import useAuth from '../../hooks/useAuth'
// // import { loginSchema } from '../../schemas/authSchema'

// // import { login } from '../../services/auth/authService'
// // import { Eye, EyeOff } from 'lucide-react'
// // function LoginPage() {
// //   const navigate = useNavigate()

// //   const [email, setEmail] = useState('')
// //   const [password, setPassword] = useState('')

// //   const [showPassword, setShowPassword] = useState(false)

// //   const [errors, setErrors] = useState<{
// //       email?: string
// //       password?: string
// //       form?: string
// //     }>({})

// //   const [isLoading, setIsLoading] = useState(false)

// //   const { setCredentials } = useAuth()

// //   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
// //     event.preventDefault()

// //   setErrors({})

// //   const result = loginSchema.safeParse({
// //     email,
// //     password,
// //   })

// //   if (!result.success) {
// //     const fieldErrors: {
// //       email?: string
// //       password?: string
// //     } = {}

// //     for (const issue of result.error.issues) {
// //       const field = issue.path[0]

// //       if (field === 'email' || field === 'password') {
// //         fieldErrors[field] = issue.message
// //       }
// //     }

// //     setErrors(fieldErrors)
// //     return
// //   }

// //     setIsLoading(true)

// //     try {
// //       const response = await login(result.data)

// //       console.log('Logged in user:', response.user)

  
// //       setCredentials(response.user, response.accessToken)                                // Store the logged-in user and access token in the global auth state.

// //       if (response.user.role === 'publisher') {
// //         navigate('/publisher/dashboard')
// //       } else if (response.user.role === 'admin') {
// //         navigate('/admin/dashboard')
// //       } else {
// //         navigate('/')
// //       }
// //     } catch (error) {
// //       console.error('Login failed:', error)
// //       setErrors({
// //         form: 'Invalid email or password',
// //       })
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   return (
// //     <main className="min-h-screen bg-background px-6 py-8">
// //       <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
// //         <div className="mb-10">
// //           <p className="text-sm font-semibold tracking-wide text-accent">
// //             ASCEND
// //           </p>

// //           <h1 className="mt-6 font-serif text-5xl leading-tight text-primary">
// //             Welcome back
// //           </h1>

// //           <p className="mt-3 text-base text-secondary">
// //             Continue your learning journey.
// //           </p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-5">
// //           <div>
// //             <label
// //               htmlFor="email"
// //               className="mb-2 block text-sm font-medium text-primary"
// //             >
// //               Email
// //             </label>

// //             <input
// //               id="email"
// //               type="email"
// //               value={email}
// //               onChange={(event) => setEmail(event.target.value)}
// //               placeholder="you@example.com"
// //               className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent"
// //             />

// //             {errors.email && (
// //               <p className="mt-2 text-sm text-error">
// //                 {errors.email}
// //               </p>
// //             )}

// //           </div>

// //           <div>
// //             <label
// //               htmlFor="password"
// //               className="mb-2 block text-sm font-medium text-primary"
// //             >
// //               Password
// //             </label>
// //               <div className="relative">
// //                   <input
// //                     id="password"
// //                     type={showPassword ? 'text' : 'password'}
// //                     value={password}
// //                     onChange={(event) => setPassword(event.target.value)}
// //                     placeholder="Enter your password"
// //                     className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
// //                   />

// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword((current) => !current)}
// //                     className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
// //                     aria-label={showPassword ? 'Hide password' : 'Show password'}
// //                   >
// //                     {showPassword ? (
// //                       <EyeOff size={19} />
// //                     ) : (
// //                       <Eye size={19} />
// //                     )}
// //                   </button>
// //                 </div>

// //             {errors.password && (
// //               <p className="mt-2 text-sm text-error">
// //                 {errors.password}
// //               </p>
// //             )}

// //           </div>

// //           <div className="flex justify-end">
// //             <Link
// //               to="/forgot-password"
// //               className="text-sm font-medium text-accent hover:underline"
// //             >
// //               Forgot password?
// //             </Link>
// //           </div>

// //             {errors.form && (
// //               <p className="text-sm text-error">
// //                 {errors.form}
// //               </p>
// //             )}

// //           <button
// //             type="submit"
// //             disabled={isLoading}
// //             className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
// //           >
// //             {isLoading ? 'Signing in...' : 'Sign in'}
// //           </button>

// //           <div className="mt-8 text-center text-sm text-secondary">
// //             Don't have an account?{' '}
// //             <Link
// //               to="/signup"
// //               className="font-medium text-accent hover:underline"
// //             >
// //               Create an account
// //             </Link>
// //           </div>
// //         </form>
// //       </div>
// //     </main>
// //   )
// // }

// // export default LoginPage

