import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { signup } from "../../services/auth/authService"
import { signupSchema } from "../../schemas/authSchema"

function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const [serverError, setServerError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    })

    if (!result.success) {
      const fieldErrors: {
        name?: string
        email?: string
        password?: string
        confirmPassword?: string
      } = {}

      result.error.issues.forEach((issue) => {
        const field = issue.path[0]

        if (
          field === "name" ||
          field === "email" ||
          field === "password" ||
          field === "confirmPassword"
        ) {
          fieldErrors[field] = issue.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setServerError("")
    setIsLoading(true)

    try {
      const response = await signup(result.data)

      // Pass the email temporarily through router state, not the URL.
      navigate("/verify-otp", {
        state: {
          email: response.email,
        },
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Something went wrong")
      } else {
        setServerError("Something went wrong")
      }
    } finally {
      // Reset loading for both successful and failed requests.
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-10">
          <p className="text-center text-sm font-semibold tracking-wide text-accent">
            ASCEND
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-tight text-primary">
            Create your account
          </h1>

          <p className="mt-3 text-base text-secondary">
            Start learning with Ascend.
          </p>

          {serverError && (
            <p className="mt-4 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
              {serverError}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Full name *
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setServerError("")

                if (errors.name) {
                  setErrors((previous) => ({
                    ...previous,
                    name: undefined,
                  }))
                }
              }}
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent"
            />

            {errors.name && (
              <p className="mt-2 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Email *
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setServerError("")

                if (errors.email) {
                  setErrors((previous) => ({
                    ...previous,
                    email: undefined,
                  }))
                }
              }}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent"
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
              Password *
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setServerError("")

                  if (errors.password) {
                    setErrors((previous) => ({
                      ...previous,
                      password: undefined,
                    }))
                  }
                }}
                placeholder="Create a password"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-error">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Confirm Password *
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setServerError("")

                  if (errors.confirmPassword) {
                    setErrors((previous) => ({
                      ...previous,
                      confirmPassword: undefined,
                    }))
                  }
                }}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-error">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>

          <div className="text-center text-sm text-secondary">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignupPage

// import { useState } from 'react'
// import axios from 'axios'
// import { signup } from '../../services/auth/authService'
// import { signupSchema } from '../../schemas/authSchema'
// import { useNavigate } from 'react-router-dom'

// import { Eye, EyeOff } from 'lucide-react'

// function SignupPage() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   const [errors, setErrors] = useState<{
//     name?: string
//     email?: string
//     password?: string
//     confirmPassword?: string
//   }>({})

//   const [serverError, setServerError] = useState('')

//   const [isLoading, setIsLoading] = useState(false)

//   const navigate = useNavigate()

//     const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
//       event,
//     ) => {
//     event.preventDefault()

//     const result = signupSchema.safeParse({
//       name,
//       email,
//       password,
//       confirmPassword,
//     })

//     if (!result.success) {
//       const fieldErrors: {
//         name?: string
//         email?: string
//         password?: string
//         confirmPassword?: string
//       } = {}

//       result.error.issues.forEach((issue) => {
//         const field = issue.path[0]

//         if (
//           field === 'name' ||
//           field === 'email' ||
//           field === 'password'||
//           field === 'confirmPassword'
//         ) {
//           fieldErrors[field] = issue.message
//         }
//       })

//       setErrors(fieldErrors)

//       return
//     }

//     setErrors({})

//     setIsLoading(true)

//     try {
//       const response = await signup(result.data)

//       navigate('/verify-otp', {                 // Navigate to the OTP page and temporarily pass the user's email.   // Router state keeps this temporary data out of the URL.                                             // Router state keeps this temporary data out of the URL.
//         state: {
//           email: response.email,
//         },
//       })

//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         setServerError(
//           error.response?.data?.message || 'Something went wrong',
//         )
//       } else {
//         setIsLoading(false)
//       }
//      }
//     }

//   return (
//     <main className="min-h-screen bg-background px-6 py-8">
//       <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
//         <div className="mb-10">
//           <p className="text-center text-sm font-semibold tracking-wide text-accent">
//             ASCEND
//           </p>

//           <h1 className="mt-6 font-serif text-5xl leading-tight text-primary">
//             Create your account
//           </h1>

//           <p className="mt-3 text-base text-secondary">
//             Start learning with Ascend.
//           </p>

//           {serverError && (
//             <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-error">
//               {serverError}
//             </p>
//           )}
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="name"
//               className="mb-2 block text-sm font-medium text-primary"
//             >
//               Full name
//             </label>

//             <input
//               id="name"
//               type="text"
//               value={name}
//               onChange={(event) => {
//                 setName(event.target.value)
//                 setServerError('')

//                 if (errors.name) {
//                   setErrors((previous) => ({
//                     ...previous,
//                     name: undefined,
//                   }))
//                 }
//               }}
//               placeholder="Your name"
//               className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent"
//             />

//             {errors.name && (
//               <p className="mt-2 text-sm text-error">
//                 {errors.name}
//               </p>
//             )}
//           </div>

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
//               onChange={(event) => {
//                 setEmail(event.target.value)
//                 setServerError('')

//                 if (errors.email) {
//                   setErrors((previous) => ({
//                     ...previous,
//                     email: undefined,
//                   }))
//                 }
//               }}
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
//                 onChange={(event) => {
//                   setPassword(event.target.value)
//                   setServerError('')

//                   if (errors.password) {
//                     setErrors((previous) => ({
//                       ...previous,
//                       password: undefined,
//                     }))
//                   }
//                 }}
//                 placeholder="Create a password"
//                 className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword((current) => !current)}
//                 className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
//               </button>
//             </div>

//             {errors.password && (
//               <p className="mt-2 text-sm text-error">
//                 {errors.password}
//               </p>
//             )}
//            </div>

//           <div>

//           <label
//             htmlFor="confirmPassword"
//             className="mb-2 block text-sm font-medium text-primary"
//           >
//             Confirm Password
//           </label>

//           <div className="relative">
//             <input
//               id="confirmPassword"
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(event) => {
//                 setConfirmPassword(event.target.value)
//                 setServerError('')

//                 if (errors.confirmPassword) {
//                   setErrors((previous) => ({
//                     ...previous,
//                     confirmPassword: undefined,
//                   }))
//                 }
//               }}
//               placeholder="Confirm your password"
//               className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowConfirmPassword((current) => !current)
//               }
//               className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
//               aria-label={
//                 showConfirmPassword
//                   ? 'Hide confirm password'
//                   : 'Show confirm password'
//               }
//             >
//               {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
//             </button>
//         </div>

//         {errors.confirmPassword && (
//           <p className="mt-2 text-sm text-error">
//             {errors.confirmPassword}
//           </p>
//         )}
//       </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isLoading ? 'Creating account...' : 'Create Account'}
//           </button>

//           <div className="text-center text-sm text-secondary">
//             Already have an account?{' '}
//             <button
//               type="button"
//               onClick={() => navigate('/login')}
//               className="font-medium text-accent hover:underline"
//             >
//               Sign in
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   )

// }

// export default SignupPage
