"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Edit, Eye, Trash2, FileText, Download } from "lucide-react"
import { api } from "../../services/api"
import AssetForm from "./AssetForm"

interface Asset {
  id: number
  no_siri_pendaftaran: string
  keterangan_aset: string
  cara_aset_diperoleh: string
  tarikh_pembelian: string
  harga_pembelian: number
  penempatan: string
  status_aset: string
  jenis_aset: string
  pegawai_penempatan: string
  kategori: string
  jenama_model?: string
  no_siri_pembekal?: string
  tempoh_jaminan?: string
  created_at: string
  updated_at: string
}

interface AssetListProps {
  onEdit?: (asset: Asset) => void
  onView?: (asset: Asset) => void
}

export default function AssetList({ onEdit, onView }: AssetListProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [jenisFilter, setJenisFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kategoriFilter, setKategoriFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [search, jenisFilter, statusFilter, kategoriFilter, currentPage])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: currentPage,
        search: search || undefined,
        jenis_aset: jenisFilter !== "all" ? jenisFilter : undefined,
        status_aset: statusFilter !== "all" ? statusFilter : undefined,
        kategori: kategoriFilter !== "all" ? kategoriFilter : undefined,
      }

      const response = await api.get("/assets", params)
      setAssets(response.data || [])
      setTotalPages(response.meta?.last_page || 1)
    } catch (error) {
      console.error("Error fetching assets:", error)
      setError("Gagal memuatkan data aset")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingAsset(null)
    setShowForm(true)
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setShowForm(true)
  }

  const handleView = (asset: Asset) => {
    setViewingAsset(asset)
  }

  const handleDelete = async (asset: Asset) => {
    try {
      await api.delete(`/assets/${asset.id}`)
      fetchAssets()
    } catch (error) {
      console.error("Error deleting asset:", error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingAsset(null)
    fetchAssets()
  }

  const handleExport = async (format: string) => {
    try {
      const response = await api.get("/assets/export", { format })
      // In a real app, this would trigger a file download
      console.log("Export data:", response.data)
      alert(`Export ${format.toUpperCase()} berjaya dijana!`)
    } catch (error) {
      console.error("Error exporting:", error)
    }
  }

  const generateReport = async (reportType: string) => {
    try {
      const response = await api.get(`/assets/reports/${reportType}`)
      console.log(`${reportType.toUpperCase()} Report:`, response.data)
      alert(`Laporan ${reportType.toUpperCase()} berjaya dijana!`)
    } catch (error) {
      console.error("Error generating report:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Aktif: "default",
      Pelupusan: "secondary",
      "Hapus Kira": "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
  }

  const getJenisAsetBadge = (jenis: string) => {
    return (
      <Badge variant={jenis === "HM" ? "default" : "secondary"}>{jenis === "HM" ? "Harta Modal" : "Inventori"}</Badge>
    )
  }

  // Calculate statistics
  const totalAssets = assets.length
  const totalValue = assets.reduce((sum, asset) => sum + asset.harga_pembelian, 0)
  const activeAssets = assets.filter((asset) => asset.status_aset === "Aktif").length
  const disposalAssets = assets.filter((asset) => asset.status_aset === "Pelupusan").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengurusan Aset</h1>
          <p className="text-muted-foreground">Sistem pengurusan aset mengikut borang BR-AMS</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Aset
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Aset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">Item berdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Nilai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {totalValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Nilai keseluruhan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aset Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssets}</div>
            <p className="text-xs text-muted-foreground">Dalam keadaan baik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pelupusan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disposalAssets}</div>
            <p className="text-xs text-muted-foreground">Menunggu pelupusan</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Senarai Aset</CardTitle>
              <CardDescription>Pengurusan lengkap aset mengikut borang BR-AMS</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => generateReport("br-ams-001")}>
                <FileText className="h-4 w-4 mr-2" />
                BR-AMS 001
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateReport("br-ams-002")}>
                <FileText className="h-4 w-4 mr-2" />
                BR-AMS 002
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateReport("br-ams-003")}>
                <FileText className="h-4 w-4 mr-2" />
                BR-AMS 003
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari aset..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Jenis Aset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="HM">Harta Modal</SelectItem>
                <SelectItem value="I">Inventori</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Pelupusan">Pelupusan</SelectItem>
                <SelectItem value="Hapus Kira">Hapus Kira</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Elektronik">Elektronik</SelectItem>
                <SelectItem value="Perabot">Perabot</SelectItem>
                <SelectItem value="Kenderaan">Kenderaan</SelectItem>
                <SelectItem value="Jentera">Jentera</SelectItem>
                <SelectItem value="Tekstil">Tekstil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {/* Assets Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Siri</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Harga (RM)</TableHead>
                  <TableHead>Penempatan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Memuatkan...
                    </TableCell>
                  </TableRow>
                ) : assets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Tiada aset dijumpai
                    </TableCell>
                  </TableRow>
                ) : (
                  assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono text-sm">{asset.no_siri_pendaftaran}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.keterangan_aset}</div>
                          <div className="text-sm text-gray-500">{asset.kategori}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getJenisAsetBadge(asset.jenis_aset)}</TableCell>
                      <TableCell className="font-mono">
                        {asset.harga_pembelian.toLocaleString("ms-MY", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.penempatan}</div>
                          <div className="text-sm text-gray-500">{asset.pegawai_penempatan}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status_aset)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(asset)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(asset)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Padam Aset</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Adakah anda pasti ingin memadam aset "{asset.keterangan_aset}"? Tindakan ini tidak
                                  boleh dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(asset)}>Padam</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelum
              </Button>
              <span className="flex items-center px-3 text-sm">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Seterusnya
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AssetForm
            assetId={editingAsset?.id}
            initialData={editingAsset}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Asset View Dialog */}
      <Dialog open={!!viewingAsset} onOpenChange={() => setViewingAsset(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Butiran Aset</DialogTitle>
            <DialogDescription>Maklumat lengkap aset</DialogDescription>
          </DialogHeader>
          {viewingAsset && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">No. Siri Pendaftaran</label>
                  <p className="font-mono">{viewingAsset.no_siri_pendaftaran}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Jenis Aset</label>
                  <p>{getJenisAsetBadge(viewingAsset.jenis_aset)}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Keterangan Aset</label>
                  <p>{viewingAsset.keterangan_aset}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cara Diperoleh</label>
                  <p>{viewingAsset.cara_aset_diperoleh}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tarikh Pembelian</label>
                  <p>{viewingAsset.tarikh_pembelian}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Harga Pembelian</label>
                  <p className="font-mono">
                    RM {viewingAsset.harga_pembelian.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p>{getStatusBadge(viewingAsset.status_aset)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Penempatan</label>
                  <p>{viewingAsset.penempatan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Pegawai Penempatan</label>
                  <p>{viewingAsset.pegawai_penempatan}</p>
                </div>
                {viewingAsset.jenama_model && (
                  <div>
                    <label className="text-sm font-medium">Jenama/Model</label>
                    <p>{viewingAsset.jenama_model}</p>
                  </div>
                )}
                {viewingAsset.no_siri_pembekal && (
                  <div>
                    <label className="text-sm font-medium">No. Siri Pembekal</label>
                    <p className="font-mono">{viewingAsset.no_siri_pembekal}</p>
                  </div>
                )}
                {viewingAsset.tempoh_jaminan && (
                  <div>
                    <label className="text-sm font-medium">Tempoh Jaminan</label>
                    <p>{viewingAsset.tempoh_jaminan}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
