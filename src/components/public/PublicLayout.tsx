import { Outlet } from 'react-router-dom'

import { PublicFooter } from './PublicFooter'
import { PublicNavbar } from './PublicNavbar'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  )
}