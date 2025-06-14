"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, TrendingUp, Package, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { api } from "../../services/api"
import { format } from "date-fns"

interface AnnualReportData {
  id: number
  report_year: number
  total_assets_count: number
  total_assets_value: number
  harta_modal_count: number
  harta_modal_value: number
  inventori_count: number
  inventori_value: number
  new_acquisitions_count: number
  new_acquisitions_value: number
  disposals_count: number
  disposals_value: number
  losses_count: number
  losses_value: number
  maintenance_cost: number
  status: "draft" | "submitted" | "approved"
  prepared_by: string
  submission_date: string | null
  approval_date: string | null
  mosque_name: string
}

interface AssetSummary {
  category: string
  count: number
  value: number
  percentage: number
}

export default function AnnualReport() {
  const [reports, setReports] = useState<AnnualReportData[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [currentReport, setCurrentReport] = useState<AnnualReportData | null>(null)
  const [assetSummary, setAssetSummary] = useState<AssetSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    if (selectedYear) {
      fetchAnnualReport(selectedYear)
    }
  }, [selectedYear])

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports/annual")
      setReports(response.data)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnnualReport = async (year: number) => {
    try {
      setLoading(true)
      const [reportResponse, summaryResponse] = await Promise.all([
        api.get(`/reports/annual/${year}`),
        api.get(`/reports/assets/summary?year=${year}`),
      ])

      setCurrentReport(reportResponse.data)
      setAssetSummary(summaryResponse.data)
    } catch (error) {
      console.error("Error fetching annual report:", error)
      setCurrentReport(null)
      setAssetSummary([])
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      setGenerating(true)
      await api.post("/reports/generate-annual", { year: selectedYear })
      await fetchAnnualReport(selectedYear)
      await fetchReports()
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setGenerating(false)
    }
  }

  const exportReport = async (format: "pdf" | "excel") => {
    try {
      const response = await api.post(
        "/reports/export",
        {
          type: "annual",
          year: selectedYear,
          format,
        },
        {
          responseType: "blob",
        },
      )

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `annual-report-${selectedYear}.${format === "pdf" ? "pdf" : "xlsx"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting report:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            Submitted
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  if (loading && !currentReport) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Annual Asset Report</h1>
          <p className="text-muted-foreground">BR-AMS 010 - Laporan Tahunan Pengurusan Aset</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
            className="px-3 py-2 border rounded-md"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {!currentReport && (
            <Button onClick={generateReport} disabled={generating}>
              {generating ? "Generating..." : "Generate Report"}
            </Button>
          )}
        </div>
      </div>

      {currentReport ? (
        <Tabs defaultValue="summary" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="breakdown">Asset Breakdown</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              {getStatusBadge(currentReport.status)}
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("excel")}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>

          <TabsContent value="summary" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentReport.total_assets_count}</div>
                  <p className="text-xs text-muted-foreground">Registered assets</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {currentReport.total_assets_value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Current asset value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Acquisitions</CardTitle>
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
                  <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {currentReport.maintenance_cost.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Annual maintenance</p>
                </CardContent>
              </Card>
            </div>

            {/* Asset Classification */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Harta Modal</CardTitle>
                  <CardDescription>Assets ≥ RM1,000</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Count:</span>
                      <span className="font-semibold">{currentReport.harta_modal_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value:</span>
                      <span className="font-semibold">RM {currentReport.harta_modal_value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
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
                  <CardDescription>Assets {"< RM1,000"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Count:</span>
                      <span className="font-semibold">{currentReport.inventori_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value:</span>
                      <span className="font-semibold">RM {currentReport.inventori_value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
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
                <CardTitle>Asset Breakdown by Category</CardTitle>
                <CardDescription>Detailed breakdown of assets by category for {selectedYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">Value (RM)</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetSummary.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium capitalize">{item.category.replace("_", " ")}</TableCell>
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
                  <CardTitle>Acquisitions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{currentReport.new_acquisitions_count}</div>
                    <p className="text-sm text-muted-foreground">
                      Total value: RM {currentReport.new_acquisitions_value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disposals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{currentReport.disposals_count}</div>
                    <p className="text-sm text-muted-foreground">
                      Total value: RM {currentReport.disposals_value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Losses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{currentReport.losses_count}</div>
                    <p className="text-sm text-muted-foreground">
                      Total value: RM {currentReport.losses_value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>Previous annual reports and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prepared By</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Total Assets</TableHead>
                      <TableHead className="text-right">Total Value (RM)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.report_year}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.prepared_by}</TableCell>
                        <TableCell>
                          {report.submission_date ? format(new Date(report.submission_date), "dd/MM/yyyy") : "-"}
                        </TableCell>
                        <TableCell>{report.total_assets_count}</TableCell>
                        <TableCell className="text-right">{report.total_assets_value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Report Available</h3>
            <p className="text-muted-foreground text-center mb-4">
              No annual report has been generated for {selectedYear}. Click the button below to generate a new report.
            </p>
            <Button onClick={generateReport} disabled={generating}>
              {generating ? "Generating Report..." : `Generate ${selectedYear} Report`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
