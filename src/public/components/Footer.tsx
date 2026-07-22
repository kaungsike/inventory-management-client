import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

const footerLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
]


const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Brand */}
          <Link to="/" className="text-sm font-semibold tracking-tight">
            MyApp
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MyApp. All rights reserved.
          </p>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-xs text-muted-foreground">
          Built with React & shadcn/ui
        </p>
      </div>
    </footer>
  )
}

export default Footer