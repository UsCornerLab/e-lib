import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "added a new book",
      target: "The Midnight Library",
      time: "2 hours ago",
      avatar: "/images/sarah-williams.jpg",
    },
    {
      id: 2,
      user: "Mike Chen",
      action: "published article",
      target: "Summer Reading Program",
      time: "4 hours ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      user: "Emily Davis",
      action: "updated user profile",
      target: "John Smith",
      time: "6 hours ago",
      avatar: "/images/emily-johnson.jpg",
    },
    {
      id: 4,
      user: "Admin",
      action: "created event",
      target: "Author Talk Series",
      time: "1 day ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      user: "Lisa Wong",
      action: "deleted book",
      target: "Outdated Reference Manual",
      time: "2 days ago",
      avatar: "/placeholder.svg",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions performed by staff members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
