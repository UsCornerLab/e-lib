import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  BookOpen,
  FileText,
  Users,
  Calendar,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useDashboard } from "~/hooks/useDashboard";

export function DashboardStats() {
  const { stats, loading, error } = useDashboard();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return null;

  const mappedStats = [
    {
      title: "Total Books",
      value: stats.total_books,
      description: `Deactivated: ${stats.deactivated_books}`,
      icon: BookOpen,
    },
    {
      title: "Total Users",
      value: stats.total_users,
      description: `Deactivated: ${stats.deactivated_users}`,
      icon: Users,
    },
    {
      title: "News Articles",
      value: stats.total_news,
      description: "Total published news posts",
      icon: FileText,
    },
    {
      title: "Categories",
      value: stats.total_categories,
      description: "Book categories",
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mappedStats.map((stat) => (
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
  );
}
