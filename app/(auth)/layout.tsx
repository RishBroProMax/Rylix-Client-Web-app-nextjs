import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Rylix Solutions</h1>
            <p className="text-sm text-muted-foreground">Client Communication Platform</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

