import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  center?: boolean
}

export function SectionHeading({ eyebrow, title, description, center }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10', center && 'mx-auto max-w-2xl text-center')}>
      {eyebrow && <p className="text-xs font-medium tracking-widest text-primary uppercase">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>}
    </div>
  )
}