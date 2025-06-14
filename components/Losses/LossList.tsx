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
import { Search, Plus, AlertTriangle, FileDown, Shield } from "lucide-react"

interface LossRecord {
  id: string
  assetId: string
  assetName: string
  originalValue: number
  lossType: "Kecurian" | "Kerosakan" | "Hilang" | "Bencana Alam"
  lossDate: string
  reportDate: string
  reportedBy: string
  description: string
  policeReport?: string
  insuranceClaim?: number
  status: "Dilaporkan" | "Disiasat" | "Selesai" | "Ditutup"
  actionTaken: string
}

export default function LossList() {
  const [lossRecords, setLossRecords] = useState<LossRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    const mockRecords: LossRecord[] = [
      {
        id: "LOSS001",
        assetId: "MTAJ/I/24/025",
        assetName: "Laptop Dell Inspiron",
        originalValue: 2800.0,
        lossType: "Kecurian",
        lossDate: "2024-01-15",
        reportDate: "2024-01-16",
        reportedBy: "Ahmad bin Hassan",
        description: "Laptop hilang dari pejabat imam. Pintu pejabat dipecah masuk pada waktu malam.",
        policeReport: "IPD Shah Alam - 15012024001",
        insuranceClaim: 2500.0,
        status: "Disiasat",
        actionTaken: "Laporan polis dibuat, klaim insurans dihantar",
      },
      {
        id: "LOSS002",
        assetId: "MTAJ/I/23/089",
        assetName: "Kipas Angin Dinding (3 unit)",
        originalValue: 450.0,
        lossType: "Kerosakan",
        lossDate: "2024-02-03",
        reportDate: "2024-02-03",
        reportedBy: "Siti Fatimah",
        description: "Kipas rosak akibat litar pintas semasa hujan lebat",
        status: "Selesai",
        actionTaken: "Kipas diganti dengan yang baru, sistem elektrik diperiksa",
      },
      {
        id: "LOSS003",
        assetId: "MTAJ/HM/24/012",
        assetName: "Mesin Rumput",
        originalValue: 1200.0,
        lossType: "Hilang",
        lossDate: "2024-02-10",
        reportDate: "2024-02-12",
        reportedBy: "Encik Razak",
        description: "Mesin rumput hilang dari stor. Kemungkinan terlupa dikunci.",
        status: "Dilaporkan",
        actionTaken: "Siasatan dalaman sedang dijalankan",
      },
    ]
    setLossRecords(mockRecords)
  }, [])

  const filteredRecords = lossRecords.filter((record) => {
    const matchesSearch =
      record.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.lossType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800"
      case "Disiasat":
        return "bg-blue-100 text-blue-800"
      case "Dilaporkan":
        return "bg-yellow-100 text-yellow-800"
      case "Ditutup":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Kecurian":
        return "bg-red-100 text-red-800"
      case "Kerosakan":
        return "bg-orange-100 text-orange-800"
      case "Hilang":
        return "bg-yellow-100 text-yellow-800"
      case "Bencana Alam":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalLossValue = filteredRecords.reduce((sum, record) => sum + record.originalValue, 0)
  const totalInsuranceClaim = filteredRecords.reduce((sum, record) => sum + (record.insuranceClaim || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kehilangan Aset</h1>
          <p className="text-muted-foreground">Pengurusan rekod kehilangan dan kerosakan aset</p>
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
                Lapor Kehilangan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Laporan Kehilangan Aset</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetId">ID Aset</Label>
                    <Input id="assetId" placeholder="Pilih aset yang hilang..." />
                  </div>
                  <div>
                    <Label htmlFor="lossType">Jenis Kehilangan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kecurian">Kecurian</SelectItem>
                        <SelectItem value="Kerosakan">Kerosakan</SelectItem>
                        <SelectItem value="Hilang">Hilang</SelectItem>
                        <SelectItem value="Bencana Alam">Bencana Alam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lossDate">Tarikh Kehilangan</Label>
                    <Input id="lossDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="reportedBy">Dilaporkan Oleh</Label>
                    <Input id="reportedBy" placeholder="Nama pelapor" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Huraian Kejadian</Label>
                  <Textarea id="description" placeholder="Huraikan bagaimana kehilangan berlaku..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policeReport">No. Laporan Polis (jika ada)</Label>
                    <Input id="policeReport" placeholder="Contoh: IPD Shah Alam - 15012024001" />
                  </div>
                  <div>
                    <Label htmlFor="insuranceClaim">Tuntutan Insurans (RM)</Label>
                    <Input id="insuranceClaim" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="actionTaken">Tindakan Diambil</Label>
                  <Textarea id="actionTaken" placeholder="Nyatakan tindakan yang telah atau akan diambil..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Hantar Laporan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Kehilangan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lossRecords.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Siasatan</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lossRecords.filter((r) => r.status === "Disiasat").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Kerugian</CardTitle>
            <div className="text-xs text-muted-foreground">RM</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLossValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tuntutan Insurans</CardTitle>
            <div className="text-xs text-muted-foreground">RM</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalInsuranceClaim.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Rekod Kehilangan</CardTitle>
          <CardDescription>Senarai aset yang hilang atau rosak</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari aset, huraian..."
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
                <SelectItem value="Dilaporkan">Dilaporkan</SelectItem>
                <SelectItem value="Disiasat">Disiasat</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Ditutup">Ditutup</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="Kecurian">Kecurian</SelectItem>
                <SelectItem value="Kerosakan">Kerosakan</SelectItem>
                <SelectItem value="Hilang">Hilang</SelectItem>
                <SelectItem value="Bencana Alam">Bencana Alam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Aset</TableHead>
                <TableHead>Jenis Kehilangan</TableHead>
                <TableHead>Tarikh</TableHead>
                <TableHead>Nilai (RM)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pelapor</TableHead>
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
                    <Badge className={getTypeColor(record.lossType)}>{record.lossType}</Badge>
                  </TableCell>
                  <TableCell>{new Date(record.lossDate).toLocaleDateString("ms-MY")}</TableCell>
                  <TableCell>{record.originalValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell>{record.reportedBy}</TableCell>
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
