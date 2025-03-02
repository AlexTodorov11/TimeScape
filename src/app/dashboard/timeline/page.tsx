import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Timeline } from "@/components/timeline/timeline"

async function getProjects(userId: string) {
  return await prisma.project.findMany({
    where: {
      userId,
    },
    include: {
      tasks: true,
    },
  })
}

export default async function TimelinePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const projects = await getProjects(session.user.id)
  
  const timelineItems = projects.flatMap((project) => [
    {
      id: project.id,
      content: project.title,
      start: project.startDate,
      end: project.endDate,
      type: "range",
      className: "project-item",
    },
    ...project.tasks.map((task) => ({
      id: task.id,
      content: task.title,
      start: task.startDate,
      end: task.endDate,
      type: "range",
      className: `task-item task-${task.type.toLowerCase()}`,
    })),
  ])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Timeline</h2>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        <Timeline items={timelineItems} />
      </div>
    </div>
  )
} 