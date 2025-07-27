

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tools } from '@/lib/tools/toolDate'
import { ToolCard } from '@/components/tool-card'
import { ToolCardFav } from './toolcard-fav'
import { motion , AnimatePresence , Variants } from 'framer-motion'

export function FavoriteToolsV2() {
    const [collapsed, setCollapsed] = useState(false)
    const [favorites , setFavorites] = useState<string[]>([])
    useEffect(() => {
        const stored = localStorage.getItem("devhub-favorites")
        if (stored) setFavorites(JSON.parse(stored))
    }, [])
    const favoriteTools = tools.filter((tool) => favorites.includes(tool.slug))
    const toolsToDisplay = favoriteTools.length > 0 ? favoriteTools : tools

    return (
        <Card className="col-span-full overflow-hidden">
            <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
            >
                {/* <CardTitle>Favorite Tools</CardTitle> */}
                <CardTitle>
                    {
                        favoriteTools.length === 0 ? "There is No favorite tools Browse All" : "Favorite Tools"
                    }
                </CardTitle>
                {collapsed ? <ChevronDown /> : <ChevronUp />}
            </CardHeader>

            <motion.div
                initial={false}
                animate={collapsed ? 'collapsed' : 'open'}
                variants={{
                    open: {
                        height: 'auto',
                        opacity: 1,
                        transition: { duration: 0.3, ease: 'easeInOut' },
                    },
                    collapsed: {
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.3, ease: 'easeInOut' },
                    },
                }}
                style={{ overflow: 'hidden' }}
            >
                <div className="flex flex-wrap gap-4 items-center justify-center p-4">
                    {toolsToDisplay.map((tool) => (
                        <ToolCardFav key={tool.slug} {...tool} withFavoriteToggle />
                    ))}
                </div>
            </motion.div>
        </Card>
    )
}