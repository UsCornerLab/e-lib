import { Link, useLocation } from "react-router"
import { BookOpen, FileText, Users, BarChart3, Settings, Calendar, Database, Shield, Home, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar"
import { useNavigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";

interface AdminSidebarProps {
  userRole: string
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: BarChart3,
      roles: ["administrator", "editor", "librarian"],
    },
    {
      title: "Books",
      url: "/admin/books",
      icon: BookOpen,
      roles: ["administrator", "editor", "librarian"],
    },
    {
      title: "News Articles",
      url: "/admin/news",
      icon: FileText,
      roles: ["administrator", "editor"],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      roles: ["administrator"],
    },
    
  ]


  const filteredNavItems = navigationItems.filter((item) => item.roles.includes(userRole))

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Library Admin</h2>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Back to Library</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
      type="button"
      onClick={async () => {
        try {
          await logout();
        } catch (e) {
          // swallow — logout clears client state anyway
          console.warn("logout failed:", e);
        } finally {
          navigate("/login");
        }
      }}
      className="w-full flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
