import { useEffect, useState, useRef} from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { verifyResetOtp, resendOtp } from '../../services/auth/authService'
import { verifyOtpSchema } from '../../schemas/authSchema'

function VerifyResetOtpPage() {
  const location = useLocation()  
  const navigate = useNavigate()

  const { email, message } = location.state || {}

  const [otp, setOtp] = useState('')
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    if (!email) {
      
      navigate('/forgot-password', { replace: true })                                     // Prevent users from entering the reset flow without starting it from Forgot Password.
    }
  }, [email, navigate])

  useEffect(() => {
    if (resendCooldown <= 0) {
      return
    }

    const timer = setInterval(() => {
      setResendCooldown((previous) => previous - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  if (!email) {
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    const result = verifyOtpSchema.safeParse({
      email,
      otp,
    })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setIsLoading(true)

    try {
      const response = await verifyResetOtp(result.data)

      console.log('Reset OTP verified:', response)

      // The reset token authorizes the next step without storing it in localStorage.
      navigate('/reset-password', {
        state: {
          resetToken: response.resetToken,
        },
      })
    } catch (error) {
      console.error('Reset OTP verification failed:', error)

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || 'OTP verification failed',
        )
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) {
      return
    }

    setError('')
    setResendMessage('')
    setIsResending(true)

    try {
      const response = await resendOtp(email, 'password_reset')

      setResendMessage(response.message)
      setResendCooldown(60)
      setOtp('')
    } catch (error) {
      console.error('Failed to resend reset OTP:', error)

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || 'Failed to resend OTP',
        )
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsResending(false)
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
            Verify your email
          </h1>

          {message && (
            <p className="mt-4 rounded-lg bg-accent-soft px-4 py-3 text-sm text-secondary">
              {message}
            </p>
          )}

          <p className="mt-3 text-sm text-muted">
            Enter the code sent to{' '}
            <span className="font-medium text-primary">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Verification code
            </label>

            <div className="flex justify-between gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index] ?? ''}
                  onChange={(event) => {
                    const value = event.target.value

                    // Accept only one numeric digit in each OTP box.
                    if (!/^\d?$/.test(value)) {
                      return
                    }

                    const otpArray = otp.split('')
                    otpArray[index] = value

                    const newOtp = otpArray.join('').slice(0, 6)

                    setOtp(newOtp)
                    setError('')

                    // Move focus forward after entering a digit.
                    if (value && index < 5) {
                      inputRefs.current[index + 1]?.focus()
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault()

                    const pastedValue = event.clipboardData
                      .getData('text')
                      .replace(/\D/g, '')
                      .slice(0, 6)

                    if (!pastedValue) {
                      return
                    }

                    setOtp(pastedValue)
                    setError('')

                    // Focus the next available box after pasting.
                    const nextIndex = Math.min(pastedValue.length, 5)
                    inputRefs.current[nextIndex]?.focus()
                  }}
                  onKeyDown={(event) => {
                    // Move back when deleting from an empty box.
                    if (
                      event.key === 'Backspace' &&
                      !otp[index] &&
                      index > 0
                    ) {
                      inputRefs.current[index - 1]?.focus()
                    }
                  }}
                  className="h-14 w-12 rounded-lg border border-border bg-surface text-center text-xl font-medium text-primary outline-none transition focus:border-accent"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="mt-2 text-sm text-error">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Verifying...' : 'Verify code'}
          </button>

          <div className="text-center">
            {resendMessage && (
              <p className="mb-2 text-sm text-success">
                {resendMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || resendCooldown > 0}
              className="text-sm font-medium text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending
                ? 'Sending...'
                : resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default VerifyResetOtpPage

