"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Badge } from "~/components/ui/badge"
import { AlertCircle, Check, Hash, Info, Plus, Trash2, X } from "lucide-react"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { parameterTypes, operators, mockProjects } from "~/lib/mock-data"

export function FeatureToggleDialog({ open, onOpenChange, toggle, onCreateToggle, onUpdateToggle, projectId = null }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enabled: false,
    strategy: "standard",
    rolloutPercentage: 0,
    userGroups: [],
    variants: [],
    parameters: [],
    projectId: projectId || "",
  })

  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (toggle) {
      setFormData({
        ...toggle,
        userGroups: toggle.userGroups || [],
        variants: toggle.variants || [],
        parameters: toggle.parameters || [],
        projectId: toggle.projectId || projectId || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        enabled: false,
        strategy: "standard",
        rolloutPercentage: 0,
        userGroups: [],
        variants: [],
        parameters: [],
        projectId: projectId || "",
      })
    }
    setErrors({})
    setActiveTab("basic")
  }, [toggle, open, projectId])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Toggle name is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only lowercase letters, numbers, and hyphens"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.strategy === "gradual" && (formData.rolloutPercentage < 0 || formData.rolloutPercentage > 100)) {
      newErrors.rolloutPercentage = "Percentage must be between 0 and 100"
    }

    if (!formData.projectId) {
      newErrors.projectId = "Project is required"
    }

    return newErrors
  }

  const handleSubmit = () => {
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)

      // Switch to the tab with errors
      if (validationErrors.name || validationErrors.description || validationErrors.projectId) {
        setActiveTab("basic")
      } else if (validationErrors.rolloutPercentage) {
        setActiveTab("targeting")
      }

      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      if (toggle) {
        onUpdateToggle({
          ...toggle,
          ...formData,
        })
      } else {
        onCreateToggle(formData)
      }

      setIsSubmitting(false)
      onOpenChange(false)
    }, 500)
  }

  const addUserGroup = (group) => {
    if (!formData.userGroups.includes(group)) {
      setFormData((prev) => ({
        ...prev,
        userGroups: [...prev.userGroups, group],
      }))
    }
  }

  const removeUserGroup = (group) => {
    setFormData((prev) => ({
      ...prev,
      userGroups: prev.userGroups.filter((g) => g !== group),
    }))
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{toggle ? "Edit Feature Toggle" : "Create Feature Toggle"}</DialogTitle>
          <DialogDescription>
            {toggle
              ? "Update the settings for this feature toggle."
              : "Configure a new feature toggle for your application."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="projectId" className="flex items-center justify-between">
                  Project
                  {errors.projectId && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.projectId}
                    </span>
                  )}
                </Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => handleChange("projectId", value)}
                  disabled={!!projectId}
                >
                  <SelectTrigger className={errors.projectId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center justify-between">
                  Toggle Name
                  {errors.name && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.name}
                    </span>
                  )}
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
                  {errors.description && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.description}
                    </span>
                  )}
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
                    Enabled
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Toggle will be {formData.enabled ? "active" : "inactive"} when created
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => handleChange("enabled", checked)}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Feature toggles should be temporary. Consider setting a review date to avoid toggle debt.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="strategy">Rollout Strategy</Label>
                <Select value={formData.strategy} onValueChange={(value) => handleChange("strategy", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (All users)</SelectItem>
                    <SelectItem value="gradual">Gradual rollout</SelectItem>
                    <SelectItem value="targeted">Targeted users</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-xs text-muted-foreground mt-1">
                  {formData.strategy === "standard" && "Feature will be enabled for all users when active"}
                  {formData.strategy === "gradual" && "Feature will be gradually rolled out to a percentage of users"}
                  {formData.strategy === "targeted" && "Feature will only be enabled for specific user groups"}
                </div>
              </div>

              {formData.strategy === "gradual" && (
                <div className="grid gap-2">
                  <Label htmlFor="rolloutPercentage" className="flex items-center justify-between">
                    Rollout Percentage: {formData.rolloutPercentage}%
                    {errors.rolloutPercentage && (
                      <span className="text-xs text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.rolloutPercentage}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="rolloutPercentage"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.rolloutPercentage}
                    onChange={(e) => handleChange("rolloutPercentage", Number.parseInt(e.target.value))}
                    className={errors.rolloutPercentage ? "border-destructive" : ""}
                  />
                  <div className="grid grid-cols-3 text-xs text-muted-foreground">
                    <div>0%</div>
                    <div className="text-center">50%</div>
                    <div className="text-right">100%</div>
                  </div>
                </div>
              )}

              {formData.strategy === "targeted" && (
                <div className="grid gap-2">
                  <Label htmlFor="userGroups">User Groups</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.userGroups.map((group) => (
                      <Badge key={group} variant="secondary" className="gap-1 py-1">
                        {group}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-transparent"
                          onClick={() => removeUserGroup(group)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {formData.userGroups.length === 0 && (
                      <p className="text-xs text-muted-foreground">No user groups selected</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => addUserGroup(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add user group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beta-testers">Beta Testers</SelectItem>
                        <SelectItem value="internal">Internal Users</SelectItem>
                        <SelectItem value="premium">Premium Users</SelectItem>
                        <SelectItem value="early-adopters">Early Adopters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Parameter-Based Rules</h3>
                  <p className="text-xs text-muted-foreground">
                    Control toggle activation based on specific parameters like user ID
                  </p>
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

              {formData.parameters.length > 0 ? (
                <div className="space-y-4">
                  {formData.parameters.map((parameter, index) => (
                    <div key={index} className="border rounded-md p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium flex items-center gap-1">
                          <Hash className="h-4 w-4" />
                          Parameter Rule {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveParameter(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`parameter-type-${index}`}>Parameter Type</Label>
                        <Select
                          value={parameter.type}
                          onValueChange={(value) => handleUpdateParameter(index, { ...parameter, type: value })}
                        >
                          <SelectTrigger id={`parameter-type-${index}`}>
                            <SelectValue placeholder="Select parameter type" />
                          </SelectTrigger>
                          <SelectContent>
                            {parameterTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`parameter-operator-${index}`}>Operator</Label>
                        <Select
                          value={parameter.operator}
                          onValueChange={(value) => handleUpdateParameter(index, { ...parameter, operator: value })}
                        >
                          <SelectTrigger id={`parameter-operator-${index}`}>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {operators.map((op) => (
                              <SelectItem key={op.id} value={op.id}>
                                {op.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`parameter-values-${index}`}>Values</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {parameter.values.map((value, valueIndex) => (
                            <Badge key={valueIndex} variant="secondary" className="gap-1 py-1">
                              {value}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-transparent"
                                onClick={() => {
                                  const updatedValues = [...parameter.values]
                                  updatedValues.splice(valueIndex, 1)
                                  handleUpdateParameter(index, { ...parameter, values: updatedValues })
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                          {parameter.values.length === 0 && (
                            <p className="text-xs text-muted-foreground">No values added</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id={`parameter-values-${index}`}
                            placeholder="Add value and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.target.value.trim()) {
                                e.preventDefault()
                                const newValue = e.target.value.trim()
                                handleUpdateParameter(index, {
                                  ...parameter,
                                  values: [...parameter.values, newValue],
                                })
                                e.target.value = ""
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Press Enter to add each value</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-6 text-center">
                  <Hash className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">No parameter rules configured</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Parameter rules allow you to target specific users or contexts
                  </p>
                  <Button
                    variant="outline"
                    className="gap-1"
                    onClick={() =>
                      handleAddParameter({
                        type: "userId",
                        values: [],
                        operator: "IN",
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add Parameter Rule
                  </Button>
                </div>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Parameter rules are evaluated at runtime when the toggle is requested with context data.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="variants">Variants</Label>
                <p className="text-sm text-muted-foreground">Configure A/B testing variants for this feature toggle.</p>
                <div className="border rounded-md p-4 bg-muted/20">
                  <div className="text-center py-4">
                    <p className="text-sm font-medium">No variants configured</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Variants allow you to test different versions of a feature
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Variant
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dependencies">Dependencies</Label>
                <p className="text-sm text-muted-foreground">Make this toggle dependent on other toggles.</p>
                <div className="border rounded-md p-4 bg-muted/20">
                  <div className="text-center py-4">
                    <p className="text-sm font-medium">No dependencies configured</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dependencies ensure this toggle is only active when other toggles are active
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Dependency
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="constraints">Constraints</Label>
                <p className="text-sm text-muted-foreground">
                  Add additional constraints for when this toggle should be active.
                </p>
                <div className="border rounded-md p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Time-based activation</span>
                    <Switch id="time-constraint" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Location-based</span>
                    <Switch id="location-constraint" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Device-based</span>
                    <Switch id="device-constraint" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="gap-1">
            {isSubmitting ? (
              <>Saving...</>
            ) : toggle ? (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create Toggle
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

