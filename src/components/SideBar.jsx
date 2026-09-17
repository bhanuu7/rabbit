import {
  Home,
  Beer,
  Settings,
  Users,
  LogOut,
  PackageCheck,
  Warehouse,
  BottleWine,
  Wine,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Products", url: "/products", icon: Wine },
  { title: "Inventory", url: "/inventory", icon: Beer },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Orders", url: "/orders", icon: PackageCheck },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    await signOut();
    localStorage.clear();
    toast.success("Logged out successfully", { position: "top-center" });
    navigate("/");
  };
  return (
    <Sidebar collapsible="offcanvas">
      {/* <SidebarHeader className="flex items-center justify-center py-4">
        <div className="h-8 w-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold">
          R
        </div>
      </SidebarHeader> */}

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={location.pathname === item.url}
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-red-500">
              <LogOut />
              <span onClick={handleLogout}>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
