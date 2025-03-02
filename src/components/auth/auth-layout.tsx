import Image from "next/image"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          <Image
            src="/favicon.ico"
            alt="TimeScape Logo"
            width={100}
            height={100}
            className="rounded-xl"
          />
        </div>
        {children}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:h-full relative">
        <Image
          src="/Rectangle.png"
          alt="Authentication background"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/0 flex items-center justify-center p-8">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to TimeScape
            </h1>
            <p className="text-gray-200">
              Streamline your project management with our intuitive timeline and task management platform. 
              Keep track of your projects, collaborate with your team, and stay on top of deadlines.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 