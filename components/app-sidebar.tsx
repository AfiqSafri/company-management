"use client"

import { Home, Package, FileText, Settings, Users, Wrench, Trash2, AlertTriangle, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Pengurusan Aset",
    url: "assets",
    icon: Package,
  },
  {
    title: "Pemeriksaan Aset",
    url: "inspections",
    icon: FileText,
  },
  {
    title: "Penyelenggaraan",
    url: "maintenance",
    icon: Wrench,
  },
  {
    title: "Pelupusan Aset",
    url: "disposal",
    icon: Trash2,
  },
  {
    title: "Kehilangan Aset",
    url: "losses",
    icon: AlertTriangle,
  },
  {
    title: "Laporan",
    url: "reports",
    icon: BarChart3,
  },
  {
    title: "Pengurusan Pengguna",
    url: "users",
    icon: Users,
  },
  {
    title: "Tetapan",
    url: "settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  onNavigate: (page: string) => void
  currentPage: string
}

export function AppSidebar({ onNavigate, currentPage }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sistem Pengurusan Aset Masjid</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={currentPage === item.url} onClick={() => onNavigate(item.url)}>
                    <button className="flex items-center gap-2 w-full">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
