"use client"
import { useRouter } from "next/navigation"
import { FeatureToggleWizard } from "~/components/feature-toggle-wizard"

export default function CreateTogglePage() {
  const router = useRouter()

  const handleComplete = (formData) => {
    // In a real app, this would be an API call
    console.log("Creating toggle:", formData)

    // Redirect back to the main page
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="container py-8 max-w-5xl">
      <FeatureToggleWizard onComplete={handleComplete} onCancel={handleCancel} />
    </div>
  )
}

