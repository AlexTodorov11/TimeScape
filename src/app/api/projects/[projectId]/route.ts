import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { title, description, priority, startDate, endDate } = body

    const project = await prisma.project.update({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
      data: {
        title,
        description,
        priority,
        startDate,
        endDate,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.project.delete({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[PROJECT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 