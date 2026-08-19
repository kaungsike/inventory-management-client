import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BookOpenIcon, MenuIcon } from 'lucide-react'

import { DocsContext } from './docs-context'
import { DocsSearch } from './DocsSearch'
import { DocsSidebar } from './DocsSidebar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { GUIDE_PAGES, guidePath, type DocHeading } from '@/lib/docs'

const GUIDE_GROUPS = [{ label: 'Guides', items: GUIDE_PAGES }]

export function GuideLayout() {
  const [headings, setHeadings] = useState<DocHeading[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (location.hash) return
    mainRef.current?.scrollTo({ top: 0, left: 0 })
  }, [location.pathname, location.hash])

  return (
    <DocsContext.Provider value={{ headings, setHeadings }}>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:px-8">
        <div className="mb-6 flex shrink-0 items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<Button variant="outline" size="icon" className="lg:hidden" aria-label="Open user guide menu" />}
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>User Guide</SheetTitle>
                  <SheetDescription>Step-by-step instructions for using the system</SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <DocsSearch pages={GUIDE_PAGES} pathFn={guidePath} placeholder="Search the guide..." />
                </div>
                <div className="flex-1 overflow-y-auto px-2 pb-6">
                  <DocsSidebar groups={GUIDE_GROUPS} pathFn={guidePath} onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              <BookOpenIcon className="size-5 text-muted-foreground" />
              User Guide
            </h1>
          </div>
          <div className="hidden w-64 sm:block">
            <DocsSearch pages={GUIDE_PAGES} pathFn={guidePath} placeholder="Search the guide..." />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-10">
          <aside className="hidden w-52 shrink-0 lg:block lg:overflow-y-auto lg:pb-6">
            <DocsSidebar groups={GUIDE_GROUPS} pathFn={guidePath} />
          </aside>

          <main ref={mainRef} className="min-w-0 flex-1 pb-16 lg:overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </DocsContext.Provider>
  )
}