import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, BookOpen, Newspaper, Sun, Cloud, CloudRain, Wind, Thermometer } from "lucide-react"

export function BlogWidgetV2() {
    const recentPosts = [
        { title: "Getting Started with React", date: "2 days ago", status: "new" },
        { title: "Advanced CSS Techniques", date: "1 week ago", status: "" },
        { title: "JavaScript Best Practices", date: "2 weeks ago", status: "" }
    ]

    return (
        <Card className="min-h-[140px] hover:border-primary border border-border bg-gradient-to-br from-muted to-background">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                    <BookOpen className="h-5 w-5" />
                    Blog Updates
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {recentPosts.slice(0, 2).map((post, index) => (
                    <div key={index} className="flex items-center justify-between group hover:bg-popover/50 p-2 rounded-md transition-colors">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary">
                                {post.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{post.date}</p>
                        </div>
                        {post.status === "new" && (
                            <Badge variant="secondary" className="ml-2 ">
                                New
                            </Badge>
                        )}
                    </div>
                ))}
                <div className="pt-1">
                    <p className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
                        View all posts →
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

// export function BlogWidgetV2() {
//     // Mock recent blog posts
//     const recentPosts = [
//         { title: "Getting Started with React", date: "2 days ago", status: "new" },
//         { title: "Advanced CSS Techniques", date: "1 week ago", status: "" },
//         { title: "JavaScript Best Practices", date: "2 weeks ago", status: "" }
//     ]

//     return (
//         <Card className="min-h-[140px] hover:border-primary bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
//             <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
//                     <BookOpen className="h-5 w-5" />
//                     Blog Updates
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//                 {recentPosts.slice(0, 2).map((post, index) => (
//                     <div key={index} className="flex items-center justify-between group hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors">
//                         <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
//                                 {post.title}
//                             </p>
//                             <p className="text-xs text-muted-foreground">{post.date}</p>
//                         </div>
//                         {post.status === "new" && (
//                             <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
//                                 New
//                             </Badge>
//                         )}
//                     </div>
//                 ))}
//                 <div className="pt-1">
//                     <a href="/blog" className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
//                         View all posts →
//                     </a>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }


export function TimeWidgetV2() {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

    return (
        <Card className="min-h-[120px] hover:border-primary border border-border bg-gradient-to-br from-muted to-background">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5" />
                    Date & Time
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{time}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {date}
                </div>
                <div className="pt-2">
                    <div className="h-1 bg-[--muted] rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${(now.getHours() / 24) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


// export function TimeWidgetV2() {
//     const now = new Date()
//     const time = now.toLocaleTimeString('en-US', { 
//         hour: '2-digit', 
//         minute: '2-digit',
//         hour12: true 
//     })
//     const date = now.toLocaleDateString('en-US', {
//         weekday: 'long',
//         month: 'short',
//         day: 'numeric'
//     })

//     return (
//         <Card className="min-h-[120px] hover:border-primary bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
//             <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
//                     <Clock className="h-5 w-5" />
//                     Date & Time
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-1">
//                 <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
//                     {time}
//                 </div>
//                 <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
//                     <Calendar className="h-4 w-4" />
//                     {date}
//                 </div>
//                 <div className="pt-2">
//                     <div className="h-1 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
//                         <div 
//                             className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-1000"
//                             style={{ width: `${(now.getSeconds() / 60) * 100}%` }}
//                         ></div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }


export function WeatherWidgetV2() {
    const weather = {
        temp: "23°C",
        condition: "Partly Cloudy",
        humidity: "65%",
        windSpeed: "12 km/h",
        icon: Cloud
    }

    const WeatherIcon = weather.icon

    return (
        <Card className="min-h-[140px] hover:border-primary border border-border bg-gradient-to-br from-muted to-background">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-foreground gap-2 ">
                    <Sun className="h-5 w-5" />
                    Weather
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-2xl font-bold text-foreground">{weather.temp}</div>
                        <div className="text-sm text-muted-foreground">{weather.condition}</div>
                    </div>
                    <WeatherIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Thermometer className="h-3 w-3" />
                        {weather.humidity}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Wind className="h-3 w-3" />
                        {weather.windSpeed}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


// export function WeatherWidgetV2() {
//     // Mock weather data
//     const weather = {
//         temp: "23°C",
//         condition: "Partly Cloudy",
//         humidity: "65%",
//         windSpeed: "12 km/h",
//         icon: Cloud
//     }

//     const WeatherIcon = weather.icon

//     return (
//         <Card className="min-h-[140px] hover:border-primary bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
//             <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
//                     <Sun className="h-5 w-5" />
//                     Weather
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="flex items-center justify-between mb-3">
//                     <div>
//                         <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
//                             {weather.temp}
//                         </div>
//                         <div className="text-sm text-amber-600 dark:text-amber-400">
//                             {weather.condition}
//                         </div>
//                     </div>
//                     <WeatherIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-xs">
//                     <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
//                         <Thermometer className="h-3 w-3" />
//                         {weather.humidity}
//                     </div>
//                     <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
//                         <Wind className="h-3 w-3" />
//                         {weather.windSpeed}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
import { getCategoryColor } from "@/lib/tools/categories"
export function NewsWidgetV2() {
    const newsItems = [
        { title: "Tech Industry Updates", source: "TechNews", time: "2h ago", category: "Technology" },
        { title: "Market Analysis Report", source: "FinanceDaily", time: "4h ago", category: "Finance" },
        { title: "Climate Change Summit", source: "WorldNews", time: "6h ago", category: "Environment" }
    ]

    return (
        <Card className="min-h-[160px] hover:border-primary border border-border bg-gradient-to-br from-muted to-background">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                    <Newspaper className="h-5 w-5" />
                    News Feed
                    <Badge variant="outline" className="ml-auto text-xs border-primary text-primary">
                        Live
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {newsItems.slice(0, 2).map((item, index) => (
                    <div key={index} className="group hover:bg-popover/50 p-2 rounded-md transition-colors cursor-pointer">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary">
                                {item.title}
                            </h4>
                            <Badge variant="secondary" className={`text-xs whitespace-nowrap ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span>{item.time}</span>
                        </div>
                    </div>
                ))}
                <div className="pt-1 border-t border-border">
                    <p className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
                        View all headlines →
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}


// export function NewsWidgetV2() {
//     // Mock news items
//     const newsItems = [
//         { 
//             title: "Tech Industry Updates", 
//             source: "TechNews", 
//             time: "2h ago",
//             category: "Technology"
//         },
//         { 
//             title: "Market Analysis Report", 
//             source: "FinanceDaily", 
//             time: "4h ago",
//             category: "Finance"
//         },
//         { 
//             title: "Climate Change Summit", 
//             source: "WorldNews", 
//             time: "6h ago",
//             category: "Environment"
//         }
//     ]

//     const getCategoryColor = (category) => {
//         const colors = {
//             Technology: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
//             Finance: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
//             Environment: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
//         }
//         return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
//     }

//     return (
//         <Card className="min-h-[160px] hover:border-primary bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
//             <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
//                     <Newspaper className="h-5 w-5" />
//                     News Feed
//                     <Badge variant="outline" className="ml-auto text-xs border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400">
//                         Live
//                     </Badge>
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//                 {newsItems.slice(0, 2).map((item, index) => (
//                     <div key={index} className="group hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors cursor-pointer">
//                         <div className="flex items-start justify-between gap-2 mb-1">
//                             <h4 className="text-sm font-medium line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
//                                 {item.title}
//                             </h4>
//                             <Badge variant="secondary" className={`text-xs whitespace-nowrap ${getCategoryColor(item.category)}`}>
//                                 {item.category}
//                             </Badge>
//                         </div>
//                         <div className="flex items-center justify-between text-xs text-muted-foreground">
//                             <span>{item.source}</span>
//                             <span>{item.time}</span>
//                         </div>
//                     </div>
//                 ))}
//                 <div className="pt-1 border-t border-purple-200 dark:border-purple-800">
//                     <p className="text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
//                         View all headlines →
//                     </p>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }