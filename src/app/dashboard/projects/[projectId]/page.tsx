import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { format } from "date-fns"
import { NewTaskDialog } from "@/components/tasks/new-task-dialog"
import { TaskList } from "@/components/tasks/task-list"
import { ProjectActions } from "@/components/projects/project-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timeline } from "@/components/timeline/timeline"

async function getProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId,
    },
    include: {
      tasks: {
        include: {
          project: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          startDate: 'asc',
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  return project
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const project = await getProject(params.projectId, session.user.id)

  const timelineItems = [
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
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
          <p className="text-muted-foreground">
            {format(new Date(project.startDate), "PPP")} - {format(new Date(project.endDate), "PPP")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <NewTaskDialog projectId={project.id} />
          <ProjectActions project={project} />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              {project.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold">{project.tasks.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed Tasks</p>
                <p className="text-2xl font-bold">
                  {project.tasks.filter((task) => task.status === "COMPLETED").length}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">
                  {project.tasks.filter((task) => task.status === "IN_PROGRESS").length}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">
                  {project.tasks.filter((task) => task.status === "PENDING").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Manage your project tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList tasks={project.tasks} projectId={project.id} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>
                  View your project timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline items={timelineItems} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 