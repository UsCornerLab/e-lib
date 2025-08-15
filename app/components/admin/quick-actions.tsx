import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Plus, FileText, Users, Calendar } from "lucide-react"
import { Link } from "react-router"

export function QuickActions() {
  const actions = [
    {
      title: "Add New Book",
      description: "Add a book to the catalog",
      icon: Plus,
      href: "/admin/books/new",
      variant: "default" as const,
    },
    {
      title: "Create Article",
      description: "Write a new news article",
      icon: FileText,
      href: "/admin/news/new",
      variant: "outline" as const,
    },
    {
      title: "Manage Users",
      description: "View and edit user accounts",
      icon: Users,
      href: "/admin/users",
      variant: "outline" as const,
    },
    {
      title: "Schedule Event",
      description: "Create a new library event",
      icon: Calendar,
      href: "/admin/events/new",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button key={action.title} variant={action.variant} className="h-auto p-4 justify-start truncate" asChild>
              <Link to={action.href}>
                <div className="flex items-center space-x-3 min-w-0 pr-4">
                  <action.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-70">{action.description}</div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
