'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { tools } from '@/lib/tools/toolDate'

export function BlogWidget() {
    return (
        <Card className="min-h-[120px] hover:border-primary">
        <CardHeader>
            <CardTitle>Blog Updates</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Latest blog updates will be shown here.</p>
            {/* Future: Fetch from API */}
        </CardContent>
        </Card>
    )
}

export function TimeWidget() {
    const now = new Date().toLocaleTimeString()
    return (
        <Card className="min-h-[100px] hover:border-primary">
        <CardHeader>
            <CardTitle>Date And time</CardTitle>
        </CardHeader>
        <CardContent>{now}</CardContent>
        </Card>
    )
}

export function WeatherWidget() {
    return (
        <Card className="min-h-[120px] hover:border-primary">
        <CardHeader>
            <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Weather data coming soon...</p>
            {/* Future: Use weather API */}
        </CardContent>
        </Card>
    )
}

export function NewsWidget() {
    return (
        <Card className="min-h-[140px] hover:border-primary">
        <CardHeader>
            <CardTitle>News Feed</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Latest news will appear here.</p>
            {/* Future: RSS or news API */}
        </CardContent>
        </Card>
    )
}