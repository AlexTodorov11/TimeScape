import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    const body = await req.json()
    const { title, description, type, status, startDate, endDate } = body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        type,
        status,
        startDate,
        endDate,
        projectId: params.projectId,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASKS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 