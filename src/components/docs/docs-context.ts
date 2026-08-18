import { createContext, useContext } from 'react'
import type { DocHeading } from '@/lib/docs'

interface DocsContextValue {
  headings: DocHeading[]
  setHeadings: (headings: DocHeading[]) => void
}

export const DocsContext = createContext<DocsContextValue>({
  headings: [],
  setHeadings: () => {},
})

export const useDocsContext = () => useContext(DocsContext)