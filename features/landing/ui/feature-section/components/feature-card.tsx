// components/FeatureCardItem.tsx
import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion"

type FeatureCardItemProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    linkLabel: string;
};

const FeatureCardItem: React.FC<FeatureCardItemProps> = ({
    icon,
    title,
    description,
    linkLabel,
    }) => {
    return (
        <div className="flex flex-col gap-4 border border-border rounded-[32px] justify-between sm:overflow-y-scroll md:overflow-y-hidden p-4 w-[320px] h-[320px]
        hover:shadow-[-5px_-5px_10px_0px_#FAFBFF,5px_5px_10px_0px_#161B1D] transition-shadow duration-300 ">
            <div>{icon}</div>
            <div>
                <h2 className="text-2xl font-semibold ">{title}</h2>
            </div>
            <div>
                <p className="text-sm">{description}</p>
            </div>
            <div className=" text-accent border p-2  rounded-[16px] text-sm font-medium
            hover:bg-accent hover:text-background transition-colors duration-300 ring">
                <a href="" className="flex gap-2 items-center justify-center">
                    {linkLabel}
                    <ChevronRight className="text-sm" />
                </a>
            </div>
        </div>
    );
};

export default FeatureCardItem;




// import { ClipboardCheck , ChevronRight , LibraryBig } from "lucide-react";


// export default function FeatureCard() {
//     return(
// <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


//     <div className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-800 min-h-[320px]">
//       <div>
//         <div className="text-2xl sm:text-3xl mb-4">📝</div>
//         <h3 className="text-lg sm:text-xl font-semibold mb-2">Organize Projects Seamlessly</h3>
//         <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//           Streamline all your tasks with our easy-to-use tools and stay productive.
//         </p>
//       </div>
//       <a href="#" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-yellow-400">
//         Manage
//         <span className="ml-1">➔</span>
//       </a>
//     </div>


//     <div className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-800 min-h-[320px]">
//       <div>
//         <div className="text-2xl sm:text-3xl mb-4">✅</div>
//         <h3 className="text-lg sm:text-xl font-semibold mb-2">Manage Tasks the Easy Way</h3>
//         <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//           Keep everything organized and collaborate efficiently with your team.
//         </p>
//       </div>
//       <a href="#" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-yellow-400">
//         Manage
//         <span className="ml-1">➔</span>
//       </a>
//     </div>

//     <div className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-800 min-h-[320px]">
//       <div>
//         <div className="text-2xl sm:text-3xl mb-4">📋</div>
//         <h3 className="text-lg sm:text-xl font-semibold mb-2">Advanced Task Planning</h3>
//         <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
//           Plan, track, and deliver projects with our powerful management platform.
//         </p>
//       </div>
//       <a href="#" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-yellow-400">
//         Manage
//         <span className="ml-1">➔</span>
//       </a>
//     </div>

//   </div>
// </div>


//     );
// }