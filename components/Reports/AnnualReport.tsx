"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, TrendingUp, Package, DollarSign } from "lucide-react"

export default function AnnualReport() {
  const currentReport = {
    report_year: 2024,
    total_assets_count: 127,
    total_assets_value: 245000,
    harta_modal_count: 45,
    harta_modal_value: 195000,
    inventori_count: 82,
    inventori_value: 50000,
    new_acquisitions_count: 15,
    new_acquisitions_value: 35000,
    disposals_count: 3,
    disposals_value: 2500,
    losses_count: 1,
    losses_value: 800,
    maintenance_cost: 12500,
    status: "draft",
  }

  const assetSummary = [
    { category: "Furniture", count: 45, value: 85000, percentage: 34.7 },
    { category: "Equipment", count: 32, value: 120000, percentage: 49.0 },
    { category: "Electronics", count: 28, value: 35000, percentage: 14.3 },
    { category: "Vehicle", count: 3, value: 75000, percentage: 30.6 },
    { category: "Others", count: 19, value: 5000, percentage: 2.0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Tahunan Aset</h1>
          <p className="text-muted-foreground">BR-AMS 010 - Laporan Tahunan Pengurusan Aset</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Draf</Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Eksport PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          <TabsTrigger value="breakdown">Pecahan Aset</TabsTrigger>
          <TabsTrigger value="activities">Aktiviti</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jumlah Aset</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentReport.total_assets_count}</div>
                <p className="text-xs text-muted-foreground">Aset berdaftar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jumlah Nilai</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">RM {currentReport.total_assets_value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Nilai aset semasa</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Perolehan Baru</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentReport.new_acquisitions_count}</div>
                <p className="text-xs text-muted-foreground">
                  RM {currentReport.new_acquisitions_value.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kos Penyelenggaraan</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">RM {currentReport.maintenance_cost.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Penyelenggaraan tahunan</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Harta Modal</CardTitle>
                <CardDescription>Aset ≥ RM1,000</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bilangan:</span>
                    <span className="font-semibold">{currentReport.harta_modal_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nilai:</span>
                    <span className="font-semibold">RM {currentReport.harta_modal_value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peratusan:</span>
                    <span className="font-semibold">
                      {((currentReport.harta_modal_value / currentReport.total_assets_value) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventori</CardTitle>
                <CardDescription>Aset &lt; RM1,000</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bilangan:</span>
                    <span className="font-semibold">{currentReport.inventori_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nilai:</span>
                    <span className="font-semibold">RM {currentReport.inventori_value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peratusan:</span>
                    <span className="font-semibold">
                      {((currentReport.inventori_value / currentReport.total_assets_value) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pecahan Aset Mengikut Kategori</CardTitle>
              <CardDescription>Pecahan terperinci aset mengikut kategori untuk 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Bilangan</TableHead>
                    <TableHead className="text-right">Nilai (RM)</TableHead>
                    <TableHead className="text-right">Peratusan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetSummary.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.percentage.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Perolehan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{currentReport.new_acquisitions_count}</div>
                  <p className="text-sm text-muted-foreground">
                    Jumlah nilai: RM {currentReport.new_acquisitions_value.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pelupusan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{currentReport.disposals_count}</div>
                  <p className="text-sm text-muted-foreground">
                    Jumlah nilai: RM {currentReport.disposals_value.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kehilangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{currentReport.losses_count}</div>
                  <p className="text-sm text-muted-foreground">
                    Jumlah nilai: RM {currentReport.losses_value.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
