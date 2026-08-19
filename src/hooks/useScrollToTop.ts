import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the window to the top whenever the route pathname changes so that a
 * newly opened page starts at the top instead of keeping the previous scroll
 * position. When the URL contains a hash (e.g. an in-page anchor from the
 * documentation table of contents), the matching element is scrolled into view
 * instead, keeping existing anchor navigation working.
 */
export function useScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1))
      if (element) {
        element.scrollIntoView()
      }
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])
}