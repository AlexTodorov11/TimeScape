"use client"

import { Task } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TaskActions } from "@/components/tasks/task-actions" 

interface TaskListProps {
  tasks: (Task & {
    project: {
      title: string
    }
  })[]
  projectId?: string
}

const taskTypeColors = {
  TASK: "bg-green-100 text-green-800",
  BLOCK: "bg-red-100 text-red-800",
  BUG: "bg-yellow-100 text-yellow-800",
}

const statusColors = {
  PENDING: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {!projectId && <TableHead>Project</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              {!projectId && (
                <TableCell>{task.project.title}</TableCell>
              )}
              <TableCell>
                <Badge variant="secondary" className={taskTypeColors[task.type]}>
                  {task.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[task.status]}>
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(task.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(task.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <TaskActions task={task} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 