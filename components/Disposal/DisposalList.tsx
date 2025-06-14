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
import { Search, Plus, Trash2, FileDown, AlertTriangle } from "lucide-react"

interface DisposalRecord {
  id: string
  assetId: string
  assetName: string
  originalValue: number
  disposalMethod: "Jual" | "Derma" | "Lupus" | "Tukar Ganti"
  disposalDate: string
  disposalValue: number
  reason: string
  approvedBy: string
  status: "Cadangan" | "Diluluskan" | "Selesai" | "Ditolak"
  buyer?: string
  documents: string[]
}

export default function DisposalList() {
  const [disposalRecords, setDisposalRecords] = useState<DisposalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    const mockRecords: DisposalRecord[] = [
      {
        id: "DSP001",
        assetId: "MTAJ/HM/23/015",
        assetName: "Komputer Desktop Lama",
        originalValue: 2500.0,
        disposalMethod: "Jual",
        disposalDate: "2024-01-20",
        disposalValue: 300.0,
        reason: "Sudah usang dan tidak dapat dibaiki",
        approvedBy: "Pengerusi Jawatankuasa",
        status: "Selesai",
        buyer: "Syarikat Komputer Terpakai",
        documents: ["Borang BR-AMS 004", "Resit Jualan"],
      },
      {
        id: "DSP002",
        assetId: "MTAJ/I/23/045",
        assetName: "Kerusi Kayu (10 unit)",
        originalValue: 800.0,
        disposalMethod: "Derma",
        disposalDate: "2024-02-15",
        disposalValue: 0.0,
        reason: "Kerusi rosak, masih boleh digunakan selepas pembaikan",
        approvedBy: "Imam Masjid",
        status: "Diluluskan",
        buyer: "Surau Al-Ikhlas",
        documents: ["Borang BR-AMS 004", "Surat Derma"],
      },
      {
        id: "DSP003",
        assetId: "MTAJ/HM/24/008",
        assetName: "Mesin Basuh",
        originalValue: 1800.0,
        disposalMethod: "Lupus",
        disposalDate: "2024-03-01",
        disposalValue: 0.0,
        reason: "Rosak teruk, tidak ekonomik untuk dibaiki",
        approvedBy: "Bendahari",
        status: "Cadangan",
        documents: ["Borang BR-AMS 004"],
      },
    ]
    setDisposalRecords(mockRecords)
  }, [])

  const filteredRecords = disposalRecords.filter((record) => {
    const matchesSearch =
      record.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesMethod = methodFilter === "all" || record.disposalMethod === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800"
      case "Diluluskan":
        return "bg-blue-100 text-blue-800"
      case "Cadangan":
        return "bg-yellow-100 text-yellow-800"
      case "Ditolak":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Jual":
        return "bg-green-100 text-green-800"
      case "Derma":
        return "bg-blue-100 text-blue-800"
      case "Tukar Ganti":
        return "bg-purple-100 text-purple-800"
      case "Lupus":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalOriginalValue = filteredRecords.reduce((sum, record) => sum + record.originalValue, 0)
  const totalDisposalValue = filteredRecords.reduce((sum, record) => sum + record.disposalValue, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pelupusan Aset</h1>
          <p className="text-muted-foreground">Pengurusan pelupusan dan penjualan aset</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export BR-AMS 004
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Cadang Pelupusan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadangan Pelupusan Aset</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetId">ID Aset</Label>
                    <Input id="assetId" placeholder="Pilih aset untuk dilupuskan..." />
                  </div>
                  <div>
                    <Label htmlFor="disposalMethod">Kaedah Pelupusan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kaedah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jual">Jual</SelectItem>
                        <SelectItem value="Derma">Derma</SelectItem>
                        <SelectItem value="Lupus">Lupus</SelectItem>
                        <SelectItem value="Tukar Ganti">Tukar Ganti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="disposalDate">Tarikh Pelupusan</Label>
                    <Input id="disposalDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="disposalValue">Nilai Pelupusan (RM)</Label>
                    <Input id="disposalValue" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Sebab Pelupusan</Label>
                  <Textarea id="reason" placeholder="Nyatakan sebab aset perlu dilupuskan..." />
                </div>
                <div>
                  <Label htmlFor="buyer">Pembeli/Penerima (jika berkenaan)</Label>
                  <Input id="buyer" placeholder="Nama pembeli atau organisasi penerima" />
                </div>
                <div>
                  <Label htmlFor="approver">Diluluskan Oleh</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pelulus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imam">Imam Masjid</SelectItem>
                      <SelectItem value="pengerusi">Pengerusi Jawatankuasa</SelectItem>
                      <SelectItem value="bendahari">Bendahari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Hantar Cadangan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Pelupusan</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disposalRecords.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Kelulusan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disposalRecords.filter((r) => r.status === "Cadangan").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Asal</CardTitle>
            <div className="text-xs text-muted-foreground">RM</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOriginalValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Pelupusan</CardTitle>
            <div className="text-xs text-muted-foreground">RM</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDisposalValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Rekod Pelupusan</CardTitle>
          <CardDescription>Senarai aset yang telah atau akan dilupuskan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari aset, sebab pelupusan..."
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
                <SelectItem value="Cadangan">Cadangan</SelectItem>
                <SelectItem value="Diluluskan">Diluluskan</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter kaedah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kaedah</SelectItem>
                <SelectItem value="Jual">Jual</SelectItem>
                <SelectItem value="Derma">Derma</SelectItem>
                <SelectItem value="Lupus">Lupus</SelectItem>
                <SelectItem value="Tukar Ganti">Tukar Ganti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Aset</TableHead>
                <TableHead>Kaedah</TableHead>
                <TableHead>Nilai Asal</TableHead>
                <TableHead>Nilai Pelupusan</TableHead>
                <TableHead>Tarikh</TableHead>
                <TableHead>Status</TableHead>
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
                    <Badge className={getMethodColor(record.disposalMethod)}>{record.disposalMethod}</Badge>
                  </TableCell>
                  <TableCell>RM {record.originalValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>RM {record.disposalValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{new Date(record.disposalDate).toLocaleDateString("ms-MY")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                  </TableCell>
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
