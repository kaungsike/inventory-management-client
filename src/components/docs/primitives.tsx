import type * as React from 'react'

import { cn } from '@/lib/utils'

export function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('mb-3 mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground first:mt-0', className)}>
      {children}
    </h2>
  )
}

export function H3({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('mb-2 mt-8 scroll-mt-24 text-base font-semibold text-foreground', className)}>
      {children}
    </h3>
  )
}

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('my-3 text-[0.925rem] leading-7 text-muted-foreground', className)}>{children}</p>
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-base leading-7 text-foreground">{children}</p>
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}

export function UL({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn('my-3 space-y-2', className)}>{children}</ul>
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[0.925rem] leading-6 text-muted-foreground">
      <span className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-primary/70" />
      <span>{children}</span>
    </li>
  )
}

export function OL({ children }: { children: React.ReactNode }) {
  return (
    <ol className="my-3 list-decimal space-y-2 pl-5 text-[0.925rem] leading-6 text-muted-foreground marker:font-medium marker:text-primary">
      {children}
    </ol>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.82em] font-medium text-foreground">
      {children}
    </code>
  )
}

interface TableProps {
  head: string[]
  rows: React.ReactNode[][]
}

export function Table({ head, rows }: TableProps) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-medium text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 align-top text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ExampleBox({ children }: { children: React.ReactNode }) {
  return <div className="my-4 space-y-3 rounded-xl border border-border bg-muted/30 p-4">{children}</div>
}

export function Hr() {
  return <hr className="my-8 border-border" />
}