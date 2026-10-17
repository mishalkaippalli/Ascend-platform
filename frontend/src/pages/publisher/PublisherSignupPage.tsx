import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { publisherSignup } from '../../services/publisher/publisherService'
import { publisherSignupSchema } from '../../schemas/authSchema'
import type { PublisherSignupDTO } from '../../types/auth'

function PublisherSignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [publisherType, setPublisherType] = useState<
    'individual' | 'organization'
  >('individual')
  const [organizationName, setOrganizationName] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Store validation errors separately for each form field.
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    publisherType?: string
    organizationName?: string
  }>({})

  // Backend errors, such as an email that is already registered.
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setServerError('')

    // Validate every field before making the API request.
    const result = publisherSignupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      publisherType,
      organizationName,
    })

    if (!result.success) {
      const fieldErrors: {
        name?: string
        email?: string
        password?: string
        confirmPassword?: string
        publisherType?: string
        organizationName?: string
      } = {}

      // Collect the first validation message for each field.
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]

        if (
          field === 'name' ||
          field === 'email' ||
          field === 'password' ||
          field === 'confirmPassword' ||
          field === 'publisherType' ||
          field === 'organizationName'
        ) {
          fieldErrors[field] ??= issue.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    // Include organizationName only for organization publishers.
    const publisherData: PublisherSignupDTO = {
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
      publisherType: result.data.publisherType,
      ...(result.data.publisherType === 'organization' &&
      result.data.organizationName
        ? { organizationName: result.data.organizationName }
        : {}),
    }

    try {
      const response = await publisherSignup(publisherData)

      // Reuse the existing OTP verification flow.
      navigate('/verify-otp', {
        state: {
          email: response.email,
        },
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ||
            'Unable to create publisher account.',
        )
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Keep the styling consistent across all input fields.
  const inputClassName =
    'w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20'

  const labelClassName =
    'mb-2 block text-sm font-medium text-primary'

  // Clear a field's validation error when the user edits it.
  const clearFieldError = (
    field: keyof typeof errors,
  ) => {
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }))
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
            Ascend
          </p>

          <h1 className="font-serif text-4xl text-primary">
            Become a publisher
          </h1>

          <p className="mt-3 text-secondary">
            Share your books, podcasts and articles with users on Ascend.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Display API errors separately from field validation errors. */}
          {serverError && (
            <p
              role="alert"
              className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {serverError}
            </p>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClassName}>
              Full name *
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearFieldError('name')
                setServerError('')
              }}
              className={inputClassName}
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />

            {errors.name && (
              <p
                id="name-error"
                className="mt-2 text-sm text-error"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClassName}>
              Email *
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearFieldError('email')
                setServerError('')
              }}
              className={inputClassName}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />

            {errors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm text-error"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Publisher type */}
          <div>
            <label htmlFor="publisherType" className={labelClassName}>
              Publisher type *
            </label>

            <select
              id="publisherType"
              value={publisherType}
              onChange={(event) => {
                const type = event.target.value as
                  | 'individual'
                  | 'organization'

                setPublisherType(type)
                clearFieldError('publisherType')
                clearFieldError('organizationName')
                setServerError('')
              }}
              className={inputClassName}
              aria-invalid={Boolean(errors.publisherType)}
              aria-describedby={
                errors.publisherType ? 'publisher-type-error' : undefined
              }
            >
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>

            {errors.publisherType && (
              <p
                id="publisher-type-error"
                className="mt-2 text-sm text-error"
              >
                {errors.publisherType}
              </p>
            )}
          </div>

          {/* Organization name is required only when applicable. */}
          {publisherType === 'organization' && (
            <div>
              <label
                htmlFor="organizationName"
                className={labelClassName}
              >
                Organization name *
              </label>

              <input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(event) => {
                  setOrganizationName(event.target.value)
                  clearFieldError('organizationName')
                  setServerError('')
                }}
                className={inputClassName}
                placeholder="Your organization"
                autoComplete="organization"
                aria-invalid={Boolean(errors.organizationName)}
                aria-describedby={
                  errors.organizationName
                    ? 'organization-name-error'
                    : undefined
                }
              />

              {errors.organizationName && (
                <p
                  id="organization-name-error"
                  className="mt-2 text-sm text-error"
                >
                  {errors.organizationName}
                </p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelClassName}>
              Password *
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  clearFieldError('password')
                  setServerError('')
                }}
                className={`${inputClassName} pr-12`}
                placeholder="Create a password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                className="mt-2 text-sm text-error"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className={labelClassName}
            >
              Confirm password *
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  clearFieldError('confirmPassword')
                  setServerError('')
                }}
                className={`${inputClassName} pr-12`}
                placeholder="Confirm your password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? 'confirm-password-error'
                    : undefined
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="mt-2 text-sm text-error"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Creating account...' : 'Create publisher account'}
          </button>

          <div className="text-center text-sm text-secondary">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
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

export default PublisherSignupPage

// import { useState } from 'react'
// import { Eye, EyeOff } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// import { publisherSignup } from '../../services/publisher/publisherService'
// import { publisherSignupSchema } from '../../schemas/authSchema'
// import type { PublisherSignupDTO } from '../../types/auth'

// function PublisherSignupPage() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [publisherType, setPublisherType] = useState<
//     'individual' | 'organization'
//   >('individual')
//   const [organizationName, setOrganizationName] = useState('')

//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const navigate = useNavigate()

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     setError('')
//     setIsLoading(true)

//     const result = publisherSignupSchema.safeParse({
//       name,
//       email,
//       password,
//       confirmPassword,
//       publisherType,
//       organizationName,
//     })

//     if (!result.success) {
//       setError(result.error.issues[0].message)
//       setIsLoading(false)
//       return
//     }

//     const publisherData: PublisherSignupDTO = {
//       name: result.data.name,
//       email: result.data.email,
//       password: result.data.password,
//       publisherType: result.data.publisherType,
//       // Send an organization name only for organization publishers.
//       ...(result.data.publisherType === 'organization' &&
//       result.data.organizationName
//         ? { organizationName: result.data.organizationName }
//         : {}),
//     }

//     try {
//       const response = await publisherSignup(publisherData)

//       // Reuse the existing OTP verification flow for publisher email verification.
//       navigate('/verify-otp', {
//         state: {
//           email: response.email,
//         },
//       })
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         setError(
//           error.response?.data?.message || 'Unable to create publisher account',
//         )
//       } else {
//         setError('Something went wrong. Please try again.')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const inputClassName =
//     'w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20'
//   const labelClassName = 'mb-2 block text-sm font-medium text-primary'

//   return (
//     <main className="min-h-screen bg-background px-6 py-12">
//       <div className="mx-auto max-w-md">
//         <div className="mb-8">
//           <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
//             Ascend
//           </p>

//           <h1 className="font-serif text-4xl text-primary">
//             Become a publisher
//           </h1>

//           <p className="mt-3 text-secondary">
//             Share your books, podcasts and articles with users on Ascend.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {error && (
//             <p
//               role="alert"
//               className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error"
//             >
//               {error}
//             </p>
//           )}

//           {/* Name */}
//           <div>
//             <label htmlFor="name" className={labelClassName}>
//               Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               value={name}
//               onChange={(event) => setName(event.target.value)}
//               className={inputClassName}
//               placeholder="Your name"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label htmlFor="email" className={labelClassName}>
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               className={inputClassName}
//               placeholder="you@example.com"
//             />
//           </div>

//           {/* Publisher type */}
//           <div>
//             <label htmlFor="publisherType" className={labelClassName}>
//               Publisher type
//             </label>
//             <select
//               id="publisherType"
//               value={publisherType}
//               onChange={(event) =>
//                 setPublisherType(
//                   event.target.value as 'individual' | 'organization',
//                 )
//               }
//               className={inputClassName}
//             >
//               <option value="individual">Individual</option>
//               <option value="organization">Organization</option>
//             </select>
//           </div>

//           {/* Ask for an organization name only when applicable. */}
//           {publisherType === 'organization' && (
//             <div>
//               <label htmlFor="organizationName" className={labelClassName}>
//                 Organization name
//               </label>
//               <input
//                 id="organizationName"
//                 type="text"
//                 value={organizationName}
//                 onChange={(event) => setOrganizationName(event.target.value)}
//                 className={inputClassName}
//                 placeholder="Your organization"
//               />
//             </div>
//           )}

//           {/* Password */}
//           <div>
//             <label htmlFor="password" className={labelClassName}>
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 className={`${inputClassName} pr-12`}
//                 placeholder="Create a password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((previous) => !previous)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Confirm password */}
//           <div>
//             <label htmlFor="confirmPassword" className={labelClassName}>
//               Confirm password
//             </label>
//             <div className="relative">
//               <input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 value={confirmPassword}
//                 onChange={(event) => setConfirmPassword(event.target.value)}
//                 className={`${inputClassName} pr-12`}
//                 placeholder="Confirm your password"
//               />
//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowConfirmPassword((previous) => !previous)
//                 }
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
//                 aria-label={
//                   showConfirmPassword
//                     ? 'Hide confirm password'
//                     : 'Show confirm password'
//                 }
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff size={20} />
//                 ) : (
//                   <Eye size={20} />
//                 )}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isLoading ? 'Creating account...' : 'Create publisher account'}
//           </button>
//         </form>
//       </div>
//     </main>
//   )
// }

// export default PublisherSignupPage
