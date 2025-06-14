"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Dashboard from "@/components/Dashboard/Dashboard"
import AssetList from "@/components/Assets/AssetList"
import LoginForm from "@/components/Auth/LoginForm"
import { AuthProvider, useAuth } from "@/components/Auth/AuthProvider"
import InspectionList from "@/components/Inspections/InspectionList"
import MaintenanceList from "@/components/Maintenance/MaintenanceList"
import DisposalList from "@/components/Disposal/DisposalList"
import LossList from "@/components/Losses/LossList"
import ReportsList from "@/components/Reports/ReportsList"
import UserManagement from "@/components/Users/UserManagement"
import Settings from "@/components/Settings/Settings"

function AppContent() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")

  if (!user) {
    return <LoginForm />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "assets":
        return <AssetList />
      case "inspections":
        return <InspectionList />
      case "maintenance":
        return <MaintenanceList />
      case "disposal":
        return <DisposalList />
      case "losses":
        return <LossList />
      case "reports":
        return <ReportsList />
      case "users":
        return <UserManagement />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar onNavigate={setCurrentPage} currentPage={currentPage} />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Selamat datang, {user.name}</span>
              <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">
                Log Keluar
              </button>
            </div>
          </div>
          <div className="p-6">{renderPage()}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
