import { Outlet } from 'react-router-dom'

import { PublicFooter } from './PublicFooter'
import { PublicNavbar } from './PublicNavbar'
import { ScrollToTop } from '@/components/common/ScrollToTop'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <PublicNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  )
}