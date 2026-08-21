import Link from 'next/link'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type CardVariant = 'default' | 'tool' | 'guide' | 'pricing' | 'pro' | 'info'

type CardStyleProps = {
  variant?: CardVariant
  interactive?: boolean
}

export function cardClassName({ variant = 'default', interactive = false }: CardStyleProps = {}) {
  return cn(
    'ui-card',
    variant === 'pro' && 'ui-card--pricing',
    variant !== 'default' && `ui-card--${variant}`,
    interactive && 'ui-card--interactive',
  )
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardStyleProps {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', interactive = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardClassName({ variant, interactive }), className)}
      {...props}
    />
  )
})

export type CardLinkProps = React.ComponentProps<typeof Link> & CardStyleProps

export function CardLink({
  variant = 'default',
  interactive = true,
  className,
  ...props
}: CardLinkProps) {
  return (
    <Link
      className={cn('ui-card-link', cardClassName({ variant, interactive }), className)}
      {...props}
    />
  )
}
