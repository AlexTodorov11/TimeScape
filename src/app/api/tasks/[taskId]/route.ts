import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, type, status, startDate, endDate } = body

    const task = await prisma.task.update({
      where: {
        id: params.taskId,
        project: {
          userId: session.user.id,
        },
      },
      data: {
        title,
        description,
        type,
        status,
        startDate,
        endDate,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASK_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.task.delete({
      where: {
        id: params.taskId,
        project: {
          userId: session.user.id,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[TASK_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 