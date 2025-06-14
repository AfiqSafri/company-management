"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Package, TrendingUp, AlertTriangle, FileText, Calendar, MapPin, Users } from "lucide-react"
import { api } from "../../services/api"

interface DashboardStats {
  total_aset: number
  total_harta_modal: number
  total_inventori: number
  total_nilai_aset: number
  aset_aktif: number
  aset_pelupusan: number
  aset_hapus_kira: number
  pemeriksaan_tertunggak: number
  penyelenggaraan_tertunggak: number
}

interface RecentActivity {
  id: number
  type: string
  description: string
  date: string
  user: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_aset: 0,
    total_harta_modal: 0,
    total_inventori: 0,
    total_nilai_aset: 0,
    aset_aktif: 0,
    aset_pelupusan: 0,
    aset_hapus_kira: 0,
    pemeriksaan_tertunggak: 0,
    penyelenggaraan_tertunggak: 0,
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [statsResponse, activitiesResponse] = await Promise.all([
        api.get<DashboardStats>("/dashboard/stats"),
        api.get<RecentActivity[]>("/dashboard/recent-activities"),
      ])

      if (statsResponse.data) {
        setStats(statsResponse.data)
      }

      if (Array.isArray(activitiesResponse.data)) {
        setRecentActivities(activitiesResponse.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Keep default values on error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuatkan papan pemuka...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Papan Pemuka</h1>
          <p className="text-gray-600">Sistem Pengurusan Aset Masjid & Surau</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Laporan Tahunan
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Jadual Pemeriksaan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Aset</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_aset}</div>
            <p className="text-xs text-muted-foreground">
              Harta Modal: {stats.total_harta_modal} | Inventori: {stats.total_inventori}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Keseluruhan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM{" "}
              {stats.total_nilai_aset.toLocaleString("ms-MY", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">Mengikut harga pembelian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Aset</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Aktif</span>
                <Badge variant="default">{stats.aset_aktif}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pelupusan</span>
                <Badge variant="secondary">{stats.aset_pelupusan}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hapus Kira</span>
                <Badge variant="destructive">{stats.aset_hapus_kira}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tindakan Diperlukan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pemeriksaan Tertunggak</span>
                <Badge variant={stats.pemeriksaan_tertunggak > 0 ? "destructive" : "default"}>
                  {stats.pemeriksaan_tertunggak}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Penyelenggaraan</span>
                <Badge variant={stats.penyelenggaraan_tertunggak > 0 ? "secondary" : "default"}>
                  {stats.penyelenggaraan_tertunggak}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tindakan Pantas</CardTitle>
            <CardDescription>Akses pantas kepada fungsi utama sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Package className="h-6 w-6 mb-2" />
                <span className="text-sm">Daftar Aset Baharu</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">BR-AMS 004</span>
                <span className="text-xs text-gray-500">Pinjaman Aset</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">BR-AMS 005</span>
                <span className="text-xs text-gray-500">Pemeriksaan</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span className="text-sm">BR-AMS 009</span>
                <span className="text-xs text-gray-500">Lapor Kehilangan</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktiviti Terkini</CardTitle>
            <CardDescription>Rekod aktiviti sistem dalam 7 hari lepas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Tiada aktiviti terkini</p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === "asset_created" && <Package className="h-4 w-4 text-green-600" />}
                      {activity.type === "asset_moved" && <MapPin className="h-4 w-4 text-blue-600" />}
                      {activity.type === "inspection" && <Calendar className="h-4 w-4 text-orange-600" />}
                      {activity.type === "maintenance" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{new Date(activity.date).toLocaleDateString("ms-MY")}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BR-AMS Forms Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Borang BR-AMS</CardTitle>
          <CardDescription>
            Status borang mengikut Garis Panduan Pengurusan Aset Masjid & Surau Negeri Selangor 2023
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">BR-AMS 001</h4>
                <Badge variant="default">Harta Modal</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Senarai Daftar Harta Modal (≥RM2,000)</p>
              <p className="text-lg font-bold">{stats.total_harta_modal} aset</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">BR-AMS 002</h4>
                <Badge variant="secondary">Inventori</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Senarai Daftar Inventori (RM100-RM1,999)</p>
              <p className="text-lg font-bold">{stats.total_inventori} aset</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">BR-AMS 003</h4>
                <Badge variant="outline">Lokasi</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Senarai Aset Alih Mengikut Lokasi</p>
              <Button variant="outline" size="sm" className="w-full">
                Jana Laporan
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">BR-AMS 004</h4>
                <Badge variant="outline">Pinjaman</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Borang Pinjaman/Pergerakan Aset</p>
              <Button variant="outline" size="sm" className="w-full">
                Rekod Pinjaman
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">BR-AMS 005</h4>
                <Badge variant="outline">Pemeriksaan</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Borang Pemeriksaan Aset (Audit Tahunan)</p>
              <Button variant="outline" size="sm" className="w-full">
                Mulakan Pemeriksaan
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">BR-AMS 010</h4>
                <Badge variant="outline">Laporan</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Laporan Tahunan Pengurusan Aset</p>
              <Button variant="outline" size="sm" className="w-full">
                Jana Laporan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
