import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

import { resetPassword } from '../../services/auth/authService'
import { resetPasswordSchema } from '../../schemas/authSchema'

function ResetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const resetToken = location.state?.resetToken

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!resetToken) {
      // A verified OTP is required before a user can reset their password.
      navigate('/forgot-password', { replace: true })
    }
  }, [resetToken, navigate])

  if (!resetToken) {
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    const result = resetPasswordSchema.safeParse({
      resetToken,
      newPassword,
      confirmPassword,
    })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setIsLoading(true)

    try {
      const response = await resetPassword({
        resetToken,
        newPassword: result.data.newPassword,
      })

      setSuccessMessage(response.message)

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1000)
    } catch (error) {
      console.error('Password reset failed:', error)

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Unable to reset your password. Please try again.',
        )
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputClassName =
    'w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20'

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-10">
          <p className="text-center text-sm font-semibold tracking-wide text-accent">
            ASCEND
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-tight text-primary">
            Create a new password
          </h1>

          <p className="mt-3 text-base text-secondary">
            Choose a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-primary"
            >
              New password
            </label>

            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value)
                  setError('')
                  setSuccessMessage('')
                }}
                placeholder="Enter your new password"
                className={inputClassName}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Confirm password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setError('')
                  setSuccessMessage('')
                }}
                placeholder="Confirm your new password"
                className={inputClassName}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                className="absolute inset-y-0 right-3 flex items-center text-muted transition hover:text-primary"
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {error}
            </p>
          )}

          {successMessage && (
            <p
              role="status"
              className="rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success"
            >
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Updating password...' : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default ResetPasswordPage


// import type { FormEvent } from 'react'
// import { useEffect, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import axios from 'axios'

// import { resetPassword } from '../../services/auth/authService'
// import { resetPasswordSchema } from '../../schemas/authSchema'

// function ResetPasswordPage() {
//   const location = useLocation()
//   const navigate = useNavigate()

//   const resetToken = location.state?.resetToken

  
//   const [error, setError] = useState('')
//   const [successMessage, setSuccessMessage] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   useEffect(() => {
//     if (!resetToken) {
      
//       navigate('/forgot-password', { replace: true })                                    // Prevent users from entering the reset step without a verified OTP.
//     }
//   }, [resetToken, navigate])

//   if (!resetToken) {
//     return null
//   }

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     setError('')
//     setSuccessMessage('')

//     const result = resetPasswordSchema.safeParse({
//       resetToken,
//       newPassword,
//       confirmPassword
//     })

//     if (!result.success) {
//       setError(result.error.issues[0].message)
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await resetPassword({
//         resetToken,
//         newPassword: result.data.newPassword
//       })

//       console.log('Password reset successful:', response)

//       setSuccessMessage(response.message)

//       setTimeout(() => {
//         navigate('/login', { replace: true })
//       }, 1000)
//     } catch (error) {
//       console.error('Password reset failed:', error)

//       if (axios.isAxiosError(error)) {
//         setError(
//           error.response?.data?.message ||
//             'Unable to reset your password. Please try again.',
//         )
//       } else {
//         setError('Something went wrong. Please try again.')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-screen bg-background px-6 py-8">
//       <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
//         <div className="mb-10">
//           <p className="text-center text-sm font-semibold tracking-wide text-accent">
//             ASCEND
//           </p>

//           <h1 className="mt-6 font-serif text-5xl leading-tight text-primary">
//             Create a new password
//           </h1>

//           <p className="mt-3 text-base text-secondary">
//             Choose a new password for your account.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="newPassword"
//               className="mb-2 block text-sm font-medium text-primary"
//             >
//               New password
//             </label>

//             <div className="relative">
//               <input
//                 id="newPassword"
//                 type={showPassword ? 'text' : 'password'}
//                 value={newPassword}
//                 onChange={(event) => {
//                   setNewPassword(event.target.value)
//                   setError('')
//                   setSuccessMessage('')
//                 }}
//                 placeholder="Enter your new password"
//                 className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword((previous) => !previous)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? 'Hide' : 'Show'}
//               </button>
//             </div>

//             {error && (
//               <p className="mt-2 text-sm text-error">
//                 {error}
//               </p>
//             )}

//             {successMessage && (
//               <p className="mt-2 text-sm text-success">
//                 {successMessage}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="mb-2 block text-sm font-medium text-primary"
//             >
//               Confirm password
//             </label>

//             <div className="relative">
//               <input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 value={confirmPassword}
//                 onChange={(event) => {
//                   setConfirmPassword(event.target.value)
//                   setError('')
//                   setSuccessMessage('')
//                 }}
//                 placeholder="Confirm your new password"
//                 className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 text-primary outline-none transition focus:border-accent"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword((previous) => !previous)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
//                 aria-label={
//                   showConfirmPassword ? 'Hide password' : 'Show password'
//                 }
//               >
//                 {showConfirmPassword ? 'Hide' : 'Show'}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isLoading ? 'Updating password...' : 'Update password'}
//           </button>
//         </form>
//       </div>
//     </main>
//   )
// }

// export default ResetPasswordPage

