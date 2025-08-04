"use client";

import * as React from "react";
import { useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
    >(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
        "inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground",
        className,
        )}
        {...props}
    />
    ));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
    >(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
        "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:text-foreground",
        className,
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
    >(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

type ViewType = "general" | "features" | "technical" | "account";

interface FAQItem {
    question: string;
    answer: string;
    id: string;
}

interface FAQSection {
    category: string;
    items: FAQItem[];
}

interface FAQAccordionProps {
    category: string;
    items: FAQItem[];
}

const FAQ_SECTIONS: Record<ViewType, FAQSection> = {
    general: {
        category: "General Questions",
        items: [
            {
                id: "what-is-devtools",
                question: "What is DevTools Hub?",
                answer: "DevTools Hub is a comprehensive platform that provides developers with a collection of essential tools, utilities, and resources to streamline their development workflow. It offers various features from code converters to formatters, all in one place."
            },
            {
                id: "who-is-it-for",
                question: "Who can benefit from using DevTools Hub?",
                answer: "DevTools Hub is designed for developers, programmers, web designers, and tech enthusiasts who need quick access to development tools. Whether you're a beginner or an experienced developer, our platform offers tools that can help streamline your workflow."
            },
            {
                id: "cost",
                question: "Is DevTools Hub free to use?",
                answer: "Yes, DevTools Hub is completely free to use! We believe in making development tools accessible to everyone. Some advanced features might require registration, but our core tools remain free."
            },
            {
                id: "account-needed",
                question: "Do I need an account to use the tools?",
                answer: "Most basic tools can be used without an account. However, creating a free account allows you to save your favorites, access history, and use advanced features."
            },
            {
                id: "data-privacy",
                question: "How do you handle user data and privacy?",
                answer: "We take data privacy seriously. We don't store any of the code or content you process through our tools. All operations are performed client-side when possible, and we follow strict data protection guidelines."
            }
        ]
    },
    features: {
        category: "Features & Tools",
        items: [
            {
                id: "available-tools",
                question: "What types of tools are available?",
                answer: "We offer a wide range of tools including code formatters, converters (JSON-CSV, XML-JSON), minifiers, beautifiers, diff checkers, and more. Our tools are categorized for easy access and organized by functionality."
            },
            {
                id: "favorite-tools",
                question: "Can I save my favorite tools?",
                answer: "Yes! Registered users can bookmark their frequently used tools, creating a personalized dashboard for quick access to their most-used utilities."
            },
            {
                id: "offline-access",
                question: "Do the tools work offline?",
                answer: "Many of our tools work offline once the page is loaded. However, some features might require an internet connection for real-time processing or updates."
            },
            {
                id: "tool-categories",
                question: "How are the tools organized?",
                answer: "Tools are organized into categories such as Converters, Formatters, Validators, Generators, and more. You can also use the search function to quickly find specific tools."
            },
            {
                id: "new-tools",
                question: "How often do you add new tools?",
                answer: "We regularly update our platform with new tools and features based on user feedback and emerging development needs. We aim to add new tools monthly."
            }
        ]
    },
    technical: {
        category: "Technical Support",
        items: [
            {
                id: "browser-support",
                question: "Which browsers are supported?",
                answer: "DevTools Hub works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience."
            },
            {
                id: "max-file-size",
                question: "Is there a file size limit for uploads?",
                answer: "Yes, there are size limits that vary by tool. Most tools support files up to 10MB, while some may have lower limits to ensure optimal performance."
            },
            {
                id: "api-access",
                question: "Do you offer API access to the tools?",
                answer: "We're currently working on providing API access to our tools. This feature will allow developers to integrate our tools directly into their applications."
            },
            {
                id: "error-reporting",
                question: "How can I report errors or bugs?",
                answer: "You can report bugs through our GitHub repository or use the feedback form in the application. We actively monitor and address reported issues."
            },
            {
                id: "custom-tools",
                question: "Can I request custom tools or features?",
                answer: "Yes! We welcome feature requests and suggestions. You can submit them through our GitHub repository or contact us directly through the platform."
            }
        ]
    },
    account: {
        category: "Account & Settings",
        items: [
            {
                id: "account-benefits",
                question: "What are the benefits of creating an account?",
                answer: "Account holders can save tool preferences, access their usage history, create custom tool collections, and receive updates about new features and tools."
            },
            {
                id: "settings-customization",
                question: "Can I customize the interface and settings?",
                answer: "Yes, registered users can customize their dashboard layout, set preferred tool configurations, and choose between light and dark themes."
            },
            {
                id: "data-sync",
                question: "Does my data sync across devices?",
                answer: "Yes, your settings, favorites, and preferences are synced across all devices when you're logged into your account."
            },
            {
                id: "delete-account",
                question: "How can I delete my account?",
                answer: "You can delete your account and all associated data through the account settings page. This action is permanent and cannot be undone."
            },
            {
                id: "password-reset",
                question: "How do I reset my password?",
                answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send you instructions to reset your password via email."
            }
        ]
    }
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({ category, items }) => (
    <div className="">
        <Badge variant={"outline"} className="py-2 px-6 mb-2 rounded-md">
        {category}
        </Badge>
        <Accordion type="single" collapsible className="w-full">
        {items.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left hover:no-underline hover:text-accent transition-colors duration-300">
                {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
        ))}
        </Accordion>
    </div>
);

export const FaqsSection = () => {
    const [activeView, setActiveView] = useState<ViewType>("general");

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl" id="FAQ">
        <header className="text-center mb-12 flex flex-wrap gap-4 items-center justify-center">
            <h1 className="text-2xl font-bold tracking-tight text-violet">
            FAQs
            </h1>
            <p className="text-lg text-muted-foreground">
            Need help with something? Here are our most frequently asked
            questions.
            </p>
        </header>

        <div className="flex justify-center sticky top-2">
            <Tabs
            defaultValue="general"
            onValueChange={(value) => setActiveView(value as ViewType)}
            className="mb-8 max-w-xl border rounded-xl bg-background"
            >
            <TabsList className="w-full justify-start h-12 p-1">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            </Tabs>
        </div>

        <FAQAccordion
            category={FAQ_SECTIONS[activeView].category}
            items={FAQ_SECTIONS[activeView].items}
        />
        </div>
    );
};