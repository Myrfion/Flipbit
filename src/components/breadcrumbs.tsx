import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
  active?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      <ol className="flex items-center space-x-1">
        <li>
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4" />
            <Link
              href={item.href}
              className={`hover:text-foreground transition-colors ${item.active ? "font-medium text-foreground" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

