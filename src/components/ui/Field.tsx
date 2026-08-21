import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn('ui-input', className)} {...props} />
})

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn('ui-textarea', className)} {...props} />
})

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  htmlFor: string
  hint?: string
  error?: string
}

export function Field({ label, htmlFor, hint, error, className, children, ...props }: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined
  const errorId = error ? `${htmlFor}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const labelledControl = Children.map(children, child => {
    if (!isValidElement<React.InputHTMLAttributes<HTMLInputElement>>(child)) return child
    return cloneElement(child, {
      id: child.props.id ?? htmlFor,
      'aria-describedby': child.props['aria-describedby'] ?? describedBy,
      'aria-invalid': child.props['aria-invalid'] ?? (error ? true : undefined),
    })
  })

  return (
    <div className={cn('ui-field', className)} {...props}>
      <label className="ui-label" htmlFor={htmlFor}>{label}</label>
      {labelledControl}
      {hint && <p className="ui-field-hint" id={hintId}>{hint}</p>}
      {error && <p className="ui-field-error" id={errorId} role="alert">{error}</p>}
    </div>
  )
}
