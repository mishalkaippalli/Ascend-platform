
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import {
  AlertCircle,
  CheckCircle,
  CircleSlash,
  FolderOpen,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Save,
  X,
} from 'lucide-react'

import {
  createCategory,
  getAdminCategories,
  updateCategory,
  updateCategoryStatus,
} from '../../services/admin/categoryService'

import type {
  Category,
  UpdateCategoryDTO,
} from '../../types/category'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savingEditId, setSavingEditId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  )
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isBusy =
    isSubmitting ||
    savingEditId !== null ||
    updatingStatusId !== null

  function getErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message

      if (typeof message === 'string' && message.trim()) {
        return message
      }

      if (!err.response) {
        return 'Unable to connect to the server. Please try again.'
      }
    }

    return fallback
  }

  // Admin listing includes active and inactive categories.
  const fetchCategories = useCallback(async () => {
    try {
      setError(null)

      const data = await getAdminCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch admin categories:', err)
      setError(getErrorMessage(err, 'Unable to load categories.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories()
    }

    void loadCategories()
  }, [fetchCategories])

  // Create a category using the existing form.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError('Category name must be between 2 and 100 characters.')
      setSuccess(null)
      return
    }

    if (trimmedDescription.length > 500) {
      setError('Description cannot exceed 500 characters.')
      setSuccess(null)
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      const createdCategory = await createCategory({
        name: trimmedName,
        ...(trimmedDescription
          ? { description: trimmedDescription }
          : {}),
      })

      // Add the API response directly to the list.
      setCategories((current) => [
        createdCategory,
        ...current.filter((category) => category.id !== createdCategory.id),
      ])

      setName('')
      setDescription('')
      setSuccess('Category created successfully.')
    } catch (err) {
      console.error('Failed to create category:', err)
      setError(getErrorMessage(err, 'Unable to create category.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEditing(category: Category) {
    setEditingCategoryId(category.id)
    setEditName(category.name)
    setEditDescription(category.description ?? '')
    setError(null)
    setSuccess(null)
  }

  function cancelEditing() {
    setEditingCategoryId(null)
    setEditName('')
    setEditDescription('')
  }

  // Send only fields that actually changed.
  async function handleSaveEdit(
    event: FormEvent<HTMLFormElement>,
    category: Category,
  ) {
    event.preventDefault()

    const trimmedName = editName.trim()
    const trimmedDescription = editDescription.trim()

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError('Category name must be between 2 and 100 characters.')
      setSuccess(null)
      return
    }

    if (trimmedDescription.length > 500) {
      setError('Description cannot exceed 500 characters.')
      setSuccess(null)
      return
    }

    const changes: UpdateCategoryDTO = {}

    if (trimmedName !== category.name) {
      changes.name = trimmedName
    }

    if (trimmedDescription !== (category.description ?? '')) {
      changes.description = trimmedDescription
    }

    if (Object.keys(changes).length === 0) {
      setError(null)
      setSuccess('No changes to save.')
      cancelEditing()
      return
    }

    try {
      setSavingEditId(category.id)
      setError(null)
      setSuccess(null)

      const updatedCategory = await updateCategory(category.id, changes)

      // Use the complete category returned by the backend.
      setCategories((current) =>
        current.map((item) =>
          item.id === updatedCategory.id ? updatedCategory : item,
        ),
      )

      cancelEditing()
      setSuccess('Category updated successfully.')
    } catch (err) {
      console.error('Failed to update category:', err)
      setError(getErrorMessage(err, 'Unable to update category.'))
    } finally {
      setSavingEditId(null)
    }
  }

  async function handleToggleStatus(category: Category) {
    const nextIsActive = !category.isActive
    // const action = nextIsActive ? 'activate' : 'deactivate'

    // const confirmed = window.confirm(
    //   `Are you sure you want to ${action} "${category.name}"?`,
    // )

    // if (!confirmed) {
    //   return
    // }

    try {
      setUpdatingStatusId(category.id)
      setError(null)
      setSuccess(null)

      const updatedCategory = await updateCategoryStatus(category.id, {
        isActive: nextIsActive,
      })

      // Update only this category without refetching the list.
      setCategories((current) =>
        current.map((item) =>
          item.id === updatedCategory.id ? updatedCategory : item,
        ),
      )

      setSuccess(
        `Category "${updatedCategory.name}" ${
          updatedCategory.isActive ? 'activated' : 'deactivated'
        } successfully.`,
      )
    } catch (err) {
      console.error('Failed to update category status:', err)
      setError(getErrorMessage(err, 'Unable to update category status.'))
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const activeCount = categories.filter(
    (category) => category.isActive,
  ).length

  const inactiveCount = categories.length - activeCount

  return (
    <main className="min-h-screen bg-background text-primary">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading and category statistics */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-accent">
              Content management
            </p>

            <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
              Category management
            </h1>

            <p className="mt-2 text-secondary">
              Organize the learning categories available on Ascend.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-border bg-surface px-3 py-3 sm:px-4">
              <p className="text-2xl font-semibold">{categories.length}</p>
              <p className="text-xs text-secondary">Total</p>
            </div>

            <div className="rounded-xl border border-border bg-surface px-3 py-3 sm:px-4">
              <p className="text-2xl font-semibold text-success">
                {activeCount}
              </p>
              <p className="text-xs text-secondary">Active</p>
            </div>

            <div className="rounded-xl border border-border bg-surface px-3 py-3 sm:px-4">
              <p className="text-2xl font-semibold text-secondary">
                {inactiveCount}
              </p>
              <p className="text-xs text-secondary">Inactive</p>
            </div>
          </div>
        </header>

        {/* Shared API feedback */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success"
          >
            <CheckCircle size={18} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Existing category creation form */}
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-background p-3">
              <Plus size={20} className="text-accent" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Create category</h2>
              <p className="mt-1 text-sm text-secondary">
                Add a category to organize courses and learning content.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium"
              >
                Category name <span className="text-error">*</span>
              </label>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setError(null)
                  setSuccess(null)
                }}
                placeholder="e.g. Psychology"
                minLength={2}
                maxLength={100}
                required
                disabled={isBusy}
                className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-primary outline-none placeholder:text-muted focus:border-accent disabled:opacity-50"
              />

              <p className="mt-1 text-right text-xs text-secondary">
                {name.trim().length}/100 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="category-description"
                className="mb-2 block text-sm font-medium"
              >
                Description{' '}
                <span className="text-secondary">(optional)</span>
              </label>

              <textarea
                id="category-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value)
                  setError(null)
                  setSuccess(null)
                }}
                placeholder="Describe what this category covers..."
                maxLength={500}
                rows={4}
                disabled={isBusy}
                className="w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm text-primary outline-none placeholder:text-muted focus:border-accent disabled:opacity-50"
              />

              <p className="mt-1 text-right text-xs text-secondary">
                {description.trim().length}/500 characters
              </p>
            </div>

            <div className="flex justify-end border-t border-border pt-5">
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Create category
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Admin list: includes both active and inactive categories */}
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">All categories</h2>
              <p className="mt-1 text-sm text-secondary">
                Edit category details or control their availability.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLoading(true)
                void fetchCategories()
              }}
              disabled={isLoading || isBusy}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isLoading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>

          <div className="mt-5 border-t border-border">
            {isLoading ? (
              <div
                role="status"
                className="flex items-center justify-center gap-3 py-16 text-secondary"
              >
                <RefreshCw size={20} className="animate-spin" />
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <FolderOpen size={36} className="mx-auto text-muted" />

                <h3 className="mt-4 text-lg font-semibold">
                  No categories yet
                </h3>

                <p className="mt-2 text-sm text-secondary">
                  Create your first category using the form above.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true)
                    void fetchCategories()
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {categories.map((category) => {
                  const isEditing = editingCategoryId === category.id
                  const isSaving = savingEditId === category.id
                  const isUpdatingStatus =
                    updatingStatusId === category.id

                  return (
                    <article
                      key={category.id}
                      className="py-5"
                    >
                      {isEditing ? (
                        /* Inline edit form */
                        <form
                          onSubmit={(event) =>
                            void handleSaveEdit(event, category)
                          }
                          className="space-y-4 rounded-xl border border-border bg-background p-4"
                        >
                          <div>
                            <label
                              htmlFor={`edit-name-${category.id}`}
                              className="mb-2 block text-sm font-medium"
                            >
                              Category name
                            </label>

                            <input
                              id={`edit-name-${category.id}`}
                              type="text"
                              value={editName}
                              onChange={(event) =>
                                setEditName(event.target.value)
                              }
                              minLength={2}
                              maxLength={100}
                              required
                              disabled={isSaving}
                              className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-sm outline-none placeholder:text-muted focus:border-accent disabled:opacity-50"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`edit-description-${category.id}`}
                              className="mb-2 block text-sm font-medium"
                            >
                              Description{' '}
                              <span className="text-secondary">
                                (optional)
                              </span>
                            </label>

                            <textarea
                              id={`edit-description-${category.id}`}
                              value={editDescription}
                              onChange={(event) =>
                                setEditDescription(event.target.value)
                              }
                              maxLength={500}
                              rows={3}
                              disabled={isSaving}
                              className="w-full resize-y rounded-xl border border-border bg-surface px-3 py-3 text-sm outline-none placeholder:text-muted focus:border-accent disabled:opacity-50"
                            />
                          </div>

                          <p className="text-xs text-secondary">
                            The slug is generated automatically from the
                            category name.
                          </p>

                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={isSaving}
                              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface disabled:opacity-50"
                            >
                              <X size={15} />
                              Cancel
                            </button>

                            <button
                              type="submit"
                              disabled={isSaving}
                              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                            >
                              {isSaving ? (
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Save size={15} />
                              )}
                              {isSaving ? 'Saving...' : 'Save changes'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Category details and actions */
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-1 rounded-lg bg-background p-2">
                              <FolderOpen
                                size={18}
                                className="text-accent"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold">
                                  {category.name}
                                </h3>

                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                    category.isActive
                                      ? 'bg-success/10 text-success'
                                      : 'bg-background text-secondary'
                                  }`}
                                >
                                  {category.isActive ? (
                                    <CheckCircle size={13} />
                                  ) : (
                                    <CircleSlash size={13} />
                                  )}
                                  {category.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>

                              <p className="mt-1 break-all text-sm text-secondary">
                                {category.slug}
                              </p>

                              {category.description && (
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-secondary">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                            <button
                              type="button"
                              onClick={() => startEditing(category)}
                              disabled={isBusy}
                              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleToggleStatus(category)
                              }
                              disabled={isBusy}
                              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                category.isActive
                                  ? 'border-error/20 text-error hover:bg-error/10'
                                  : 'border-success/20 text-success hover:bg-success/10'
                              }`}
                            >
                              {isUpdatingStatus ? (
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Power size={15} />
                              )}

                              {isUpdatingStatus
                                ? 'Updating...'
                                : category.isActive
                                  ? 'Deactivate'
                                  : 'Activate'}
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
