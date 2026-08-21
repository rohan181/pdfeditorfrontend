import Link from 'next/link'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'pro'
export type ButtonSize = 'small' | 'medium' | 'large'

type ButtonStyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function buttonClassName({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}: ButtonStyleProps = {}) {
  return cn(
    'ui-button',
    `ui-button--${variant}`,
    size !== 'medium' && `ui-button--${size}`,
    fullWidth && 'ui-button--full',
  )
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'medium', fullWidth = false, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonClassName({ variant, size, fullWidth }), className)}
      {...props}
    />
  )
})

export type ButtonLinkProps = React.ComponentProps<typeof Link> & ButtonStyleProps

export function ButtonLink({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonClassName({ variant, size, fullWidth }), className)}
      {...props}
    />
  )
}
