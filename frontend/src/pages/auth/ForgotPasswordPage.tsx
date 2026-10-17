import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { forgotPassword } from '../../services/auth/authService'
import { forgotPasswordSchema } from '../../schemas/authSchema'

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const result = forgotPasswordSchema.safeParse({ email })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setIsLoading(true)

    try {
      const response = await forgotPassword(result.data.email)

      navigate('/verify-reset-otp', {
        state: {
          email: result.data.email,
          message: response.message,
        },
      })
    } catch (error) {
      console.error('Forgot password failed:', error)
      setError('Unable to process your request. Please try again.')
    } finally {
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
            Forgot your password?
          </h1>

          <p className="mt-3 text-base leading-7 text-secondary">
            Enter your email and we&apos;ll send you a verification code.
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
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError('')
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Sending...' : 'Send verification code'}
          </button>

          <div className="text-center text-sm text-secondary">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default ForgotPasswordPage

