'use client'

import { FooterV2 } from "@/components/global/footer-v2"
import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"


const sections = [
  {
    title: "1. Introduction",
    content:
      "Your privacy matters to us. DevHub is built with transparency and respect for your data. This policy outlines how we handle your information when using our services.",
  },
  {
    title: "2. Local-Only Data Storage",
    content:
      "All data is stored locally on your device using browser-based storage such as LocalStorage or IndexedDB. We do not upload, transmit, or store your data on external servers.",
  },
  {
    title: "3. No Personal Data Collection",
    content:
      "DevHub does not collect any personal information. All tool configurations, preferences, and saved data remain entirely in your browser.",
  },
  {
    title: "4. No Cookies or Trackers",
    content:
      "We do not use cookies, analytics scripts, or third-party trackers. Your interactions with the site are private and remain only on your device.",
  },
  {
    title: "5. Your Control & Rights",
    content:
      "You are in full control of your data. You can delete all stored data at any time by clearing your browser's local storage. We don’t retain any backups or logs.",
  },
  {
    title: "6. GDPR & CCPA Compliance",
    content:
      "Because we do not collect or process personal data, DevHub is inherently compliant with privacy regulations like the GDPR and CCPA. You do not need to opt in or request deletion — your data never leaves your device.",
  },
  {
    title: "7. Security Considerations",
    content:
      "All data remains on your local system. For best security, use a modern browser and ensure your device is protected. We recommend avoiding public/shared devices for storing tool data.",
  },
  {
    title: "8. Third-Party Integrations",
    content:
      "DevHub may offer optional features (like sharing GitHub links or documentation previews), but these are fully client-side and do not transmit your data. We never send or share local tool data with third parties.",
  },
  {
    title: "9. Policy Updates",
    content:
      "We may revise this privacy policy if our practices change. All changes will be posted on this page. Continued use of the site implies acceptance of the updated terms.",
  },
  {
    title: "10. Contact",
    content:
      "For any questions, suggestions, or concerns regarding privacy, you can open an issue on our GitHub or contact the DevHub team via our official channels.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen items-center flex-col bg-background text-foreground">
      <Navbar />

      <main className="container max-w-4xl px-4 py-16 space-y-10">
        <Card className="p-8 text-center shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            This page explains how DevHub handles your data — with a focus on transparency,
            privacy, and security.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: August 6, 2025
          </p>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title} className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2 text-primary">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </Card>
          ))}
        </div>
      </main>

      <FooterV2 />
    </div>
  )
}
