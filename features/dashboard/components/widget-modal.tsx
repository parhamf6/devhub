'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  enabledWidgets: Record<string, boolean>
  setEnabledWidgets: (widgets: Record<string, boolean>) => void
  dragEnabled: boolean
  setDragEnabled: (value: boolean) => void
}

export default function WidgetModal({
  open,
  setOpen,
  enabledWidgets,
  setEnabledWidgets,
  dragEnabled,
  setDragEnabled,
}: Props) {
  const toggleWidget = (key: string) => {
    setEnabledWidgets({ ...enabledWidgets, [key]: !enabledWidgets[key] })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Widget Toggles */}
          {Object.keys(enabledWidgets).map((key) => (
            <div className="flex items-center justify-between" key={key}>
              <Label className="capitalize">{key}</Label>
              <Switch checked={enabledWidgets[key]} onCheckedChange={() => toggleWidget(key)} />
            </div>
          ))}

          <div className="border-t pt-4">
            {/* Drag Mode Toggle */}
            <div className="flex items-center justify-between">
              <Label>Enable Drag Mode</Label>
              <Switch checked={dragEnabled} onCheckedChange={setDragEnabled} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
