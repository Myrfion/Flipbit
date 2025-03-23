"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Check, ChevronLeft, ChevronRight, Flag, Hash, Info, Plus } from "lucide-react"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { ParameterRules } from "./parameter-rules"
import { parameterTypes } from "~/lib/mock-data"

export function FeatureToggleWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enabled: false,
    strategy: "standard",
    rolloutPercentage: 0,
    parameters: [],
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Toggle name is required"
      } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
        newErrors.name = "Name must contain only lowercase letters, numbers, and hyphens"
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    if (validateStep(step)) {
      onComplete(formData)
    }
  }

  const handleAddParameter = (parameter) => {
    setFormData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, parameter],
    }))
  }

  const handleUpdateParameter = (index, updatedParameter) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param, i) => (i === index ? updatedParameter : param)),
    }))
  }

  const handleRemoveParameter = (index) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Flag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Create Feature Toggle</CardTitle>
            <CardDescription>Set up a new feature toggle in {step === 4 ? "3" : step} easy steps</CardDescription>
          </div>
        </div>
        <div className="flex justify-between text-sm mt-4">
          <div
            className={`flex items-center gap-1 ${step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              1
            </div>
            <span className="hidden sm:inline">Basic Info</span>
          </div>
          <div className="h-px bg-muted flex-1 mx-2 self-center"></div>
          <div
            className={`flex items-center gap-1 ${step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              2
            </div>
            <span className="hidden sm:inline">Targeting</span>
          </div>
          <div className="h-px bg-muted flex-1 mx-2 self-center"></div>
          <div
            className={`flex items-center gap-1 ${step >= 3 ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              3
            </div>
            <span className="hidden sm:inline">Parameters</span>
          </div>
          <div className="h-px bg-muted flex-1 mx-2 self-center"></div>
          <div
            className={`flex items-center gap-1 ${step >= 4 ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              4
            </div>
            <span className="hidden sm:inline">Review</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center justify-between">
                Toggle Name
                {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., new-checkout-flow"
                className={errors.name ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">Use lowercase letters, numbers, and hyphens only</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="flex items-center justify-between">
                Description
                {errors.description && <span className="text-xs text-destructive">{errors.description}</span>}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what this toggle controls..."
                rows={3}
                className={errors.description ? "border-destructive" : ""}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enabled" className="block">
                  Initial State
                </Label>
                <p className="text-xs text-muted-foreground">Should this toggle be enabled when created?</p>
              </div>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => handleChange("enabled", checked)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="strategy">Rollout Strategy</Label>
              <RadioGroup
                value={formData.strategy}
                onValueChange={(value) => handleChange("strategy", value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="standard" className="font-medium">
                      Standard (All users)
                    </Label>
                    <p className="text-sm text-muted-foreground">Feature will be enabled for all users when active</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="gradual" id="gradual" className="mt-1" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="gradual" className="font-medium">
                      Gradual rollout
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Feature will be gradually rolled out to a percentage of users
                    </p>
                    {formData.strategy === "gradual" && (
                      <div className="mt-2">
                        <Label htmlFor="rolloutPercentage" className="text-sm">
                          Rollout Percentage: {formData.rolloutPercentage}%
                        </Label>
                        <Input
                          id="rolloutPercentage"
                          type="range"
                          min="0"
                          max="100"
                          value={formData.rolloutPercentage}
                          onChange={(e) => handleChange("rolloutPercentage", Number.parseInt(e.target.value))}
                          className="mt-1"
                        />
                        <div className="grid grid-cols-3 text-xs text-muted-foreground">
                          <div>0%</div>
                          <div className="text-center">50%</div>
                          <div className="text-right">100%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="targeted" id="targeted" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="targeted" className="font-medium">
                      Targeted users
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Feature will only be enabled for specific user groups
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Parameter rules allow you to control toggle activation based on specific parameters like user ID.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  Parameter Rules
                </h3>
                <p className="text-xs text-muted-foreground">Add rules to control when this toggle is active</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() =>
                  handleAddParameter({
                    type: "userId",
                    values: [],
                    operator: "IN",
                  })
                }
              >
                <Plus className="h-3 w-3" />
                Add Rule
              </Button>
            </div>

            <ParameterRules
              parameters={formData.parameters}
              onAddParameter={handleAddParameter}
              onUpdateParameter={handleUpdateParameter}
              onRemoveParameter={handleRemoveParameter}
            />

            {formData.parameters.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No parameter rules added yet. Parameter rules are optional.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>Review your feature toggle configuration before creating it.</AlertDescription>
            </Alert>

            <div className="border rounded-md p-4 space-y-3">
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Name</div>
                <div className="text-sm col-span-2">{formData.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Description</div>
                <div className="text-sm col-span-2">{formData.description}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Initial State</div>
                <div className="text-sm col-span-2">{formData.enabled ? "Enabled" : "Disabled"}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Strategy</div>
                <div className="text-sm col-span-2">
                  {formData.strategy === "standard" && "Standard (All users)"}
                  {formData.strategy === "gradual" && `Gradual rollout (${formData.rolloutPercentage}%)`}
                  {formData.strategy === "targeted" && "Targeted users"}
                </div>
              </div>
              {formData.parameters.length > 0 && (
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Parameter Rules</div>
                  <div className="text-sm col-span-2">
                    {formData.parameters.map((param, index) => (
                      <div key={index} className="mb-1">
                        {parameterTypes.find((t) => t.id === param.type)?.name || param.type} {param.operator}{" "}
                        {param.values.join(", ")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}

        {step < 4 ? (
          <Button onClick={nextStep} className="gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-1">
            <Check className="h-4 w-4" />
            Create Toggle
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

