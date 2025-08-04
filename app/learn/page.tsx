// app/learn/page.tsx
import UnderDevelopmentPage from "@/components/global/under-development"
import Navbar from "@/components/navbar"
import { BackgroundPaths } from "@/components/hero-wave"
export default async function LearnPage() {

  return (
    <div>
      <Navbar/>
      <UnderDevelopmentPage/>
    </div>
    
  )
}




// // app/learn/page.tsx
// import { getAllPosts } from '@/lib/mdx'
// import LearnLayout from '@/components/learn-layout'
// import Link from 'next/link'
// import { Badge } from '@/components/ui/badge'

// export default async function LearnPage() {
//   const posts = await getAllPosts()

//   const postsByCategory = posts.reduce((acc, post) => {
//     const category = post.frontMatter.category
//     if (!acc[category]) {
//       acc[category] = []
//     }
//     acc[category].push(post)
//     return acc
//   }, {} as Record<string, typeof posts>)

//   return (
//     <LearnLayout posts={posts}>
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-12">
//           <h1 className="text-4xl font-bold  mb-4">
//             DevHub Learn
//           </h1>
//           <p className="text-xl">
//             Comprehensive guides and tutorials to help you master development
//           </p>
//         </header>

//         <div className="space-y-12">
//           {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
//             <section key={category}>
//               <h2 className="text-2xl font-semibold  mb-6 border-b border- pb-2">
//                 {category}
//               </h2>
//               <div className="flex gap-4">
//                 {categoryPosts.map((post) => (
//                   <article key={post.slug} 
//                   className="flex flex-col gap-4 border border-border rounded-[32px] justify-between sm:overflow-y-scroll md:overflow-y-hidden p-4 w-[240px] h-[240px]
//                     hover:border-secondary transition-colors duration-300">
//                     <div className="p-4 flex flex-col gap-4  justify-between">
//                       <h3 className="text-lg font-semibold">
//                         <Link href={`/learn/${post.slug}`} className="">
//                           {post.frontMatter.title}
//                         </Link>
//                       </h3>
//                       <p className="text-gray-600 ">{post.frontMatter.description}</p>
//                       <div className="flex items-center justify-between">
//                         <div className="flex flex-wrap gap-2">
//                           {post.frontMatter.tags.slice(0, 2).map((tag) => (
//                             <span
//                               key={tag}
//                               className="inline-flex bg-secondary text-background items-center p-1 rounded-full text-xs font-medium"
//                             >
//                               #{tag}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             </section>
//           ))}
//         </div>
//       </div>
//     </LearnLayout>
//   )
// }