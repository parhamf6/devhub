

'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WidgetModal from './components/widget-modal'
import {
  BlogWidget,
  TimeWidget,
  WeatherWidget,
  NewsWidget,
} from './components/widgets'
import { BlogWidgetV2 ,  TimeWidgetV2 , WeatherWidgetV2 , NewsWidgetV2 } from './components/widgetsV2'
import SortableWidgets from './components/soartable-widgets'
import { FavoriteToolsV2 } from './components/favorite-tool-widget'
import { ThemeToggle } from '@/components/theme-toggle'
import { motion , AnimatePresence , Variants } from 'framer-motion'
import { SettingsGearIcon } from '@/components/animated-icons/setting-icon'
import { DevInspirationWidget, GitHubWidget, ProjectsWidget , TasksWidget , DevResourcesWidget } from './components/widgetsV3'


export default function DashboardSection() {
  const [open, setOpen] = useState(false)

  // Widgets toggle
  const [enabledWidgets, setEnabledWidgets] = useState({
    blog: true,
    time: true,
    weather: true,
    news: true,
  })
  const now = new Date().toLocaleTimeString()
  // Enable drag-and-drop mode
  const [dragEnabled, setDragEnabled] = useState(false)

  // Widget display order
  const [widgetOrder, setWidgetOrder] = useState(['blog','time', 'weather', 'news'])

  // Filter to show only enabled widgets
  const visibleWidgets = widgetOrder.filter((id) => enabledWidgets[id])

  // Render each widget by its ID
  const renderWidget = (id: string) => {
    switch (id) {
      case 'blog':
        // return <BlogWidget />
        return <BlogWidgetV2 />
      case 'weather':
        // return <WeatherWidget />
        return <WeatherWidgetV2 />
      case 'news':
        // return <NewsWidget />
        return <NewsWidgetV2 />
      case 'time':
        // return<TimeWidget />
        return<TimeWidgetV2 />
      default:
        return null
    }
  }

  // When widget order is saved
  const handleSaveOrder = (newOrder: string[]) => {
    setWidgetOrder(newOrder)
    setDragEnabled(false)
  }

  return (
    <div className="p-2 pl-4 pr-4 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className='flex'>
          <h1 className='font-semibold text-2xl'>Wellcome Parham</h1>
        </div>
        <div>
            {now}
          </div>
          <div>
            today is 22 June 2025
          </div>
        {/* <div className='flex items-center justify-end'>
          <Button variant="ghost" onClick={() => setOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div> */}
      </div>

      {/* Responsive Layout: Tools (left) and Widgets (right) */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* --- TOOLS SECTION --- */}
        <div className="lg:w-2/3">
          <FavoriteToolsV2 />
        </div>

        {/* --- DIVIDER --- */}
        {/* <div className="hidden lg:block w-px bg-border" /> */}
        <div>
          <motion.div
          className="hidden lg:block w-px bg-border border-1 border-border origin-center"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%' }}
        />
        </div>
        {/* --- WIDGET SECTION --- */}
        <div className="lg:w-1/3 flex flex-col space-y-4 bg-card p-4 rounded-3xl border">
          <div className='flex items-center justify-between'>
            <h1>Widgets</h1>
            <Button variant="ghost" onClick={() => setOpen(true)}>
              {/* <Settings className="h-5 w-5" /> */}
              <SettingsGearIcon  />
            </Button>
          {/* <ThemeToggle /> */}
          </div>
          <div>
            {/* Widget Modal (for toggling drag/edit mode) */}
            <WidgetModal
              open={open}
              setOpen={setOpen}
              enabledWidgets={enabledWidgets}
              setEnabledWidgets={setEnabledWidgets}
              dragEnabled={dragEnabled}
              setDragEnabled={setDragEnabled}
            />

            {/* Widget list area (drag-and-drop supported) */}
            {visibleWidgets.length > 0 && (
              <SortableWidgets
                widgets={visibleWidgets}
                renderWidget={renderWidget}
                dragEnabled={dragEnabled}
                onSaveOrder={handleSaveOrder}
              />
            )}

            {/* <TasksWidget/> */}
            {/* <GitHubWidget /> */}
            {/* <ProjectsWidget/> */}
            {/* <DevInspirationWidget /> */}
            {/* <DevResourcesWidget /> */}
          </div>
        </div>
        
      </div>
    </div>
  )
}
