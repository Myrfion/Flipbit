"use client"

import { Button } from "~/components/ui/button"
import { Flag, Plus } from "lucide-react"

export function EmptyState({ onCreateToggle }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <Flag className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No feature toggles yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Feature toggles help you control the rollout of new features and manage your application's behavior without
        deploying new code.
      </p>
      <Button onClick={onCreateToggle} className="gap-2">
        <Plus className="h-4 w-4" />
        Create your first toggle
      </Button>
    </div>
  )
}

