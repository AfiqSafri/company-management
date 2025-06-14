"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, AlertTriangle, Search, FileText, Eye } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface LossRecord {
  id: number
  asset_name: string
  asset_code: string
  quantity_lost: number
  total_quantity: number
  unit: string
  loss_type: string
  loss_date: string
  discovered_date: string
  location_of_loss: string
  circumstances: string
  estimated_loss_value: number
  police_report_number?: string
  status: string
  reported_by: string
}

export default function LossManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [lossForm, setLossForm] = useState({
    asset_id: "",
    quantity_lost: 1,
    loss_type: "",
    loss_date: new Date(),
    discovered_date: new Date(),
    location_of_loss: "",
    circumstances: "",
    estimated_loss_value: 0,
    police_report_number: "",
  })

  const lossRecords: LossRecord[] = [
    {
      id: 1,
      asset_name: "Laptop Dell",
      asset_code: "ALH-ELE-2023-0005",
      quantity_lost: 1,
      total_quantity: 5,
      unit: "unit",
      loss_type: "theft",
      loss_date: "2024-01-08",
      discovered_date: "2024-01-09",
      location_of_loss: "Pejabat Pentadbiran",
      circumstances: "Laptop hilang selepas program malam. Pintu pejabat didapati tidak berkunci.",
      estimated_loss_value: 3500,
      police_report_number: "IPD/2024/001234",
      status: "investigating",
      reported_by: "Ahmad bin Rahman",
    },
    {
      id: 2,
      asset_name: "Mikrofon Tanpa Wayar",
      asset_code: "ALH-AVE-2023-0008",
      quantity_lost: 2,
      total_quantity: 6,
      unit: "unit",
      loss_type: "missing",
      loss_date: "2024-01-12",
      discovered_date: "2024-01-15",
      location_of_loss: "Dewan Solat Utama",
      circumstances: "Mikrofon tidak dijumpai selepas majlis kenduri. Kemungkinan tertinggal atau terbawa pulang.",
      estimated_loss_value: 800,
      status: "reported",
      reported_by: "Siti Aminah binti Hassan",
    },
    {
      id: 3,
      asset_name: "Kerusi Plastik",
      asset_code: "ALH-FUR-2023-0012",
      quantity_lost: 10,
      total_quantity: 100,
      unit: "keping",
      loss_type: "damage",
      loss_date: "2024-01-20",
      discovered_date: "2024-01-20",
      location_of_loss: "Kawasan Tempat Letak Kereta",
      circumstances: "Kerusi rosak akibat ribut kencang. Beberapa kerusi patah dan tidak boleh digunakan.",
      estimated_loss_value: 300,
      status: "resolved",
      reported_by: "Muhammad bin Ali",
    },
  ]

  const mockAssets = [
    { id: "1", name: "Komputer Desktop", code: "ALH-ELE-2023-0001", quantity: 8, unit: "unit", value: 2500 },
    { id: "2", name: "Proyektor", code: "ALH-AVE-2023-0003", quantity: 3, unit: "unit", value: 4000 },
    { id: "3", name: "Meja Lipat", code: "ALH-FUR-2023-0007", quantity: 25, unit: "unit", value: 150 },
    { id: "4", name: "Al-Quran", code: "ALH-BOK-2023-0001", quantity: 50, unit: "keping", value: 25 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <Badge variant="outline">Dilaporkan</Badge>
      case "investigating":
        return <Badge variant="secondary">Dalam Siasatan</Badge>
      case "resolved":
        return <Badge variant="default">Diselesaikan</Badge>
      case "written_off":
        return <Badge variant="destructive">Dihapus Kira</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLossTypeText = (type: string) => {
    const types = {
      theft: "Kecurian",
      damage: "Kerosakan",
      natural_disaster: "Bencana Alam",
      accident: "Kemalangan",
      missing: "Hilang",
      other: "Lain-lain",
    }
    return types[type as keyof typeof types] || type
  }

  const handleSubmitLoss = () => {
    console.log("Loss reported:", lossForm)
    setIsDialogOpen(false)
    // Reset form
    setLossForm({
      asset_id: "",
      quantity_lost: 1,
      loss_type: "",
      loss_date: new Date(),
      discovered_date: new Date(),
      location_of_loss: "",
      circumstances: "",
      estimated_loss_value: 0,
      police_report_number: "",
    })
  }

  const totalLossValue = lossRecords.reduce((sum, record) => sum + record.estimated_loss_value, 0)
  const totalItemsLost = lossRecords.reduce((sum, record) => sum + record.quantity_lost, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengurusan Kehilangan</h1>
          <p className="text-muted-foreground">Urus dan jejak kehilangan aset masjid</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Lapor Kehilangan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Laporan Kehilangan Aset</DialogTitle>
              <DialogDescription>Isikan butiran kehilangan aset untuk rekod dan tindakan lanjut</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset">Pilih Aset</Label>
                  <Select
                    value={lossForm.asset_id}
                    onValueChange={(value) => setLossForm((prev) => ({ ...prev, asset_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih aset" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAssets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} ({asset.code}) - {asset.quantity} {asset.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity_lost">Kuantiti Hilang</Label>
                  <Input
                    id="quantity_lost"
                    type="number"
                    min="1"
                    value={lossForm.quantity_lost}
                    onChange={(e) =>
                      setLossForm((prev) => ({ ...prev, quantity_lost: Number.parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loss_type">Jenis Kehilangan</Label>
                <Select
                  value={lossForm.loss_type}
                  onValueChange={(value) => setLossForm((prev) => ({ ...prev, loss_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kehilangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theft">Kecurian</SelectItem>
                    <SelectItem value="damage">Kerosakan</SelectItem>
                    <SelectItem value="natural_disaster">Bencana Alam</SelectItem>
                    <SelectItem value="accident">Kemalangan</SelectItem>
                    <SelectItem value="missing">Hilang</SelectItem>
                    <SelectItem value="other">Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tarikh Kehilangan</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !lossForm.loss_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lossForm.loss_date ? format(lossForm.loss_date, "dd/MM/yyyy") : <span>Pilih tarikh</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={lossForm.loss_date}
                        onSelect={(date) => setLossForm((prev) => ({ ...prev, loss_date: date || new Date() }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Tarikh Ditemui Hilang</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !lossForm.discovered_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lossForm.discovered_date ? (
                          format(lossForm.discovered_date, "dd/MM/yyyy")
                        ) : (
                          <span>Pilih tarikh</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={lossForm.discovered_date}
                        onSelect={(date) => setLossForm((prev) => ({ ...prev, discovered_date: date || new Date() }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi Kehilangan</Label>
                  <Input
                    id="location"
                    placeholder="Masukkan lokasi kehilangan"
                    value={lossForm.location_of_loss}
                    onChange={(e) => setLossForm((prev) => ({ ...prev, location_of_loss: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_value">Anggaran Nilai Kerugian (RM)</Label>
                  <Input
                    id="estimated_value"
                    type="number"
                    step="0.01"
                    value={lossForm.estimated_loss_value}
                    onChange={(e) =>
                      setLossForm((prev) => ({ ...prev, estimated_loss_value: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="police_report">Nombor Laporan Polis (jika ada)</Label>
                <Input
                  id="police_report"
                  placeholder="Contoh: IPD/2024/001234"
                  value={lossForm.police_report_number}
                  onChange={(e) => setLossForm((prev) => ({ ...prev, police_report_number: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="circumstances">Keadaan/Sebab Kehilangan</Label>
                <Textarea
                  id="circumstances"
                  placeholder="Terangkan keadaan atau sebab kehilangan aset..."
                  value={lossForm.circumstances}
                  onChange={(e) => setLossForm((prev) => ({ ...prev, circumstances: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmitLoss}>Hantar Laporan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Kes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lossRecords.length}</div>
            <p className="text-xs text-muted-foreground">Kes kehilangan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Item Hilang</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsLost}</div>
            <p className="text-xs text-muted-foreground">Jumlah item</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Kerugian</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalLossValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Anggaran kerugian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Siasatan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lossRecords.filter((record) => record.status === "investigating").length}
            </div>
            <p className="text-xs text-muted-foreground">Kes aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Loss Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rekod Kehilangan Aset</CardTitle>
          <CardDescription>Senarai lengkap kehilangan aset yang dilaporkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kod Aset</TableHead>
                <TableHead>Nama Aset</TableHead>
                <TableHead>Kuantiti</TableHead>
                <TableHead>Jenis Kehilangan</TableHead>
                <TableHead>Tarikh Kehilangan</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Nilai Kerugian (RM)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dilaporkan Oleh</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lossRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{record.asset_code}</TableCell>
                  <TableCell className="font-medium">{record.asset_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {record.quantity_lost}/{record.total_quantity}
                      </span>
                      <span className="text-xs text-muted-foreground">{record.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getLossTypeText(record.loss_type)}</TableCell>
                  <TableCell>{record.loss_date}</TableCell>
                  <TableCell>{record.location_of_loss}</TableCell>
                  <TableCell>{record.estimated_loss_value.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{record.reported_by}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Loss Details Modal could be added here for viewing full details */}
    </div>
  )
}
