import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type ContainerSize = 'wide' | 'narrow' | 'reading'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  flush?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'wide', flush = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'ui-container',
        size !== 'wide' && `ui-container--${size}`,
        flush && 'ui-container--flush',
        className,
      )}
      {...props}
    />
  )
})
