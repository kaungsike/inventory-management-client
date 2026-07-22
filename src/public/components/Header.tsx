import { Link, NavLink, useNavigate } from "react-router-dom"
import { MoonIcon, SunIcon, MenuIcon, LogOutIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/authStore"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

const Header = ({ onToggleDark }: { onToggleDark?: () => void }) => {
  const navigate = useNavigate()
  const student = useAuthStore((s) => s.student)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const token = useAuthStore((s) => s.token)

  console.log(token, "token in header")

  const initials = student?.student_name
    ? student.student_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold tracking-tight">
          MyApp
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button variant="ghost" size="icon" onClick={onToggleDark}>
            <SunIcon className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle dark mode</span>
          </Button>

          {/* Auth area */}
          {student ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={student.profile_image_url ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* User info — plain div, not a menu item */}
                <div className="border-b px-3 py-2">
                  <p className="text-sm font-medium">{student.student_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.email}
                  </p>
                </div>
                <Link to="/student/profile" className="w-full">
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link to="/login" className="w-full" onClick={handleLogout}>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                {/* Mobile profile summary */}
                {student && (
                  <div className="flex items-center gap-3 pt-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={student.profile_image_url ?? undefined}
                      />
                      <AvatarFallback className="text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {student.student_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                )}
                <nav className="flex flex-col gap-4">
                  {navLinks.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors hover:text-primary ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                  {student ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start px-0"
                        onClick={() => navigate("/student/profile")}
                      >
                        <UserIcon className="mr-2 h-4 w-4" /> Profile
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start px-0 text-destructive hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
