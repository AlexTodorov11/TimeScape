import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, password } = body

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User with this email already exists",
        }),
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return new NextResponse(
      JSON.stringify({
        user: userWithoutPassword,
        message: "User created successfully",
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error("[REGISTER_POST]", error)
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong",
      }),
      { status: 500 }
    )
  }
} 