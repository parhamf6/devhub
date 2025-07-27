'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  widgets: string[]
  renderWidget: (id: string) => JSX.Element
  dragEnabled: boolean
  onSaveOrder: (newOrder: string[]) => void
}

export default function SortableWidgets({ widgets, renderWidget, dragEnabled, onSaveOrder }: Props) {
  const [items, setItems] = useState(widgets)

  const sensors = useSensors(useSensor(PointerSensor))

  // Handle drag end: reorder widgets
  function handleDragEnd(event: any) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id)
        const newIndex = prev.indexOf(over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {items.map((id) => (
              <SortableItem key={id} id={id} dragEnabled={dragEnabled}>
                {renderWidget(id)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Save button only when drag mode is active */}
      {dragEnabled && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              onSaveOrder(items)
            }}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}

function SortableItem({
  id,
  dragEnabled,
  children,
}: {
  id: string
  dragEnabled: boolean
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: dragEnabled ? 'grab' : 'default',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(dragEnabled ? { ...attributes, ...listeners } : {})}
    >
      {children}
    </div>
  )
}
