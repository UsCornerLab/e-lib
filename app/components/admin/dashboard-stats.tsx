import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { BookOpen, FileText, Users, Calendar, TrendingUp, Eye } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Total Books",
      value: "52,254",
      description: "+12% from last month",
      icon: BookOpen,
      trend: "up",
    },
    {
      title: "Active Users",
      value: "1,847",
      description: "+5% from last month",
      icon: Users,
      trend: "up",
    },
    {
      title: "News Articles",
      value: "127",
      description: "8 published this month",
      icon: FileText,
      trend: "neutral",
    },
    {
      title: "Upcoming Events",
      value: "23",
      description: "Next 30 days",
      icon: Calendar,
      trend: "neutral",
    },
    {
      title: "Monthly Visitors",
      value: "8,432",
      description: "+18% from last month",
      icon: Eye,
      trend: "up",
    },
    {
      title: "Books Borrowed",
      value: "3,241",
      description: "This month",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
