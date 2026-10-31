
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {
  RefreshCw,
  Building2,
  Mail,
  CalendarDays,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react'

import {
  getAllPublishers,
  getPendingPublishers,
  approvePublisher,
  rejectPublisher,
} from '../../services/admin/publisherService'

import type { PendingPublisher } from '../../types/publisherVerification'
import type { PublisherAdminListItem } from '../../types/publisher'

type PublisherAction = {
  publisherId: string
  action: 'approve' | 'reject'
}

function AdminPublishersPage() {
  const [publishers, setPublishers] = useState<PendingPublisher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Tracks the publisher and action currently being processed.
  const [activeAction, setActiveAction] = useState<PublisherAction | null>(null)

  // Stores the publisher selected for rejection.
  const [publisherToReject, setPublisherToReject] =
    useState<PendingPublisher | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Stores all publishers, regardless of verification status.
  const [allPublishers, setAllPublishers] = useState<
    PublisherAdminListItem[]
  >([])

  const [isAllPublishersLoading, setIsAllPublishersLoading] =
    useState(true)

  const [allPublishersError, setAllPublishersError] =
    useState<string | null>(null)

  // Fetch pending publisher applications from the backend.
  const fetchPublishers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // The service already returns the publisher array.
      const publishers = await getPendingPublishers()
      setPublishers(publishers)
    } catch (error) {
      console.error('Failed to fetch pending publishers:', error)

      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ??
              'Unable to load pending publisher applications.'
          : 'Unable to load pending publisher applications.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])


  // Fetch every publisher for the management table.
  const fetchAllPublishers = useCallback(async () => {
    try {
      setIsAllPublishersLoading(true)
      setAllPublishersError(null)

      const publishers = await getAllPublishers()
      setAllPublishers(publishers)
    } catch (error) {
      console.error('Failed to fetch all publishers:', error)

      setAllPublishersError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ??
              'Unable to load publishers.'
          : 'Unable to load publishers.',
      )
    } finally {
      setIsAllPublishersLoading(false)
    }
  }, [])

  // Load both datasets after the component has mounted.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchPublishers()
      void fetchAllPublishers()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [fetchPublishers, fetchAllPublishers])

  // Format the submission date for display.
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  // Extract a useful message from an API error.
  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message ?? fallback
    }

    return fallback
  }

  // Approve a publisher and remove the application from the pending list.
  const handleApprove = async (publisher: PendingPublisher) => {
    try {
      setActiveAction({
        publisherId: publisher._id,
        action: 'approve',
      })
      setFeedback(null)

      await approvePublisher(publisher._id)

      setPublishers((currentPublishers) =>
        currentPublishers.filter(
          (item) => item._id !== publisher._id,
        ),
      )
      void fetchAllPublishers()

      setFeedback({
        type: 'success',
        message: `${publisher.userId.name} has been approved successfully.`,
      })
    } catch (error) {
      console.error('Failed to approve publisher:', error)

      setFeedback({
        type: 'error',
        message: getErrorMessage(
          error,
          'Unable to approve this publisher. Please try again.',
        ),
      })
    } finally {
      setActiveAction(null)
    }
  }

  // Open the rejection dialog for the selected publisher.
  const openRejectDialog = (publisher: PendingPublisher) => {
    setPublisherToReject(publisher)
    setRejectionReason('')
    setFeedback(null)
  }

  const closeRejectDialog = () => {
    if (activeAction) return

    setPublisherToReject(null)
    setRejectionReason('')
  }

  // Reject a publisher after validating the reason.
  const handleReject = async () => {
    if (!publisherToReject || activeAction) return

    const reason = rejectionReason.trim()

    if (!reason) {
      setFeedback({
        type: 'error',
        message: 'Please enter a reason for rejecting this application.',
      })
      return
    }

    const publisher = publisherToReject

    try {
      setActiveAction({
        publisherId: publisher._id,
        action: 'reject',
      })
      setFeedback(null)

      await rejectPublisher(publisher._id, { reason })

      setPublishers((currentPublishers) =>
        currentPublishers.filter(
          (item) => item._id !== publisher._id,
        ),
      )
      void fetchAllPublishers()

      setPublisherToReject(null)
      setRejectionReason('')

      setFeedback({
        type: 'success',
        message: `${publisher.userId.name}'s application has been rejected.`,
      })
    } catch (error) {
      console.error('Failed to reject publisher:', error)

      setFeedback({
        type: 'error',
        message: getErrorMessage(
          error,
          'Unable to reject this publisher. Please try again.',
        ),
      })
    } finally {
      setActiveAction(null)
    }
  }

  const isProcessing = activeAction !== null

  return (
    <main className="min-h-screen bg-background text-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading and pending count */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-accent">
              Publisher management
            </p>

            <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
              Publisher verification
            </h1>

            <p className="mt-2 text-secondary">
              Review applications awaiting approval.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
            <Building2 size={20} className="text-accent" />

            <div>
              <p className="text-2xl font-semibold">
                {publishers.length}
              </p>
              <p className="text-xs text-secondary">
                Pending applications
              </p>
            </div>
          </div>
        </div>

        {/* Refresh and feedback */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-secondary">
            Review each application before making a decision.
          </p>

          <button
            type="button"
            onClick={() => {
              void fetchPublishers()
              void fetchAllPublishers()
            }}
            disabled={isLoading || isAllPublishersLoading || isProcessing}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isLoading || isAllPublishersLoading ? 'animate-spin' : ''
              }
            />
            Refresh
          </button>
        </div>

        {feedback && (
          <div
            role="status"
            className={`mt-4 rounded-xl border p-4 ${
              feedback.type === 'success'
                ? 'border-success/20 bg-success/10 text-success'
                : 'border-error/20 bg-error/10 text-error'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{feedback.message}</p>

              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setFeedback(null)}
                className="shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Loading, error, empty, and list states */}
        {isLoading ? (
          <div
            role="status"
            className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-6 py-16 text-secondary"
          >
            <RefreshCw size={20} className="animate-spin" />
            Loading pending applications...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-error/20 bg-error/10 p-6"
          >
            <p className="font-medium text-error">{error}</p>

            <button
              type="button"
              onClick={() => void fetchPublishers()}
              className="mt-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        ) : publishers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <Building2 size={36} className="mx-auto text-muted" />

            <h2 className="mt-4 text-lg font-semibold">
              No pending applications
            </h2>

            <p className="mt-2 text-secondary">
              All publisher applications have been reviewed.
            </p>
          </div>
        ) : (
          <section
            aria-label="Pending publisher applications"
            className="mt-8 grid gap-5 lg:grid-cols-2"
          >
            {publishers.map((publisher) => {
              const isApproving =
                activeAction?.publisherId === publisher._id &&
                activeAction.action === 'approve'

              const isRejecting =
                activeAction?.publisherId === publisher._id &&
                activeAction.action === 'reject'

              return (
                <article
                  key={publisher._id}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {publisher.userId.name}
                      </h2>

                      <p className="mt-1 flex items-center gap-2 break-all text-sm text-secondary">
                        <Mail size={16} className="shrink-0" />
                        {publisher.userId.email}
                      </p>
                    </div>

                    <span className="inline-flex self-start rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-300">
                      Pending
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-border pt-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Building2
                        size={17}
                        className="mt-0.5 shrink-0 text-muted"
                      />

                      <div>
                        <p className="text-secondary">Publisher type</p>
                        <p className="mt-1 capitalize">
                          {publisher.publisherType}
                        </p>
                      </div>
                    </div>

                    {publisher.publisherType === 'organization' &&
                      publisher.organizationName && (
                        <div className="text-sm">
                          <p className="text-secondary">
                            Organization name
                          </p>
                          <p className="mt-1">
                            {publisher.organizationName}
                          </p>
                        </div>
                      )}

                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={17} className="text-muted" />

                      <span className="text-secondary">
                        Email verification:
                      </span>

                      <span
                        className={
                          publisher.userId.emailVerified
                            ? 'font-medium text-success'
                            : 'font-medium text-error'
                        }
                      >
                        {publisher.userId.emailVerified
                          ? 'Verified'
                          : 'Not verified'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays size={17} className="text-muted" />

                      <span className="text-secondary">Submitted:</span>
                      <span>{formatDate(publisher.createdAt)}</span>
                    </div>
                  </div>

                  {/* Publisher review actions */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => void handleApprove(publisher)}
                      disabled={isProcessing}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle size={17} />
                      {isApproving ? 'Approving...' : 'Approve'}
                    </button>

                    <button
                      type="button"
                      onClick={() => openRejectDialog(publisher)}
                      disabled={isProcessing}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-error/30 px-4 py-2.5 text-sm font-semibold text-error hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      {isRejecting ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        )}

        {/* All publishers management table */}
        <section className="mt-12">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-accent">
                Publisher directory
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
                All publishers
              </h2>
              <p className="mt-2 text-sm text-secondary">
                View every publisher and their current account and verification status.
              </p>
            </div>

            <span className="self-start rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-secondary sm:self-auto">
              {allPublishers.length} publishers
            </span>
          </div>

          {isAllPublishersLoading ? (
            <div
              role="status"
              className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-6 py-12 text-secondary"
            >
              <RefreshCw size={20} className="animate-spin" />
              Loading publishers...
            </div>
          ) : allPublishersError ? (
            <div
              role="alert"
              className="rounded-2xl border border-error/20 bg-error/10 p-6"
            >
              <p className="font-medium text-error">{allPublishersError}</p>
              <button
                type="button"
                onClick={() => void fetchAllPublishers()}
                className="mt-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          ) : allPublishers.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
              <Building2 size={32} className="mx-auto text-muted" />
              <h3 className="mt-3 font-semibold">No publishers found</h3>
              <p className="mt-1 text-sm text-secondary">
                Publisher accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="border-b border-border bg-background/70 text-xs uppercase tracking-wide text-secondary">
                    <tr>
                      <th className="px-5 py-4 font-medium">Publisher</th>
                      <th className="px-5 py-4 font-medium">Type</th>
                      <th className="px-5 py-4 font-medium">Organization</th>
                      <th className="px-5 py-4 font-medium">Verification</th>
                      <th className="px-5 py-4 font-medium">Email</th>
                      <th className="px-5 py-4 font-medium">Account</th>
                      <th className="px-5 py-4 font-medium">Joined</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {allPublishers.map((publisher) => {
                      const verificationStatus =
                        publisher.verification.status

                      const verificationBadge =
                        verificationStatus === 'approved'
                          ? 'bg-success/10 text-success'
                          : verificationStatus === 'rejected'
                            ? 'bg-error/10 text-error'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'

                      return (
                        <tr
                          key={publisher.id}
                          className="transition-colors hover:bg-background/60"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-primary">
                              {publisher.user.name}
                            </p>
                            <p className="mt-1 text-xs text-secondary">
                              {publisher.user.email}
                            </p>
                          </td>

                          <td className="px-5 py-4 capitalize">
                            {publisher.publisherType}
                          </td>

                          <td className="px-5 py-4 text-secondary">
                            {publisher.organizationName ?? '—'}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${verificationBadge}`}
                            >
                              {verificationStatus}
                            </span>
                            {publisher.verification.reason && (
                              <p
                                className="mt-1 max-w-[180px] truncate text-xs text-secondary"
                                title={publisher.verification.reason}
                              >
                                {publisher.verification.reason}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={
                                publisher.user.emailVerified
                                  ? 'font-medium text-success'
                                  : 'font-medium text-error'
                              }
                            >
                              {publisher.user.emailVerified
                                ? 'Verified'
                                : 'Not verified'}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={
                                publisher.user.isActive
                                  ? 'font-medium text-success'
                                  : 'font-medium text-error'
                              }
                            >
                              {publisher.user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-secondary">
                            {formatDate(publisher.createdAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Rejection reason dialog */}
      {publisherToReject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeRejectDialog()
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-dialog-title"
            className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="reject-dialog-title"
                  className="text-xl font-semibold"
                >
                  Reject publisher application
                </h2>

                <p className="mt-2 text-sm text-secondary">
                  You are rejecting {publisherToReject.userId.name}'s
                  application. Provide a reason for this decision.
                </p>
              </div>

              <button
                type="button"
                onClick={closeRejectDialog}
                disabled={isProcessing}
                aria-label="Close rejection dialog"
                className="rounded-lg p-1 hover:bg-background disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault()
                void handleReject()
              }}
            >
              <label
                htmlFor="rejection-reason"
                className="mb-2 block text-sm font-medium"
              >
                Rejection reason <span className="text-error">*</span>
              </label>

              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(event.target.value)
                }
                required
                maxLength={1000}
                rows={4}
                disabled={isProcessing}
                placeholder="Explain why this application is being rejected..."
                className="w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-accent disabled:opacity-50"
              />

              <p className="mt-1 text-right text-xs text-secondary">
                {rejectionReason.length}/1000 characters
              </p>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeRejectDialog}
                  disabled={isProcessing}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-background disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing || !rejectionReason.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-error px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRejectingDialogLoading(activeAction) ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    'Confirm rejection'
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

function isRejectingDialogLoading(action: PublisherAction | null) {
  return action?.action === 'reject'
}

export default AdminPublishersPage

