import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Github, 
    GitBranch, 
    GitCommit, 
    GitPullRequest,
    Code2, 
    Terminal, 
    Zap,
    Package,
    Cpu,
    HardDrive,
    Activity,
    ExternalLink,
    Star,
    Eye,
    BookOpen,
    Rocket,
    Coffee,
    Bug,
    CheckCircle,
    Clock,
    Palette,
    Database,
    Globe,
    Server,
    Layers
} from "lucide-react"




export function DevResourcesWidget() {
    const resources = [
        { name: "MDN Docs", icon: BookOpen, url: "#", category: "Documentation" },
        { name: "shadcn/ui", icon: Layers, url: "#", category: "Components" },
        { name: "Tailwind CSS", icon: Palette, url: "#", category: "Styling" },
        { name: "TypeScript", icon: Code2, url: "#", category: "Language" },
        { name: "Next.js", icon: Rocket, url: "#", category: "Framework" },
        { name: "Framer Motion", icon: Zap, url: "#", category: "Animation" }
    ]

    return (
        <Card className="min-h-[160px] hover:border-primary bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                    <BookOpen className="h-5 w-5" />
                    Dev Resources
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {resources.slice(0, 6).map((resource, index) => {
                        const Icon = resource.icon
                        return (
                            <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="h-auto p-2 flex items-center gap-2 justify-start hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                            >
                                <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <div className="flex flex-col items-start min-w-0">
                                    <span className="text-xs font-medium truncate">{resource.name}</span>
                                    <span className="text-xs text-muted-foreground">{resource.category}</span>
                                </div>
                                <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export function GitHubWidget() {
    const repos = [
        { name: "dev-hub-dashboard", stars: 45, language: "TypeScript", status: "active" },
        { name: "react-components", stars: 23, language: "JavaScript", status: "archived" },
        { name: "portfolio-site", stars: 12, language: "Next.js", status: "active" }
    ]

    const activities = [
        { type: "commit", repo: "dev-hub-dashboard", message: "Add new widgets", time: "2h ago" },
        { type: "pr", repo: "react-components", message: "Fix responsive issues", time: "1d ago" }
    ]

    return (
        <Card className="min-h-[180px] hover:border-primary bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Github className="h-5 w-5" />
                    GitHub Activity
                    <Badge variant="outline" className="ml-auto text-xs">
                        Connected
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    {repos.slice(0, 2).map((repo, index) => (
                        <div key={index} className="flex items-center justify-between group hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className={`w-2 h-2 rounded-full ${repo.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className="text-sm font-medium truncate">{repo.name}</span>
                                <Badge variant="secondary" className="text-xs">{repo.language}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3" />
                                {repo.stars}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-2">
                    {activities.slice(0, 1).map((activity, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            {activity.type === 'commit' ? <GitCommit className="h-3 w-3" /> : <GitPullRequest className="h-3 w-3" />}
                            <span className="truncate">{activity.message}</span>
                            <span className="whitespace-nowrap">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// export function QuickToolsWidget() {
//     const tools = [
//         { name: "JSON Formatter", icon: Code2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/20" },
//         { name: "Color Picker", icon: Palette, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/20" },
//         { name: "Base64 Encode", icon: Terminal, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/20" },
//         { name: "RegEx Tester", icon: Bug, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/20" },
//         { name: "UUID Generator", icon: Zap, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
//         { name: "Hash Generator", icon: Database, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/20" }
//     ]

//     return (
//         <Card className="min-h-[160px] hover:border-primary bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800">
//             <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
//                     <Zap className="h-5 w-5" />
//                     Quick Tools
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid grid-cols-2 gap-2">
//                     {tools.slice(0, 6).map((tool, index) => {
//                         const Icon = tool.icon
//                         return (
//                             <Button
//                                 key={index}
//                                 variant="ghost"
//                                 size="sm"
//                                 className={`h-auto p-2 flex flex-col items-center gap-1 hover:${tool.bg} transition-colors`}
//                             >
//                                 <Icon className={`h-4 w-4 ${tool.color}`} />
//                                 <span className="text-xs text-center leading-tight">{tool.name}</span>
//                             </Button>
//                         )
//                     })}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// export function SystemMonitorWidget() {
//     const stats = {
//         cpu: 45,
//         memory: 68,
//         disk: 23,
//         network: "12.3 MB/s"
//     }

//     const getStatusColor = (value) => {
//         if (value < 50) return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20"
//         if (value < 80) return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20"
//         return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20"
//     }

//     return (
//         <Card className="min-h-[140px] hover:border-primary bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-800">
//             <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
//                     <Activity className="h-5 w-5" />
//                     System Monitor
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//                 <div className="grid grid-cols-2 gap-3">
//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between text-xs">
//                             <div className="flex items-center gap-1">
//                                 <Cpu className="h-3 w-3" />
//                                 <span>CPU</span>
//                             </div>
//                             <span className={`px-2 py-1 rounded ${getStatusColor(stats.cpu)}`}>
//                                 {stats.cpu}%
//                             </span>
//                         </div>
//                         <div className="flex items-center justify-between text-xs">
//                             <div className="flex items-center gap-1">
//                                 <HardDrive className="h-3 w-3" />
//                                 <span>Disk</span>
//                             </div>
//                             <span className={`px-2 py-1 rounded ${getStatusColor(stats.disk)}`}>
//                                 {stats.disk}%
//                             </span>
//                         </div>
//                     </div>
//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between text-xs">
//                             <div className="flex items-center gap-1">
//                                 <Package className="h-3 w-3" />
//                                 <span>RAM</span>
//                             </div>
//                             <span className={`px-2 py-1 rounded ${getStatusColor(stats.memory)}`}>
//                                 {stats.memory}%
//                             </span>
//                         </div>
//                         <div className="flex items-center justify-between text-xs">
//                             <div className="flex items-center gap-1">
//                                 <Globe className="h-3 w-3" />
//                                 <span>Net</span>
//                             </div>
//                             <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
//                                 {stats.network}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

export function ProjectsWidget() {
    const projects = [
        { 
            name: "E-commerce Dashboard", 
            tech: ["React", "TypeScript", "Tailwind"], 
            status: "In Progress", 
            progress: 75,
            dueDate: "Next Week"
        },
        { 
            name: "API Gateway", 
            tech: ["Node.js", "Express", "MongoDB"], 
            status: "Testing", 
            progress: 90,
            dueDate: "Tomorrow"
        },
        { 
            name: "Mobile App", 
            tech: ["React Native", "Firebase"], 
            status: "Planning", 
            progress: 25,
            dueDate: "2 Weeks"
        }
    ]

    const getStatusColor = (status) => {
        const colors = {
            "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
            "Testing": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
            "Planning": "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
            "Completed": "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
        }
        return colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
    }

    return (
        <Card className="min-h-[180px] hover:border-primary bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Rocket className="h-5 w-5" />
                    Active Projects
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {projects.slice(0, 2).map((project, index) => (
                    <div key={index} className="group hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium truncate">{project.name}</h4>
                            <Badge variant="secondary" className={`text-xs ${getStatusColor(project.status)}`}>
                                {project.status}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {project.tech.slice(0, 3).map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-green-500 dark:bg-green-400 rounded-full transition-all"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                <span>{project.progress}%</span>
                            </div>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {project.dueDate}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}



export function TasksWidget() {
    const tasks = [
        { title: "Fix responsive navigation", priority: "High", completed: false, dueToday: true },
        { title: "Update API documentation", priority: "Medium", completed: false, dueToday: false },
        { title: "Code review for PR #24", priority: "High", completed: true, dueToday: true },
        { title: "Optimize image loading", priority: "Low", completed: false, dueToday: false },
        { title: "Setup CI/CD pipeline", priority: "Medium", completed: false, dueToday: false }
    ]

    const getPriorityColor = (priority) => {
        const colors = {
            High: "text-red-600 dark:text-red-400",
            Medium: "text-yellow-600 dark:text-yellow-400",
            Low: "text-green-600 dark:text-green-400"
        }
        return colors[priority] || "text-gray-600 dark:text-gray-400"
    }

    const pendingTasks = tasks.filter(task => !task.completed).length
    const todayTasks = tasks.filter(task => task.dueToday && !task.completed).length

    return (
        <Card className="min-h-[180px] hover:border-primary bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <CheckCircle className="h-5 w-5" />
                    Tasks
                    <div className="ml-auto flex gap-1">
                        <Badge variant="outline" className="text-xs">
                            {pendingTasks} pending
                        </Badge>
                        {todayTasks > 0 && (
                            <Badge variant="destructive" className="text-xs">
                                {todayTasks} today
                            </Badge>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {tasks.slice(0, 3).map((task, index) => (
                    <div key={index} className="flex items-center gap-2 group hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                            task.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-orange-500'
                        }`}>
                            {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.title}
                                </span>
                                {task.dueToday && !task.completed && (
                                    <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400">
                                        Today
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </div>
                    </div>
                ))}
                <div className="pt-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                        View all tasks →
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export function DevInspirationWidget() {
    const quotes = [
        { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { text: "Make it work, make it right, make it fast.", author: "Kent Beck" }
    ]

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

    return (
        <Card className="min-h-[120px] hover:border-primary bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                    <Coffee className="h-5 w-5" />
                    Daily Inspiration
                </CardTitle>
            </CardHeader>
            <CardContent>
                <blockquote className="space-y-2">
                    <p className="text-sm italic text-cyan-800 dark:text-cyan-200 leading-relaxed">
                        "{randomQuote.text}"
                    </p>
                    <footer className="text-xs text-cyan-600 dark:text-cyan-400">
                        — {randomQuote.author}
                    </footer>
                </blockquote>
                <div className="mt-3 flex justify-center">
                    <Button variant="ghost" size="sm" className="text-xs text-cyan-600 dark:text-cyan-400">
                        New Quote
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}