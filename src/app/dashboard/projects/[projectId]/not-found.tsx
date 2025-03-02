import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProjectNotFound() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-bold">Project Not Found</h2>
      <p className="text-muted-foreground">
        The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button asChild className="mt-4">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
} 