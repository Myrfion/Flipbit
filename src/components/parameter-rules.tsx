"use client"

import { useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Hash, Plus, Trash2, X } from "lucide-react"
import { parameterTypes, operators } from "~/lib/mock-data"

export function ParameterRules({ parameters = [], onAddParameter, onUpdateParameter, onRemoveParameter }) {
  const [newParameterType, setNewParameterType] = useState("userId")

  const handleAddParameter = () => {
    onAddParameter({
      type: newParameterType,
      values: [],
      operator: "IN",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Parameter Rules</h3>
        <div className="flex gap-2">
          <Select value={newParameterType} onValueChange={setNewParameterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select parameter" />
            </SelectTrigger>
            <SelectContent>
              {parameterTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleAddParameter}>
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      </div>

      {parameters.length > 0 ? (
        <div className="space-y-3">
          {parameters.map((parameter, index) => (
            <div key={index} className="border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  {parameterTypes.find((t) => t.id === parameter.type)?.name || parameter.type}
                </h4>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveParameter(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`parameter-type-${index}`}>Parameter</Label>
                  <Select
                    value={parameter.type}
                    onValueChange={(value) => onUpdateParameter(index, { ...parameter, type: value })}
                  >
                    <SelectTrigger id={`parameter-type-${index}`}>
                      <SelectValue placeholder="Select parameter" />
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

                <div>
                  <Label htmlFor={`parameter-operator-${index}`}>Operator</Label>
                  <Select
                    value={parameter.operator}
                    onValueChange={(value) => onUpdateParameter(index, { ...parameter, operator: value })}
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
              </div>

              <div>
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
                          onUpdateParameter(index, { ...parameter, values: updatedValues })
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {parameter.values.length === 0 && <p className="text-xs text-muted-foreground">No values added</p>}
                </div>
                <div className="flex gap-2">
                  <Input
                    id={`parameter-values-${index}`}
                    placeholder="Add value and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        e.preventDefault()
                        const newValue = e.target.value.trim()
                        onUpdateParameter(index, {
                          ...parameter,
                          values: [...parameter.values, newValue],
                        })
                        e.target.value = ""
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Press Enter to add each value</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-4 text-center">
          <p className="text-sm text-muted-foreground">No parameter rules configured</p>
        </div>
      )}
    </div>
  )
}

