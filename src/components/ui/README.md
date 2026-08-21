# EditPDF AI UI system

The canonical design tokens live in `src/app/globals.css`. New UI should use
the components exported by `@/components/ui` and CSS custom properties instead
of adding page-specific hex values, font stacks, control heights, or shadows.

## Brand and semantic tokens

- Core actions: `--color-primary` and `--color-primary-*`
- AI and Pro: `--color-secondary`, `--color-pro`, and their soft surfaces
- Canvas and cards: `--color-canvas`, `--color-surface`, `--color-surface-subtle`
- Copy: `--color-text`, `--color-text-secondary`, `--color-text-muted`
- Feedback: `--color-success`, `--color-warning`, `--color-error` plus `*-soft`
- Borders and focus: `--color-border-*`, `--color-focus`, `--shadow-focus`

The foreground and light-surface pairs are selected to meet WCAG AA contrast.
Do not use muted text on dark surfaces; use the inverse text tokens/classes.

## Layout and type

- Standard page maximum: `--container-max` (1200px)
- Reading measure: `--container-reading` (720px)
- Narrow application content: `--container-narrow` (860px)
- Heading family: Plus Jakarta Sans via `--font-heading`
- Body and UI family: DM Sans via `--font-body` and `--font-ui`
- Use `Heading`, `Text`, and `Eyebrow` for the shared H1/H2/H3/body scale.

## Components

```tsx
import {
  Button,
  ButtonLink,
  Card,
  CardLink,
  Container,
  Field,
  Heading,
  Input,
  Text,
} from '@/components/ui'
```

Button variants are `primary`, `secondary`, `ghost`, `destructive`, and `pro`.
Sizes are `small`, `medium`, and `large`; all are at least 44px high.

Card variants are `tool`, `guide`, `pricing`, `pro`, and `info`. Use the
`interactive` property only when the entire card performs an action.

Inputs are 48px high and use the global visible focus treatment. Pair them with
`Field` so labels, hints, and errors remain programmatically connected.

## Motion and effects

Use `--motion-fast`, `--motion-base`, or `--motion-slow`. Prefer color, border,
and shadow changes. Reserve the existing brand gradient for high-value hero or
conversion surfaces, and avoid adding blur, glass, or continuous animation.
