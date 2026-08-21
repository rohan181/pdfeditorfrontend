import { cn } from '@/lib/cn'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3'
  inverse?: boolean
}

export function Heading({ as: Tag = 'h2', inverse = false, className, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn('ui-heading', `ui-heading--${Tag}`, inverse && 'ui-heading--inverse', className)}
      {...props}
    />
  )
}

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div'
  size?: 'large' | 'body' | 'small'
  tone?: 'default' | 'muted' | 'inverse'
}

export function Text({
  as: Tag = 'p',
  size = 'body',
  tone = 'default',
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        'ui-text',
        `ui-text--${size}`,
        tone !== 'default' && `ui-text--${tone}`,
        className,
      )}
      {...props}
    />
  )
}

export function Eyebrow(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn('ui-eyebrow', props.className)} />
}
