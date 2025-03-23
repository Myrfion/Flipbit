import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { Breadcrumbs } from "./breadcrumbs"

interface HeaderProps {
  breadcrumbs?: Array<{ label: string; href: string; active?: boolean }>
  showSearch?: boolean
  showEnvironmentSelector?: boolean
  showCreateButton?: boolean
  createButtonLink?: string
  createButtonLabel?: string
}

export function Header({
  breadcrumbs = [],
  showSearch = true,
  showEnvironmentSelector = true,
  showCreateButton = true,
  createButtonLink = "#create-toggle",
  createButtonLabel = "New Toggle",
}: HeaderProps) {
  return (
    <header className="border-b border-border p-4">
      <div className="flex flex-col gap-2">
        {breadcrumbs.length > 0 && (
          <div className="mb-1">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">
              {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Feature Toggles"}
            </h1>
            {showSearch && (
              <div className="hidden md:flex items-center gap-2 relative">
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-[300px] pl-8" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showEnvironmentSelector && (
              <Select defaultValue="production">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            )}
            {showCreateButton && (
              <Button className="gap-1" asChild>
                <Link href={createButtonLink}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{createButtonLabel}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

