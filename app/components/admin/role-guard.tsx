import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock role check - in real app, this would check actual user role
    const checkUserRole = async () => {
      // Simulate API call to get user role
      await new Promise((resolve) => setTimeout(resolve, 100))
      const role = "administrator" // This would come from auth context
      setUserRole(role)
      setIsLoading(false)
    }

    checkUserRole()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline">
          Go Back
        </button>
      </div>
    )
  }

  return <>{children}</>
}
