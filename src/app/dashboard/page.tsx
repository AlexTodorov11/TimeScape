import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { NewProjectDialog } from "@/components/projects/new-project-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

async function getDashboardData(userId: string) {
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  const totalProjects = await prisma.project.count({
    where: { userId },
  })

  const totalTasks = await prisma.task.count({
    where: {
      project: {
        userId,
      },
    },
  })

  const completedTasks = await prisma.task.count({
    where: {
      project: {
        userId,
      },
      status: 'COMPLETED',
    },
  })

  return {
    recentProjects: projects,
    stats: {
      totalProjects,
      totalTasks,
      completedTasks,
    },
  }
}

const priorityStyles = {
  BACKLOG: "bg-gray-100 hover:bg-gray-200",
  LOW: "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200",
  MEDIUM: "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
  HIGH: "bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200",
  URGENT: "bg-gradient-to-r from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200",
}

const priorityLabels = {
  BACKLOG: "Backlog",
  LOW: "Low Priority",
  MEDIUM: "Medium Priority",
  HIGH: "High Priority",
  URGENT: "Urgent",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const { recentProjects, stats } = await getDashboardData(session.user.id)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <NewProjectDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <Link 
              key={project.id} 
              href={`/dashboard/projects/${project.id}`}
              className="block"
            >
              <Card className={cn(
                "transition-colors border-l-4",
                priorityStyles[project.priority],
                {
                  'border-l-gray-400': project.priority === 'BACKLOG',
                  'border-l-green-500': project.priority === 'LOW',
                  'border-l-blue-500': project.priority === 'MEDIUM',
                  'border-l-purple-500': project.priority === 'HIGH',
                  'border-l-red-500': project.priority === 'URGENT',
                }
              )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {priorityLabels[project.priority]}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {project.description || "No description"}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium">
                      Tasks: {project.tasks.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 