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
import { Search, Plus, Eye, Edit, FileDown } from "lucide-react"

interface Inspection {
  id: string
  assetId: string
  assetName: string
  inspectionDate: string
  inspector: string
  status: "Baik" | "Perlu Penyelenggaraan" | "Rosak"
  condition: string
  recommendations: string
  nextInspectionDate: string
}

export default function InspectionList() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock data
  useEffect(() => {
    const mockInspections: Inspection[] = [
      {
        id: "INS001",
        assetId: "MTAJ/HM/24/001",
        assetName: "Sistem Penghawa Dingin Utama",
        inspectionDate: "2024-01-15",
        inspector: "Ahmad bin Ali",
        status: "Baik",
        condition: "Berfungsi dengan baik, tiada kerosakan",
        recommendations: "Penyelenggaraan rutin setiap 3 bulan",
        nextInspectionDate: "2024-04-15",
      },
      {
        id: "INS002",
        assetId: "MTAJ/HM/24/002",
        assetName: "Generator Elektrik",
        inspectionDate: "2024-01-10",
        inspector: "Siti Aminah",
        status: "Perlu Penyelenggaraan",
        condition: "Bunyi tidak normal semasa beroperasi",
        recommendations: "Perlu servis enjin dan tukar minyak",
        nextInspectionDate: "2024-02-10",
      },
      {
        id: "INS003",
        assetId: "MTAJ/I/24/001",
        assetName: "Kerusi Plastik (Set 50)",
        inspectionDate: "2024-01-08",
        inspector: "Muhammad Farid",
        status: "Rosak",
        condition: "5 unit kerusi patah, perlu diganti",
        recommendations: "Ganti kerusi yang rosak, simpan di tempat selamat",
        nextInspectionDate: "2024-07-08",
      },
    ]
    setInspections(mockInspections)
  }, [])

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || inspection.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Baik":
        return "bg-green-100 text-green-800"
      case "Perlu Penyelenggaraan":
        return "bg-yellow-100 text-yellow-800"
      case "Rosak":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportToExcel = () => {
    // Mock export functionality
    alert("Laporan pemeriksaan akan dimuat turun dalam format Excel")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pemeriksaan Aset</h1>
          <p className="text-muted-foreground">Pengurusan pemeriksaan dan penilaian kondisi aset</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pemeriksaan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Pemeriksaan Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetId">ID Aset</Label>
                    <Input id="assetId" placeholder="Pilih aset..." />
                  </div>
                  <div>
                    <Label htmlFor="inspectionDate">Tarikh Pemeriksaan</Label>
                    <Input id="inspectionDate" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inspector">Pemeriksa</Label>
                    <Input id="inspector" placeholder="Nama pemeriksa" />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baik">Baik</SelectItem>
                        <SelectItem value="Perlu Penyelenggaraan">Perlu Penyelenggaraan</SelectItem>
                        <SelectItem value="Rosak">Rosak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="condition">Keadaan Aset</Label>
                  <Textarea id="condition" placeholder="Huraikan keadaan aset..." />
                </div>
                <div>
                  <Label htmlFor="recommendations">Cadangan</Label>
                  <Textarea id="recommendations" placeholder="Cadangan tindakan..." />
                </div>
                <div>
                  <Label htmlFor="nextInspection">Tarikh Pemeriksaan Seterusnya</Label>
                  <Input id="nextInspection" type="date" />
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
            <CardTitle className="text-sm font-medium">Jumlah Pemeriksaan</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Baik</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspections.filter((i) => i.status === "Baik").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Penyelenggaraan</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inspections.filter((i) => i.status === "Perlu Penyelenggaraan").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rosak</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspections.filter((i) => i.status === "Rosak").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Senarai Pemeriksaan</CardTitle>
          <CardDescription>Rekod pemeriksaan aset yang telah dilakukan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari aset, ID, atau pemeriksa..."
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
                <SelectItem value="Baik">Baik</SelectItem>
                <SelectItem value="Perlu Penyelenggaraan">Perlu Penyelenggaraan</SelectItem>
                <SelectItem value="Rosak">Rosak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pemeriksaan</TableHead>
                <TableHead>ID Aset</TableHead>
                <TableHead>Nama Aset</TableHead>
                <TableHead>Tarikh</TableHead>
                <TableHead>Pemeriksa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pemeriksaan Seterusnya</TableHead>
                <TableHead>Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.id}</TableCell>
                  <TableCell>{inspection.assetId}</TableCell>
                  <TableCell>{inspection.assetName}</TableCell>
                  <TableCell>{new Date(inspection.inspectionDate).toLocaleDateString("ms-MY")}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inspection.status)}>{inspection.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(inspection.nextInspectionDate).toLocaleDateString("ms-MY")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
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
