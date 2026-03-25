import { LayoutDashboard, Package, Users, Settings2, CheckCircle, DollarSign, Shield, ScrollText } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Demands", url: "/demands", icon: Package },
  { title: "BDSP Marketplace", url: "/marketplace", icon: Users },
  { title: "Assignments", url: "/assignments", icon: Settings2 },
  { title: "QA & Verification", url: "/qa", icon: CheckCircle },
  { title: "Payments", url: "/payments", icon: DollarSign },
  { title: "Admin Panel", url: "/admin", icon: Shield },
  { title: "Event Log", url: "/events", icon: ScrollText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-heading font-bold text-sm">IM</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-sm text-sidebar-foreground">IMARA BD</h1>
              <p className="text-[10px] text-sidebar-foreground/60">Marketplace v2.0</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mx-auto">
            <span className="text-secondary-foreground font-heading font-bold text-sm">IM</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
