"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileDown, BarChart3, FileText } from "lucide-react"

export default function ReportsList() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [reportType, setReportType] = useState("all")

  const reports = [
    {
      id: "BR-AMS-001",
      name: "Laporan Harta Modal",
      description: "Senarai lengkap aset harta modal (≥RM2,000)",
      type: "Harta Modal",
      lastGenerated: "2024-02-15",
      totalAssets: 45,
      totalValue: 125000.0,
    },
    {
      id: "BR-AMS-002",
      name: "Laporan Inventori",
      description: "Senarai aset inventori (RM100-RM1,999)",
      type: "Inventori",
      lastGenerated: "2024-02-15",
      totalAssets: 128,
      totalValue: 45600.0,
    },
    {
      id: "BR-AMS-003",
      name: "Laporan Mengikut Lokasi",
      description: "Pembahagian aset mengikut lokasi dalam masjid",
      type: "Lokasi",
      lastGenerated: "2024-02-10",
      totalAssets: 173,
      totalValue: 170600.0,
    },
    {
      id: "BR-AMS-004",
      name: "Laporan Pelupusan",
      description: "Rekod aset yang telah dilupuskan",
      type: "Pelupusan",
      lastGenerated: "2024-01-30",
      totalAssets: 8,
      totalValue: 12500.0,
    },
  ]

  const generateReport = (reportId: string) => {
    alert(`Menjana laporan ${reportId}...`)
  }

  const exportAllReports = () => {
    alert("Mengeksport semua laporan dalam format ZIP...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laporan</h1>
          <p className="text-muted-foreground">Jana dan eksport laporan aset mengikut format BR-AMS</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportAllReports} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export Semua
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tetapan Laporan</CardTitle>
          <CardDescription>Pilih tempoh dan jenis laporan yang ingin dijana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="year">Tahun</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="month">Bulan</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bulan</SelectItem>
                  <SelectItem value="01">Januari</SelectItem>
                  <SelectItem value="02">Februari</SelectItem>
                  <SelectItem value="03">Mac</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">Mei</SelectItem>
                  <SelectItem value="06">Jun</SelectItem>
                  <SelectItem value="07">Julai</SelectItem>
                  <SelectItem value="08">Ogos</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Disember</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reportType">Jenis Laporan</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="Harta Modal">Harta Modal</SelectItem>
                  <SelectItem value="Inventori">Inventori</SelectItem>
                  <SelectItem value="Lokasi">Mengikut Lokasi</SelectItem>
                  <SelectItem value="Pelupusan">Pelupusan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Tapis Laporan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription className="mt-1">{report.description}</CardDescription>
                </div>
                <Badge variant="outline">{report.id}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Jumlah Aset</div>
                    <div className="font-semibold text-lg">{report.totalAssets}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Jumlah Nilai</div>
                    <div className="font-semibold text-lg">
                      RM {report.totalValue.toLocaleString("ms-MY", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Dijana terakhir: {new Date(report.lastGenerated).toLocaleDateString("ms-MY")}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => generateReport(report.id)} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Jana Laporan
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Statistik</CardTitle>
          <CardDescription>Statistik keseluruhan aset untuk tahun {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">173</div>
              <div className="text-sm text-blue-600">Jumlah Aset</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">RM 170,600</div>
              <div className="text-sm text-green-600">Jumlah Nilai</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <div className="text-sm text-yellow-600">Perlu Penyelenggaraan</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-red-600">Kehilangan/Rosak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
