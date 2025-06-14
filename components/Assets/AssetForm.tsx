"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { api } from "../../services/api"

const assetSchema = z.object({
  keterangan_aset: z.string().min(1, "Keterangan aset diperlukan"),
  cara_aset_diperoleh: z.enum(["Pembelian", "Sumbangan", "Wakaf", "Hibah"]),
  tarikh_pembelian: z.date(),
  harga_pembelian: z.number().min(100, "Harga minimum RM100 untuk inventori"),
  penempatan: z.string().min(1, "Penempatan diperlukan"),
  pegawai_penempatan: z.string().min(1, "Pegawai penempatan diperlukan"),
  kategori: z.string().min(1, "Kategori diperlukan"),
  jenama_model: z.string().optional(),
  no_siri_pembekal: z.string().optional(),
  tempoh_jaminan: z.string().optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

interface AssetFormProps {
  assetId?: number
  initialData?: any
  onSuccess?: () => void
  onCancel?: () => void
}

const CARA_DIPEROLEH_OPTIONS = [
  { value: "Pembelian", label: "Pembelian" },
  { value: "Sumbangan", label: "Sumbangan" },
  { value: "Wakaf", label: "Wakaf" },
  { value: "Hibah", label: "Hibah" },
]

const KATEGORI_OPTIONS = [
  { value: "Elektronik", label: "Elektronik" },
  { value: "Perabot", label: "Perabot" },
  { value: "Kenderaan", label: "Kenderaan" },
  { value: "Jentera", label: "Jentera" },
  { value: "Tekstil", label: "Tekstil" },
  { value: "Buku", label: "Buku & Publikasi" },
  { value: "Lain-lain", label: "Lain-lain" },
]

export default function AssetForm({ assetId, initialData, onSuccess, onCancel }: AssetFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      cara_aset_diperoleh: "Pembelian",
      tarikh_pembelian: new Date(),
      harga_pembelian: 100,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        tarikh_pembelian: new Date(initialData.tarikh_pembelian),
      })
    }
  }, [initialData, form])

  const onSubmit = async (data: AssetFormData) => {
    try {
      setLoading(true)

      const formData = {
        ...data,
        tarikh_pembelian: format(data.tarikh_pembelian, "yyyy-MM-dd"),
      }

      if (assetId) {
        await api.put(`/assets/${assetId}`, formData)
      } else {
        await api.post("/assets", formData)
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error saving asset:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{assetId ? "Kemaskini Aset" : "Daftar Aset Baharu"}</CardTitle>
        <CardDescription>
          Isi maklumat aset mengikut borang BR-AMS. Harta Modal ≥RM2,000, Inventori RM100-RM1,999
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="keterangan_aset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan Aset *</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: Pendingin Hawa 2.5HP - Daikin" {...field} />
                    </FormControl>
                    <FormDescription>Nyatakan jenama/model dengan jelas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {KATEGORI_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Acquisition Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cara_aset_diperoleh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cara Aset Diperoleh *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CARA_DIPEROLEH_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Lampirkan dokumen sokongan (invois/surat)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tarikh_pembelian"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tarikh Pembelian *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pilih tarikh</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="harga_pembelian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Pembelian (RM) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Harga penuh tanpa potongan. ≥RM2,000 = Harta Modal, RM100-RM1,999 = Inventori
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="penempatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penempatan *</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: Bilik Imam, Dewan Solat" {...field} />
                    </FormControl>
                    <FormDescription>Lokasi fizikal aset</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pegawai_penempatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pegawai Penempatan *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama pegawai bertanggungjawab" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="jenama_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenama/Model</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: Daikin 2.5HP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="no_siri_pembekal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Siri Pembekal</FormLabel>
                    <FormControl>
                      <Input placeholder="No. siri dari pembekal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tempoh_jaminan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempoh Jaminan</FormLabel>
                    <FormControl>
                      <Input placeholder="cth: 2 tahun" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <FormLabel>Gambar Aset</FormLabel>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                </div>
                {imagePreview && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : assetId ? "Kemaskini" : "Daftar Aset"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
