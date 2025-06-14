"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Bell, Shield, Database, Download } from "lucide-react"

export default function Settings() {
  const [mosqueInfo, setMosqueInfo] = useState({
    name: "Masjid Al-Hidayah",
    address: "Jalan Masjid 1, Taman Sejahtera, 40100 Shah Alam, Selangor",
    phone: "03-5544 1234",
    email: "info@masjidalhidayah.org",
    code: "MTAJ",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    maintenanceReminders: true,
    inspectionAlerts: true,
    disposalApprovals: true,
  })

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "5years",
    auditLog: true,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tetapan Sistem</h1>
          <p className="text-muted-foreground">Konfigurasi sistem dan tetapan masjid</p>
        </div>
      </div>

      <Tabs defaultValue="mosque" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mosque">
            <Building className="h-4 w-4 mr-2" />
            Maklumat Masjid
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Keselamatan
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-4 w-4 mr-2" />
            Sistem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mosque">
          <Card>
            <CardHeader>
              <CardTitle>Maklumat Masjid</CardTitle>
              <CardDescription>Kemaskini maklumat asas masjid dan kod BR-AMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mosqueName">Nama Masjid</Label>
                  <Input
                    id="mosqueName"
                    value={mosqueInfo.name}
                    onChange={(e) => setMosqueInfo({ ...mosqueInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mosqueCode">Kod Masjid (BR-AMS)</Label>
                  <Input
                    id="mosqueCode"
                    value={mosqueInfo.code}
                    onChange={(e) => setMosqueInfo({ ...mosqueInfo, code: e.target.value })}
                    placeholder="Contoh: MTAJ"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={mosqueInfo.address}
                  onChange={(e) => setMosqueInfo({ ...mosqueInfo, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Nombor Telefon</Label>
                  <Input
                    id="phone"
                    value={mosqueInfo.phone}
                    onChange={(e) => setMosqueInfo({ ...mosqueInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Alamat Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={mosqueInfo.email}
                    onChange={(e) => setMosqueInfo({ ...mosqueInfo, email: e.target.value })}
                  />
                </div>
              </div>
              <Button>Simpan Maklumat</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Tetapan Notifikasi</CardTitle>
              <CardDescription>Atur notifikasi dan peringatan sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi melalui email untuk aktiviti penting
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Peringatan Penyelenggaraan</Label>
                  <p className="text-sm text-muted-foreground">
                    Peringatan untuk jadual penyelenggaraan yang akan datang
                  </p>
                </div>
                <Switch
                  checked={notifications.maintenanceReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, maintenanceReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Amaran Pemeriksaan</Label>
                  <p className="text-sm text-muted-foreground">Amaran untuk aset yang perlu diperiksa</p>
                </div>
                <Switch
                  checked={notifications.inspectionAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, inspectionAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Kelulusan Pelupusan</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi untuk kelulusan pelupusan aset</p>
                </div>
                <Switch
                  checked={notifications.disposalApprovals}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, disposalApprovals: checked })}
                />
              </div>
              <Button>Simpan Tetapan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Keselamatan Kata Laluan</CardTitle>
                <CardDescription>Tetapan keselamatan dan kata laluan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Kata Laluan Semasa</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">Kata Laluan Baru</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Sahkan Kata Laluan Baru</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Tukar Kata Laluan</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log Audit</CardTitle>
                <CardDescription>Rekod aktiviti pengguna dalam sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Aktifkan Log Audit</Label>
                    <p className="text-sm text-muted-foreground">Rekod semua aktiviti pengguna untuk tujuan audit</p>
                  </div>
                  <Switch
                    checked={systemSettings.auditLog}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, auditLog: checked })}
                  />
                </div>
                <div className="mt-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Muat Turun Log Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sandaran Data</CardTitle>
                <CardDescription>Tetapan sandaran automatik dan pemulihan data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sandaran Automatik</Label>
                    <p className="text-sm text-muted-foreground">Buat sandaran data secara automatik</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoBackup: checked })}
                  />
                </div>
                <div>
                  <Label htmlFor="backupFrequency">Kekerapan Sandaran</Label>
                  <Select
                    value={systemSettings.backupFrequency}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button>Buat Sandaran Sekarang</Button>
                  <Button variant="outline">Pulih Data</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Penyimpanan Data</CardTitle>
                <CardDescription>Tetapan penyimpanan dan pengekalan data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dataRetention">Tempoh Pengekalan Data</Label>
                  <Select
                    value={systemSettings.dataRetention}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, dataRetention: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">1 Tahun</SelectItem>
                      <SelectItem value="3years">3 Tahun</SelectItem>
                      <SelectItem value="5years">5 Tahun</SelectItem>
                      <SelectItem value="10years">10 Tahun</SelectItem>
                      <SelectItem value="permanent">Kekal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="font-semibold">Ruang Digunakan</div>
                    <div className="text-lg">2.4 GB</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="font-semibold">Ruang Tersedia</div>
                    <div className="text-lg">47.6 GB</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="font-semibold">Jumlah Rekod</div>
                    <div className="text-lg">1,247</div>
                  </div>
                </div>
                <Button>Simpan Tetapan</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
