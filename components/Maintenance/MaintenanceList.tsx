"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Wrench, FileDown, AlertCircle } from "lucide-react"

interface MaintenanceRecord {
  id: string
  assetId: string
  assetName: string
  maintenanceType: "Pencegahan" | "Pembaikan" | "Kecemasan"
  scheduledDate: string
  completedDate?: string
  status: "Dijadualkan" | "Dalam Proses" | "Selesai" | "Tertunda"
  cost: number
  contractor: string
  description: string
  nextMaintenanceDate?: string
}

export default function MaintenanceList() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    const mockRecords: MaintenanceRecord[] = [
      {
        id: "MNT001",
        assetId: "MTAJ/HM/24/001",
        assetName: "Sistem Penghawa Dingin Utama",
        maintenanceType: "Pencegahan",
        scheduledDate: "2024-02-15",
        completedDate: "2024-02-15",
        status: "Selesai",
        cost: 850.0,
        contractor: "Syarikat Penyelenggaraan ABC",
        description: "Pembersihan filter dan pemeriksaan sistem",
        nextMaintenanceDate: "2024-05-15",
      },
      {
        id: "MNT002",
        assetId: "MTAJ/HM/24/002",
        assetName: "Generator Elektrik",
        maintenanceType: "Pembaikan",
        scheduledDate: "2024-02-20",
        status: "Dalam Proses",
        cost: 1200.0,
        contractor: "Bengkel Jentera Sdn Bhd",
        description: "Pembaikan enjin dan tukar komponen rosak",
      },
      {
        id: "MNT003",
        assetId: "MTAJ/HM/24/003",
        assetName: "Sistem Bunyi",
        maintenanceType: "Kecemasan",
        scheduledDate: "2024-02-10",
        status: "Tertunda",
        cost: 450.0,
        contractor: "Audio Tech Solutions",
        description: "Pembaikan mikrofon dan speaker yang rosak",
      },
    ]
    setMaintenanceRecords(mockRecords)
  }, [])

  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      record.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.contractor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.maintenanceType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800"
      case "Dalam Proses":
        return "bg-blue-100 text-blue-800"
      case "Dijadualkan":
        return "bg-yellow-100 text-yellow-800"
      case "Tertunda":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Pencegahan":
        return "bg-green-100 text-green-800"
      case "Pembaikan":
        return "bg-orange-100 text-orange-800"
      case "Kecemasan":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalCost = filteredRecords.reduce((sum, record) => sum + record.cost, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Penyelenggaraan Aset</h1>
          <p className="text-muted-foreground">Pengurusan jadual dan rekod penyelenggaraan aset</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Jadual Penyelenggaraan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Jadual Penyelenggaraan Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetId">ID Aset</Label>
                    <Input id="assetId" placeholder="Pilih aset..." />
                  </div>
                  <div>
                    <Label htmlFor="maintenanceType">Jenis Penyelenggaraan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pencegahan">Pencegahan</SelectItem>
                        <SelectItem value="Pembaikan">Pembaikan</SelectItem>
                        <SelectItem value="Kecemasan">Kecemasan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">Tarikh Dijadualkan</Label>
                    <Input id="scheduledDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="cost">Anggaran Kos (RM)</Label>
                    <Input id="cost" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contractor">Kontraktor/Vendor</Label>
                  <Input id="contractor" placeholder="Nama syarikat atau individu" />
                </div>
                <div>
                  <Label htmlFor="description">Huraian Kerja</Label>
                  <Textarea id="description" placeholder="Huraikan kerja penyelenggaraan yang perlu dilakukan..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Penyelenggaraan</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRecords.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceRecords.filter((r) => r.status === "Dalam Proses").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tertunda</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRecords.filter((r) => r.status === "Tertunda").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Kos</CardTitle>
            <div className="text-xs text-muted-foreground">RM</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCost.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Rekod Penyelenggaraan</CardTitle>
          <CardDescription>Senarai jadual dan rekod penyelenggaraan aset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari aset, kontraktor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Dijadualkan">Dijadualkan</SelectItem>
                <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Tertunda">Tertunda</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="Pencegahan">Pencegahan</SelectItem>
                <SelectItem value="Pembaikan">Pembaikan</SelectItem>
                <SelectItem value="Kecemasan">Kecemasan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Aset</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Tarikh Jadual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kos (RM)</TableHead>
                <TableHead>Kontraktor</TableHead>
                <TableHead>Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.assetName}</div>
                      <div className="text-sm text-muted-foreground">{record.assetId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(record.maintenanceType)}>{record.maintenanceType}</Badge>
                  </TableCell>
                  <TableCell>{new Date(record.scheduledDate).toLocaleDateString("ms-MY")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell>{record.cost.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{record.contractor}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Lihat
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
