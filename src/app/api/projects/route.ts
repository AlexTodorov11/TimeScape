import type { ProjectPriority } from "@/types"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, priority, startDate, endDate } = body

    const project = await prisma.project.create({
      data: {
        title,
        description,
        priority,
        startDate,
        endDate,
        userId: session.user.id,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 