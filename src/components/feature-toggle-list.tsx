"use client"

import { useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import {
  AlertCircle,
  ChevronDown,
  Clock,
  Edit,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
  Hash,
} from "lucide-react"
import { FeatureToggleDialog } from "./feature-toggle-dialog"
import { mockFeatureToggles } from "~/lib/mock-data"

export function FeatureToggleList({
  toggles = mockFeatureToggles,
  onOpenToggleDialog = null,
  onCreateToggle = null,
  onUpdateToggle = null,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedToggle, setSelectedToggle] = useState(null)
  const [localToggles, setLocalToggles] = useState(toggles)

  const filteredToggles = localToggles.filter((toggle) => {
    if (activeTab === "active" && !toggle.enabled) return false
    if (activeTab === "inactive" && toggle.enabled) return false
    if (activeTab === "stale" && !toggle.stale) return false

    return (
      toggle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toggle.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleToggleChange = (id, enabled) => {
    const updatedToggles = localToggles.map((toggle) => (toggle.id === id ? { ...toggle, enabled } : toggle))

    setLocalToggles(updatedToggles)

    if (onUpdateToggle) {
      const toggleToUpdate = updatedToggles.find((t) => t.id === id)
      onUpdateToggle(toggleToUpdate)
    }
  }

  const openToggleDialog = (toggle = null) => {
    if (onOpenToggleDialog) {
      onOpenToggleDialog(toggle)
    } else {
      setSelectedToggle(toggle)
      setIsDialogOpen(true)
    }
  }

  const handleCreateToggle = (newToggle) => {
    if (onCreateToggle) {
      onCreateToggle(newToggle)
    } else {
      // Generate a new ID (in a real app this would come from the backend)
      const id = (localToggles.length + 1).toString()

      // Add creation date and default values
      const createdToggle = {
        ...newToggle,
        id,
        createdAt: "Just now",
        stale: false,
        dependencies: [],
        parameters: newToggle.parameters || [],
      }

      // Add the new toggle to the list
      setLocalToggles([createdToggle, ...localToggles])
      setIsDialogOpen(false)
    }
  }

  const handleUpdateToggle = (updatedToggle) => {
    if (onUpdateToggle) {
      onUpdateToggle(updatedToggle)
    } else {
      setLocalToggles(
        localToggles.map((toggle) => (toggle.id === updatedToggle.id ? { ...toggle, ...updatedToggle } : toggle)),
      )
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 relative md:hidden">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search toggles..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="stale">Stale</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
              <DropdownMenuItem>Created (Newest)</DropdownMenuItem>
              <DropdownMenuItem>Created (Oldest)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="gap-1" onClick={() => openToggleDialog()}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Toggle</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredToggles.length > 0 ? (
          filteredToggles.map((toggle) => (
            <Card key={toggle.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      {toggle.name}
                      {toggle.stale && (
                        <Badge
                          variant="outline"
                          className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Stale
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{toggle.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={toggle.enabled}
                      onCheckedChange={(checked) => handleToggleChange(toggle.id, checked)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openToggleDialog(toggle)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3 text-sm">
                  {toggle.strategy === "gradual" && (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {toggle.rolloutPercentage}% of users
                    </Badge>
                  )}
                  {toggle.strategy === "targeted" && (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      Targeted users
                    </Badge>
                  )}
                  {toggle.parameters && toggle.parameters.length > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <Hash className="h-3 w-3" />
                      {toggle.parameters.length} parameter rule{toggle.parameters.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {toggle.dependencies.length > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {toggle.dependencies.length} dependencies
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-muted-foreground">
                    Created {toggle.createdAt}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No feature toggles found</p>
            <Button variant="outline" className="mt-4" onClick={() => openToggleDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first toggle
            </Button>
          </div>
        )}
      </div>

      {!onOpenToggleDialog && (
        <FeatureToggleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          toggle={selectedToggle}
          onCreateToggle={handleCreateToggle}
          onUpdateToggle={handleUpdateToggle}
        />
      )}
    </div>
  )
}

