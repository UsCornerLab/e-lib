"use client"

import type React from "react"
import { useNavigate } from "react-router"
import { AdminSidebar } from "~/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar"
import { AdminHeader } from "~/components/admin/admin-header"
import { Outlet } from "react-router"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock authentication - in a real app, this would use a proper auth hook
  const userRole = "administrator" // This would come from auth context

  return (
    <SidebarProvider>
      <AdminSidebar userRole={userRole} />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 p-6"><Outlet /></main>
      </SidebarInset>
    </SidebarProvider>
  )
}
