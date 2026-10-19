import { useEffect, useState } from 'react'
import { getMyProfile } from '../../services/publisher/publisherService'
import type { PublisherProfile } from '../../types/publisherProfile'

export default function PublisherProfilePage() {
  const [profile, setProfile] = useState<PublisherProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        setError(null)

        const data = await getMyProfile()
        setProfile(data)
      } catch {
        setError('Unable to load your profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading your profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!profile) {
    return <div className="p-6">Profile not found.</div>
  }

  const { user, publisher } = profile
  const status = publisher.verification.status

  const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Publisher Profile
      </h1>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {user.profilepic?.url ? (
            <img
              src={user.profilepic.url}
              alt={`${user.name}'s profile`}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.name}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Publisher Details
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Publisher Type</p>
            <p className="font-medium capitalize text-gray-900">
              {publisher.publisherType}
            </p>
          </div>

          {publisher.publisherType === 'organization' && (
            <div>
              <p className="text-sm text-gray-500">Organization Name</p>
              <p className="font-medium text-gray-900">
                {publisher.organizationName || 'Not provided'}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${
                statusStyles[status] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {status}
            </span>
          </div>

          {status === 'rejected' && publisher.verification.reason && (
            <div>
              <p className="text-sm text-gray-500">Rejection Reason</p>
              <p className="text-red-700">
                {publisher.verification.reason}
              </p>
            </div>
          )}

          {publisher.verification.reviewedAt && (
            <div>
              <p className="text-sm text-gray-500">Last Reviewed</p>
              <p className="text-gray-900">
                {new Date(
                  publisher.verification.reviewedAt,
                ).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}