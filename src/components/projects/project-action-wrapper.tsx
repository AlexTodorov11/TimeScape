"use client"

import { Project } from "@prisma/client"
import { ProjectActions } from "./project-actions"

export function ProjectActionWrapper({ project }: { project: Project }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div onClick={handleClick}>
      <ProjectActions project={project} />
    </div>
  )
} 