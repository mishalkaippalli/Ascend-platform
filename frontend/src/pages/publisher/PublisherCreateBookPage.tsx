
import { useEffect, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react'
import axios from 'axios'
import type { PublicCategory } from '../../types/category'
import type { CreateBookDTO } from '../../types/book'
import {
  createBook,
  getBookCategories,
} from '../../services/publisher/bookService'

interface BookFormErrors {
  title?: string
  description?: string
  authors?: string
  categoryIds?: string
  price?: string
  salePrice?: string
  language?: string
  previewText?: string
}

interface CreatedBook {
  id: string
  title: string
  slug: string
  status: 'draft'
}

const inputClasses =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60'

const labelClasses = 'mb-2 block text-sm font-medium text-primary'

const initialForm = {
  title: '',
  description: '',
  authors: [''],
  categoryIds: [] as string[],
  price: '',
  salePrice: '',
  language: 'en',
  previewText: '',
}

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      return 'Your session may have expired. Please sign in again.'
    }

    if (status === 403) {
      return 'Your publisher account may not be approved to create books yet.'
    }

    if (typeof message === 'string' && message.trim()) {
      return message
    }

    if (!error.response) {
      return 'Unable to connect to the server. Please check your connection and try again.'
    }
  }

  return 'Something went wrong. Please try again.'
}

// Prices must be non-negative and have at most two decimal places.
function isValidPrice(value: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(value.trim()) &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0
}

export default function PublisherCreateBookPage() {
  const [categories, setCategories] = useState<PublicCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState('')

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<BookFormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [createdBook, setCreatedBook] = useState<CreatedBook | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load active categories when the page mounts.
  useEffect(() => {
    let isActive = true

    async function loadCategories() {
      try {
        const result = await getBookCategories()

        if (isActive) {
          setCategories(result)
          setCategoryError('')
        }
      } catch (error) {
        if (isActive) {
          setCategoryError(getApiErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setIsLoadingCategories(false)
        }
      }
    }

    void loadCategories()

    // Prevent updates if the page unmounts before the request finishes.
    return () => {
      isActive = false
    }
  }, [])

  function updateField(
    field: 'title' | 'description' | 'price' | 'salePrice' | 'language' | 'previewText',
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
    setSuccessMessage('')
  }

  function updateAuthor(index: number, value: string) {
    setForm((current) => ({
      ...current,
      authors: current.authors.map((author, authorIndex) =>
        authorIndex === index ? value : author,
      ),
    }))

    setErrors((current) => ({ ...current, authors: undefined }))
    setSubmitError('')
    setSuccessMessage('')
  }

  function addAuthor() {
    if (form.authors.length >= 20) {
      setErrors((current) => ({
        ...current,
        authors: 'You can add a maximum of 20 authors.',
      }))
      return
    }

    setForm((current) => ({
      ...current,
      authors: [...current.authors, ''],
    }))

    setErrors((current) => ({ ...current, authors: undefined }))
  }

  function removeAuthor(index: number) {
    setForm((current) => ({
      ...current,
      authors: current.authors.filter(
        (_, authorIndex) => authorIndex !== index,
      ),
    }))

    setErrors((current) => ({ ...current, authors: undefined }))
  }

  function toggleCategory(categoryId: string) {
    setForm((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(categoryId)
        ? current.categoryIds.filter((id) => id !== categoryId)
        : [...current.categoryIds, categoryId],
    }))

    setErrors((current) => ({ ...current, categoryIds: undefined }))
    setSubmitError('')
    setSuccessMessage('')
  }

  function validateForm(): BookFormErrors {
    const nextErrors: BookFormErrors = {}

    const title = form.title.trim()
    const description = form.description.trim()
    const authors = form.authors.map((author) => author.trim())

    if (!title) {
      nextErrors.title = 'Book title is required.'
    } else if (title.length > 200) {
      nextErrors.title = 'Title cannot exceed 200 characters.'
    }

    if (!description) {
      nextErrors.description = 'Description is required.'
    } else if (description.length > 10000) {
      nextErrors.description = 'Description cannot exceed 10,000 characters.'
    }

    if (
      authors.length === 0 ||
      authors.some((author) => !author)
    ) {
      nextErrors.authors = 'Enter a name for every author.'
    } else if (authors.length > 20) {
      nextErrors.authors = 'You can add a maximum of 20 authors.'
    }

    if (form.categoryIds.length === 0) {
      nextErrors.categoryIds = 'Select at least one category.'
    }

    if (!form.price.trim()) {
      nextErrors.price = 'Price is required.'
    } else if (!isValidPrice(form.price)) {
      nextErrors.price =
        'Enter a valid non-negative price with up to two decimal places.'
    }

    if (form.salePrice.trim()) {
      if (!isValidPrice(form.salePrice)) {
        nextErrors.salePrice =
          'Enter a valid sale price with up to two decimal places.'
      } else if (
        isValidPrice(form.price) &&
        Number(form.salePrice) >= Number(form.price)
      ) {
        nextErrors.salePrice = 'Sale price must be lower than the regular price.'
      }
    }

    if (!form.language.trim()) {
      nextErrors.language = 'Language is required.'
    } else if (form.language.trim().length > 50) {
      nextErrors.language = 'Language cannot exceed 50 characters.'
    }

    if (form.previewText.trim().length > 5000) {
      nextErrors.previewText = 'Preview text cannot exceed 5,000 characters.'
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting || createdBook) {
    return
    }

    setSubmitError('')
    setSuccessMessage('')
    setCreatedBook(null)

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    // Convert price inputs from strings to numbers before sending them.
    const payload: CreateBookDTO = {
      title: form.title.trim(),
      description: form.description.trim(),
      authors: form.authors.map((author) => author.trim()),
      categoryIds: form.categoryIds,
      price: Number(form.price),
      language: form.language.trim(),
    }

    if (form.salePrice.trim()) {
      payload.salePrice = Number(form.salePrice)
    }

    if (form.previewText.trim()) {
      payload.previewText = form.previewText.trim()
    }

    setIsSubmitting(true)

    try {
      const result = await createBook(payload)

      setCreatedBook(result)
      setSuccessMessage('Your book draft was created successfully.')
      setErrors({})
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setForm(initialForm)
    setErrors({})
    setSubmitError('')
    setSuccessMessage('')
    setCreatedBook(null)
  }

  return (
    <main className="min-h-screen bg-background text-primary">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-accent">
            Publisher dashboard
          </p>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
            Create a book
          </h1>

          <p className="mt-3 max-w-2xl text-secondary">
            Add your book details and save a draft. You can manage its
            chapters in a later step.
          </p>
        </div>

        {/* Creation success */}
        {successMessage && createdBook && (
          <div
            role="status"
            className="mb-6 rounded-2xl border border-success/20 bg-success/10 p-5 text-success"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{successMessage}</h2>

                <p className="mt-1 text-sm">
                  <span className="font-medium">Book:</span>{' '}
                  {createdBook.title}
                </p>

                <p className="mt-1 break-all text-sm">
                  <span className="font-medium">Book ID:</span>{' '}
                  {createdBook.id}
                </p>

                <p className="mt-2 text-sm">
                  Status: <span className="font-semibold">Draft</span>.
                  Your book has not been published.
                </p>

                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-4 rounded-xl border border-success/30 px-4 py-2 text-sm font-medium transition hover:bg-success/10"
                >
                  Create another book
                </button>
              </div>
            </div>
          </div>
        )}

        {/* General submission error */}
        {submitError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-error/20 bg-error/10 p-4 text-error"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Basic details */}
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-background p-3">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Book details</h2>
                <p className="mt-1 text-sm text-secondary">
                  Introduce your book to potential readers.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="title" className={labelClasses}>
                  Book title <span className="text-error">*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  maxLength={200}
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="Enter the book title"
                  className={inputClasses}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />

                {errors.title && (
                  <p id="title-error" className="mt-2 text-sm text-error">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Description <span className="text-error">*</span>
                </label>

                <textarea
                  id="description"
                  rows={5}
                  maxLength={10000}
                  value={form.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  placeholder="Describe the book, its key ideas, and what readers will learn."
                  className={inputClasses}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? 'description-error' : undefined
                  }
                />

                <div className="mt-1 flex justify-between gap-3 text-xs text-secondary">
                  {errors.description ? (
                    <p id="description-error" className="text-error">
                      {errors.description}
                    </p>
                  ) : (
                    <span>Give readers a clear overview.</span>
                  )}

                  <span>{form.description.length}/10,000</span>
                </div>
              </div>

              {/* Authors can be added or removed dynamically. */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className={labelClasses}>
                    Authors <span className="text-error">*</span>
                  </label>

                  <button
                    type="button"
                    onClick={addAuthor}
                    disabled={form.authors.length >= 20}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-accent transition hover:bg-background disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add author
                  </button>
                </div>

                <div className="space-y-3">
                  {form.authors.map((author, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={author}
                        onChange={(event) =>
                          updateAuthor(index, event.target.value)
                        }
                        placeholder={`Author ${index + 1} name`}
                        className={inputClasses}
                        aria-label={`Author ${index + 1}`}
                        aria-invalid={Boolean(errors.authors)}
                      />

                      {form.authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAuthor(index)}
                          className="rounded-xl border border-border p-3 text-secondary transition hover:bg-background hover:text-error"
                          aria-label={`Remove author ${index + 1}`}
                          title="Remove author"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {errors.authors && (
                  <p className="mt-2 text-sm text-error">
                    {errors.authors}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Category selection */}
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <h2 className="text-lg font-semibold">Categories</h2>

            <p className="mt-1 text-sm text-secondary">
              Select all categories that describe your book.
            </p>

            <div className="mt-4">
              {isLoadingCategories ? (
                <div className="flex items-center gap-2 py-4 text-sm text-secondary">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading categories...
                </div>
              ) : categoryError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error"
                >
                  <p>{categoryError}</p>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoadingCategories(true)
                      setCategoryError('')

                      try {
                        const result = await getBookCategories()
                        setCategories(result)
                      } catch (error) {
                        setCategoryError(getApiErrorMessage(error))
                      } finally {
                        setIsLoadingCategories(false)
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-2 font-medium underline"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                  </button>
                </div>
              ) : categories.length === 0 ? (
                <div className="rounded-xl border border-border p-4 text-sm text-secondary">
                  No active categories are available yet. Please try again
                  later or contact the administrator.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => {
                    const isSelected = form.categoryIds.includes(category.id)

                    return (
                      <label
                        key={category.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                          isSelected
                            ? 'border-accent bg-background'
                            : 'border-border hover:bg-background'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCategory(category.id)}
                          className="mt-1 h-4 w-4 accent-current"
                        />

                        <span className="min-w-0">
                          <span className="block font-medium">
                            {category.name}
                          </span>

                          {category.description && (
                            <span className="mt-1 block text-sm text-secondary">
                              {category.description}
                            </span>
                          )}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}

              {errors.categoryIds && (
                <p className="mt-3 text-sm text-error">
                  {errors.categoryIds}
                </p>
              )}

              {categories.length > 0 && (
                <p className="mt-3 text-sm text-secondary">
                  {form.categoryIds.length} categor
                  {form.categoryIds.length === 1 ? 'y' : 'ies'} selected
                </p>
              )}
            </div>
          </section>

          {/* Pricing and language */}
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <h2 className="text-lg font-semibold">Pricing and language</h2>

            <p className="mt-1 text-sm text-secondary">
              Set the regular price and an optional discounted price.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className={labelClasses}>
                  Price (₹) <span className="text-error">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                    ₹
                  </span>

                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    placeholder="499.00"
                    className={`${inputClasses} pl-9`}
                    aria-invalid={Boolean(errors.price)}
                  />
                </div>

                {errors.price && (
                  <p className="mt-2 text-sm text-error">{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="salePrice" className={labelClasses}>
                  Sale price (₹)
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                    ₹
                  </span>

                  <input
                    id="salePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={form.salePrice}
                    onChange={(event) =>
                      updateField('salePrice', event.target.value)
                    }
                    placeholder="Optional"
                    className={`${inputClasses} pl-9`}
                    aria-invalid={Boolean(errors.salePrice)}
                  />
                </div>

                {errors.salePrice ? (
                  <p className="mt-2 text-sm text-error">
                    {errors.salePrice}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-secondary">
                    Must be lower than the regular price.
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="language" className={labelClasses}>
                  Language <span className="text-error">*</span>
                </label>

                <input
                  id="language"
                  type="text"
                  maxLength={50}
                  value={form.language}
                  onChange={(event) =>
                    updateField('language', event.target.value)
                  }
                  placeholder="e.g. en"
                  className={inputClasses}
                  aria-invalid={Boolean(errors.language)}
                />

                {errors.language ? (
                  <p className="mt-2 text-sm text-error">{errors.language}</p>
                ) : (
                  <p className="mt-2 text-xs text-secondary">
                    Enter the language code or name, such as en or English.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Optional reader preview */}
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Preview text</h2>
                <p className="mt-1 text-sm text-secondary">
                  Add a sample of your book for readers.
                </p>
              </div>

              <span className="rounded-full border border-border px-3 py-1 text-xs text-secondary">
                Optional
              </span>
            </div>

            <textarea
              id="previewText"
              rows={5}
              maxLength={5000}
              value={form.previewText}
              onChange={(event) =>
                updateField('previewText', event.target.value)
              }
              placeholder="Enter a short sample from your book..."
              className={`${inputClasses} mt-4`}
              aria-invalid={Boolean(errors.previewText)}
            />

            <div className="mt-1 flex justify-between gap-3 text-xs text-secondary">
              {errors.previewText ? (
                <p className="text-error">{errors.previewText}</p>
              ) : (
                <span>Help readers understand what is inside.</span>
              )}

              <span>{form.previewText.length}/5,000</span>
            </div>
          </section>

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={
                isSubmitting ||
                Boolean(createdBook) ||
                isLoadingCategories ||
                Boolean(categoryError) ||
                categories.length === 0
             }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-medium transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Reset form
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isLoadingCategories ||
                Boolean(categoryError) ||
                categories.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating draft...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create draft
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-secondary">
            Your book will be saved as a draft. Creating it does not publish it.
          </p>
        </form>
      </div>
    </main>
  )
}
