"use client"

import { Button } from "~/components/ui/button"
import { BarChart3, Flag, Home, Layers, Settings, Users, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Flag className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">FeatureFlags</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Button variant={isActive("/") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button variant={isActive("/projects") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
          <Link href="/projects">
            <Layers className="mr-2 h-4 w-4" />
            Projects
          </Link>
        </Button>
        <Button variant={isActive("/toggles") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
          <Link href="/toggles">
            <Flag className="mr-2 h-4 w-4" />
            All Toggles
          </Link>
        </Button>
        <Button variant={isActive("/metrics") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
          <Link href="/metrics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Metrics
          </Link>
        </Button>
        <Button variant={isActive("/users") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
          <Link href="/users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </Link>
        </Button>
        <Button variant={isActive("/settings") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </nav>
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

