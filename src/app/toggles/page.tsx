"use client"

import { useState } from "react"
import { Header } from "~/components/header"
import { Sidebar } from "~/components/sidebar"
import { FeatureToggleList } from "~/components/feature-toggle-list"
import { FeatureToggleDialog } from "~/components/feature-toggle-dialog"
import { mockFeatureToggles } from "~/lib/mock-data"

export default function TogglesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedToggle, setSelectedToggle] = useState(null)
  const [toggles, setToggles] = useState(mockFeatureToggles)

  const openToggleDialog = (toggle = null) => {
    setSelectedToggle(toggle)
    setIsDialogOpen(true)
  }

  const handleCreateToggle = (newToggle) => {
    // Generate a new ID (in a real app this would come from the backend)
    const id = (toggles.length + 1).toString()

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
    setToggles([createdToggle, ...toggles])
    setIsDialogOpen(false)
  }

  const handleUpdateToggle = (updatedToggle) => {
    setToggles(toggles.map((toggle) => (toggle.id === updatedToggle.id ? { ...toggle, ...updatedToggle } : toggle)))
    setIsDialogOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          breadcrumbs={[{ label: "Feature Toggles", href: "/toggles", active: true }]}
          createButtonLabel="New Toggle"
          createButtonLink="#"
          createButtonOnClick={() => openToggleDialog()}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <FeatureToggleList
            toggles={toggles}
            onOpenToggleDialog={openToggleDialog}
            onCreateToggle={handleCreateToggle}
            onUpdateToggle={handleUpdateToggle}
          />

          <FeatureToggleDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            toggle={selectedToggle}
            onCreateToggle={handleCreateToggle}
            onUpdateToggle={handleUpdateToggle}
          />
        </main>
      </div>
    </div>
  )
}

