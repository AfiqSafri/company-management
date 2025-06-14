// Enhanced Mock API service with full CRUD operations
interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

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
  dokumen_sokongan?: string
  created_at: string
  updated_at: string
}

class MockApiService {
  private assets: Asset[] = [
    {
      id: 1,
      no_siri_pendaftaran: "MTAJ/HM/24/001",
      keterangan_aset: "Pendingin Hawa 2.5HP - Daikin",
      cara_aset_diperoleh: "Pembelian",
      tarikh_pembelian: "2024-01-15",
      harga_pembelian: 3500.0,
      penempatan: "Bilik Imam",
      status_aset: "Aktif",
      jenis_aset: "HM",
      pegawai_penempatan: "Ahmad Rahman",
      kategori: "Elektronik",
      jenama_model: "Daikin 2.5HP",
      no_siri_pembekal: "DK2024001",
      tempoh_jaminan: "2 tahun",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      no_siri_pendaftaran: "MTAJ/I/24/001",
      keterangan_aset: "Kerusi Plastik - Monobloc",
      cara_aset_diperoleh: "Sumbangan",
      tarikh_pembelian: "2024-01-10",
      harga_pembelian: 150.0,
      penempatan: "Dewan Solat",
      status_aset: "Aktif",
      jenis_aset: "I",
      pegawai_penempatan: "Siti Aminah",
      kategori: "Perabot",
      jenama_model: "Monobloc Standard",
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-10T09:00:00Z",
    },
    {
      id: 3,
      no_siri_pendaftaran: "MTAJ/HM/24/002",
      keterangan_aset: "Sistem Bunyi - TOA",
      cara_aset_diperoleh: "Pembelian",
      tarikh_pembelian: "2024-01-20",
      harga_pembelian: 5000.0,
      penempatan: "Dewan Solat",
      status_aset: "Aktif",
      jenis_aset: "HM",
      pegawai_penempatan: "Muhammad Yusof",
      kategori: "Elektronik",
      jenama_model: "TOA A-2000 Series",
      no_siri_pembekal: "TOA2024001",
      tempoh_jaminan: "3 tahun",
      created_at: "2024-01-20T14:15:00Z",
      updated_at: "2024-01-20T14:15:00Z",
    },
    {
      id: 4,
      no_siri_pendaftaran: "MTAJ/I/24/002",
      keterangan_aset: "Kipas Angin - KDK",
      cara_aset_diperoleh: "Pembelian",
      tarikh_pembelian: "2024-01-25",
      harga_pembelian: 200.0,
      penempatan: "Bilik Mesyuarat",
      status_aset: "Aktif",
      jenis_aset: "I",
      pegawai_penempatan: "Fatimah Ali",
      kategori: "Elektronik",
      jenama_model: "KDK M56SG",
      no_siri_pembekal: "KDK2024001",
      tempoh_jaminan: "1 tahun",
      created_at: "2024-01-25T11:30:00Z",
      updated_at: "2024-01-25T11:30:00Z",
    },
    {
      id: 5,
      no_siri_pendaftaran: "MTAJ/HM/24/003",
      keterangan_aset: "Penjana - Honda 5KVA",
      cara_aset_diperoleh: "Wakaf",
      tarikh_pembelian: "2024-02-01",
      harga_pembelian: 4500.0,
      penempatan: "Stor Belakang",
      status_aset: "Aktif",
      jenis_aset: "HM",
      pegawai_penempatan: "Ahmad Rahman",
      kategori: "Jentera",
      jenama_model: "Honda EU50i",
      no_siri_pembekal: "HD2024001",
      tempoh_jaminan: "2 tahun",
      created_at: "2024-02-01T08:00:00Z",
      updated_at: "2024-02-01T08:00:00Z",
    },
    {
      id: 6,
      no_siri_pendaftaran: "MTAJ/I/24/003",
      keterangan_aset: "Karpet Solat - 50 helai",
      cara_aset_diperoleh: "Sumbangan",
      tarikh_pembelian: "2024-02-05",
      harga_pembelian: 500.0,
      penempatan: "Dewan Solat",
      status_aset: "Aktif",
      jenis_aset: "I",
      pegawai_penempatan: "Siti Aminah",
      kategori: "Tekstil",
      jenama_model: "Karpet Turki Premium",
      created_at: "2024-02-05T16:20:00Z",
      updated_at: "2024-02-05T16:20:00Z",
    },
    {
      id: 7,
      no_siri_pendaftaran: "MTAJ/I/24/004",
      keterangan_aset: "Whiteboard - 4x8 kaki",
      cara_aset_diperoleh: "Pembelian",
      tarikh_pembelian: "2024-02-10",
      harga_pembelian: 300.0,
      penempatan: "Bilik Mesyuarat",
      status_aset: "Aktif",
      jenis_aset: "I",
      pegawai_penempatan: "Muhammad Yusof",
      kategori: "Perabot",
      jenama_model: "Standard Whiteboard",
      created_at: "2024-02-10T13:45:00Z",
      updated_at: "2024-02-10T13:45:00Z",
    },
    {
      id: 8,
      no_siri_pendaftaran: "MTAJ/I/24/005",
      keterangan_aset: "Printer - Canon Pixma",
      cara_aset_diperoleh: "Pembelian",
      tarikh_pembelian: "2024-02-15",
      harga_pembelian: 400.0,
      penempatan: "Pejabat",
      status_aset: "Pelupusan",
      jenis_aset: "I",
      pegawai_penempatan: "Fatimah Ali",
      kategori: "Elektronik",
      jenama_model: "Canon Pixma G3010",
      no_siri_pembekal: "CN2024001",
      tempoh_jaminan: "1 tahun",
      created_at: "2024-02-15T10:15:00Z",
      updated_at: "2024-02-20T14:30:00Z",
    },
  ]

  private nextId = 9

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const urlParts = endpoint.split("/")
    const baseEndpoint = urlParts[1] || endpoint

    switch (baseEndpoint) {
      case "dashboard":
        if (endpoint.includes("stats")) {
          return {
            data: {
              total_aset: this.assets.length,
              total_harta_modal: this.assets.filter((a) => a.jenis_aset === "HM").length,
              total_inventori: this.assets.filter((a) => a.jenis_aset === "I").length,
              total_nilai_aset: this.assets.reduce((sum, a) => sum + a.harga_pembelian, 0),
              aset_aktif: this.assets.filter((a) => a.status_aset === "Aktif").length,
              aset_pelupusan: this.assets.filter((a) => a.status_aset === "Pelupusan").length,
              aset_hapus_kira: this.assets.filter((a) => a.status_aset === "Hapus Kira").length,
            } as T,
            status: 200,
          }
        }
        if (endpoint.includes("recent-activities")) {
          return {
            data: [
              {
                id: 1,
                type: "asset_created",
                description: "Aset baharu didaftarkan: Pendingin Hawa 2.5HP",
                date: "2024-01-15T10:30:00Z",
                user: "Ahmad Rahman",
              },
              {
                id: 2,
                type: "asset_updated",
                description: "Aset dikemaskini: Printer Canon - Status Pelupusan",
                date: "2024-02-20T14:30:00Z",
                user: "Fatimah Ali",
              },
            ] as T,
            status: 200,
          }
        }
        break

      case "assets":
        if (endpoint.includes("export")) {
          return this.exportAssets(params?.format || "excel") as ApiResponse<T>
        }
        if (endpoint.includes("reports")) {
          if (endpoint.includes("br-ams-001")) {
            return this.generateBRAMS001() as ApiResponse<T>
          }
          if (endpoint.includes("br-ams-002")) {
            return this.generateBRAMS002() as ApiResponse<T>
          }
          if (endpoint.includes("br-ams-003")) {
            return this.generateBRAMS003() as ApiResponse<T>
          }
        }

        // Get single asset
        if (urlParts.length > 2 && !isNaN(Number(urlParts[2]))) {
          const id = Number(urlParts[2])
          const asset = this.assets.find((a) => a.id === id)
          if (!asset) {
            return { data: null as T, status: 404, message: "Aset tidak dijumpai" }
          }
          return { data: asset as T, status: 200 }
        }

        // Get all assets with filtering
        return this.getAssets(params) as ApiResponse<T>

      default:
        return { data: [] as T, status: 200 }
    }

    return { data: {} as T, status: 200 }
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    switch (endpoint) {
      case "/auth/login":
        return {
          data: {
            user: {
              id: 1,
              name: "Ahmad Rahman",
              email: data?.email || "ahmad@masjid.my",
              role: "admin",
              mosque_id: 1,
            },
            token: "mock-jwt-token-12345",
          } as T,
          message: "Login berjaya",
          status: 200,
        }

      case "/assets":
        return this.createAsset(data) as ApiResponse<T>

      default:
        return {
          data: { success: true } as T,
          message: "Operasi berjaya",
          status: 201,
        }
    }
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const urlParts = endpoint.split("/")
    if (urlParts[1] === "assets" && urlParts[2]) {
      const id = Number(urlParts[2])
      return this.updateAsset(id, data) as ApiResponse<T>
    }

    return {
      data: { success: true } as T,
      message: "Kemaskini berjaya",
      status: 200,
    }
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const urlParts = endpoint.split("/")
    if (urlParts[1] === "assets" && urlParts[2]) {
      const id = Number(urlParts[2])
      return this.deleteAsset(id) as ApiResponse<T>
    }

    return {
      data: { success: true } as T,
      message: "Padam berjaya",
      status: 200,
    }
  }

  // CRUD Operations
  private getAssets(params?: Record<string, any>) {
    let filteredAssets = [...this.assets]

    // Apply filters
    if (params?.search) {
      const search = params.search.toLowerCase()
      filteredAssets = filteredAssets.filter(
        (asset) =>
          asset.keterangan_aset.toLowerCase().includes(search) ||
          asset.no_siri_pendaftaran.toLowerCase().includes(search) ||
          asset.penempatan.toLowerCase().includes(search),
      )
    }

    if (params?.jenis_aset && params.jenis_aset !== "all") {
      filteredAssets = filteredAssets.filter((asset) => asset.jenis_aset === params.jenis_aset)
    }

    if (params?.status_aset && params.status_aset !== "all") {
      filteredAssets = filteredAssets.filter((asset) => asset.status_aset === params.status_aset)
    }

    if (params?.kategori && params.kategori !== "all") {
      filteredAssets = filteredAssets.filter((asset) => asset.kategori === params.kategori)
    }

    // Pagination
    const page = Number(params?.page) || 1
    const perPage = Number(params?.per_page) || 15
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedAssets = filteredAssets.slice(startIndex, endIndex)

    return {
      data: paginatedAssets,
      status: 200,
      meta: {
        current_page: page,
        last_page: Math.ceil(filteredAssets.length / perPage),
        per_page: perPage,
        total: filteredAssets.length,
      },
    }
  }

  private createAsset(data: Partial<Asset>) {
    const newAsset: Asset = {
      id: this.nextId++,
      no_siri_pendaftaran: this.generateNoSiri(data.jenis_aset || "I"),
      keterangan_aset: data.keterangan_aset || "",
      cara_aset_diperoleh: data.cara_aset_diperoleh || "Pembelian",
      tarikh_pembelian: data.tarikh_pembelian || new Date().toISOString().split("T")[0],
      harga_pembelian: data.harga_pembelian || 0,
      penempatan: data.penempatan || "",
      status_aset: "Aktif",
      jenis_aset: data.harga_pembelian && data.harga_pembelian >= 2000 ? "HM" : "I",
      pegawai_penempatan: data.pegawai_penempatan || "",
      kategori: data.kategori || "",
      jenama_model: data.jenama_model,
      no_siri_pembekal: data.no_siri_pembekal,
      tempoh_jaminan: data.tempoh_jaminan,
      dokumen_sokongan: data.dokumen_sokongan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.assets.push(newAsset)

    return {
      data: newAsset,
      message: "Aset berjaya didaftarkan",
      status: 201,
    }
  }

  private updateAsset(id: number, data: Partial<Asset>) {
    const assetIndex = this.assets.findIndex((a) => a.id === id)
    if (assetIndex === -1) {
      return { data: null, status: 404, message: "Aset tidak dijumpai" }
    }

    this.assets[assetIndex] = {
      ...this.assets[assetIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }

    return {
      data: this.assets[assetIndex],
      message: "Aset berjaya dikemaskini",
      status: 200,
    }
  }

  private deleteAsset(id: number) {
    const assetIndex = this.assets.findIndex((a) => a.id === id)
    if (assetIndex === -1) {
      return { data: null, status: 404, message: "Aset tidak dijumpai" }
    }

    const deletedAsset = this.assets.splice(assetIndex, 1)[0]

    return {
      data: deletedAsset,
      message: "Aset berjaya dipadam",
      status: 200,
    }
  }

  // Report Generation
  private generateBRAMS001() {
    const hartaModal = this.assets.filter((a) => a.jenis_aset === "HM" && a.status_aset === "Aktif")
    return {
      data: {
        title: "BR-AMS 001: Senarai Daftar Harta Modal",
        description: "Untuk aset alih bernilai ≥RM2,000",
        assets: hartaModal,
        total_kuantiti: hartaModal.length,
        total_nilai: hartaModal.reduce((sum, a) => sum + a.harga_pembelian, 0),
        generated_at: new Date().toISOString(),
      },
      status: 200,
    }
  }

  private generateBRAMS002() {
    const inventori = this.assets.filter((a) => a.jenis_aset === "I" && a.status_aset === "Aktif")
    return {
      data: {
        title: "BR-AMS 002: Senarai Daftar Inventori",
        description: "Untuk aset alih bernilai RM100–RM1,999",
        assets: inventori,
        total_kuantiti: inventori.length,
        total_nilai: inventori.reduce((sum, a) => sum + a.harga_pembelian, 0),
        generated_at: new Date().toISOString(),
      },
      status: 200,
    }
  }

  private generateBRAMS003() {
    const assetsByLocation = this.assets.reduce(
      (acc, asset) => {
        if (!acc[asset.penempatan]) {
          acc[asset.penempatan] = []
        }
        acc[asset.penempatan].push(asset)
        return acc
      },
      {} as Record<string, Asset[]>,
    )

    return {
      data: {
        title: "BR-AMS 003: Senarai Aset Alih Mengikut Lokasi",
        description: "Senarai aset mengikut lokasi penempatan",
        locations: assetsByLocation,
        generated_at: new Date().toISOString(),
      },
      status: 200,
    }
  }

  // Export Functions
  private exportAssets(format: string) {
    const exportData = {
      assets: this.assets,
      summary: {
        total_assets: this.assets.length,
        total_harta_modal: this.assets.filter((a) => a.jenis_aset === "HM").length,
        total_inventori: this.assets.filter((a) => a.jenis_aset === "I").length,
        total_value: this.assets.reduce((sum, a) => sum + a.harga_pembelian, 0),
      },
      exported_at: new Date().toISOString(),
      format: format,
    }

    // Simulate file generation
    const filename = `aset-export-${new Date().toISOString().split("T")[0]}.${format}`

    return {
      data: {
        download_url: `/exports/${filename}`,
        filename: filename,
        ...exportData,
      },
      message: `Export ${format.toUpperCase()} berjaya dijana`,
      status: 200,
    }
  }

  private generateNoSiri(jenisAset: string): string {
    const year = new Date().getFullYear().toString().slice(-2)
    const existingNumbers = this.assets
      .filter((a) => a.jenis_aset === jenisAset && a.no_siri_pendaftaran.includes(`/${jenisAset}/${year}/`))
      .map((a) => {
        const parts = a.no_siri_pendaftaran.split("/")
        return Number.parseInt(parts[parts.length - 1]) || 0
      })

    const nextNumber = Math.max(0, ...existingNumbers) + 1
    return `MTAJ/${jenisAset}/${year}/${nextNumber.toString().padStart(3, "0")}`
  }
}

export const api = new MockApiService()
