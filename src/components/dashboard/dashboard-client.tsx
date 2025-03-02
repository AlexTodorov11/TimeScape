"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Clock } from "lucide-react"
import { NewProjectDialog } from "@/components/projects/new-project-dialog"

interface Project {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  tasks: any[]
}

interface Task {
  id: string
  title: string
  completed: boolean
  projectId: string
}

interface DashboardData {
  recentProjects: Project[]
  stats: {
    totalProjects: number
    totalTasks: number
    completedTasks: number
  }
}

interface DashboardProps {
  userId: string;
  projects: Project[];  // Define Project type based on your data structure
  tasks: Task[];       // Define Task type based on your data structure
}

export function DashboardClient(props: DashboardProps) {
  const { projects, tasks } = props
  
  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length
  }
  
  const recentProjects = projects.slice(0, 6) // Show last 6 projects

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <NewProjectDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
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
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
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
          ))}
        </div>
      </div>
    </div>
  )
} 