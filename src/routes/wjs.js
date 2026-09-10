import { isLoggedIn } from "./../session.js";

export default [
  {
    path: "/wjs",
    component: () => import("./../layouts/MainLayout.vue"),
    children: [
      // Master Data routes
      {
        path: "master-data",
        name: "MasterData",
        component: () => import("./../pages/WJS/MasterData/Index.vue"),
      },
      // Master Transactions routes
      {
        path: "master-transactions",
        name: "MasterTransactions",
        component: () => import("./../pages/WJS/MasterTransactions/Index.vue"),
      },
      // Dashboard
      {
        path: "report/dashboard",
        name: "WJSDashboard",
        component: () => import("./../pages/WJS/DashboardPage.vue"),
      },
      // OrderPart / Transaksi routes
      {
        path: "transaksi/order-part",
        component: () => import("./../pages/WJS/OrderPart/OrderPartPage.vue"),
        props: { section: "order_part" },
      },
      {
        path: "transaksi/bongkar-analisis",
        component: () => import("./../pages/WJS/OrderPart/OrderPartPage.vue"),
        props: { section: "bongkar_analisis" },
      },
      {
        path: "transaksi/drawing",
        component: () => import("./../pages/WJS/OrderPart/OrderPartPage.vue"),
        props: { section: "drawing" },
      },
      {
        path: "transaksi/assy",
        component: () => import("./../pages/WJS/OrderPart/OrderPartPage.vue"),
        props: { section: "assy" },
      },
      {
        path: "transaksi/trial",
        component: () => import("./../pages/WJS/OrderPart/OrderPartPage.vue"),
        props: { section: "trial" },
      },
      {
        path: "transaksi/adjustment",
        name: "Adjustment",
        component: () => import("./../pages/WJS/MachiningProses/AdjustmentPage.vue"),
      },
      {
        path: "transaksi/machining/proses",
        name: "MachiningProses",
        component: () => import("./../pages/WJS/MachiningProses/ScanOperatorPage.vue"),
      },
      // TerimaSPK routes
      {
        path: "terima-spk",
        component: () => import("./../pages/WJS/TerimaSPK/Index.vue"),
      },
      {
        path: "terima-spk/list/:id_group?",
        component: () => import("./../pages/WJS/TerimaSPK/TerimaSPKPage.vue"),
      },
      {
        path: "terima-spk/proses",
        component: () => import("./../pages/WJS/TerimaSPK/ProsesSPKPage.vue"),
      },
      {
        path: "terima-spk/close",
        component: () => import("./../pages/WJS/TerimaSPK/CloseSPKPage.vue"),
      },

      // ============================================
      // DELETED ROUTES - Pages removed but backend endpoints kept
      // ============================================
      // {
      //   path: "master-jenis-perjanjian",
      //   component: () => import("./../pages/WJS/Master/Perjanjian.vue"),
      // },
      // {
      //   path: "agreement-types",
      //   name: "agreement-types",
      //   component: () => import("./../pages/WJS/Agreement/AgreementTypeList.vue"),
      // },
      // {
      //   path: "request-document-number",
      //   name: "request-document-number",
      //   component: () => import("./../pages/WJS/Agreement/RequestDocumentNumber.vue"),
      // },
      // {
      //   path: "agreement-approval",
      //   name: "agreement-approval",
      //   component: () => import("./../pages/WJS/Agreement/AgreementApprovalPage.vue"),
      // },
      // {
      //   path: "preview-document-number",
      //   name: "preview-document-number",
      //   component: () => import("./../pages/WJS/Agreement/PreviewDocumentNumber.vue"),
      // },
      // {
      //   path: "document-view",
      //   name: "document-view",
      //   component: () => import("./../pages/WJS/DocumentView/DocumentListPage.vue"),
      // },
      // {
      //   path: "document-cancel",
      //   name: "document-cancel",
      //   component: () => import("./../pages/WJS/DocumentCancel/CancelDocumentPage.vue"),
      // },
      // {
      //   path: "master-work-location",
      //   component: () => import("./../pages/WJS/Master/WorkLocation.vue"),
      // },
      // {
      //   path: "master-kategori-dokumen",
      //   component: () => import("./../pages/WJS/Master/KategoriDokumen.vue"),
      // },
      // {
      //   path: "document-request",
      //   component: () => import("./../pages/WJS/PeminjamanArsip/DocumentRequest.vue"),
      // },
      // {
      //   path: "peminjaman-dokumen",
      //   name: "peminjaman-dokumen",
      //   component: () => import("./../pages/WJS/Peminjaman/Peminjaman.vue"),
      // },
      // {
      //   path: "peminjaman-dokumen/:id",
      //   name: "PeminjamanDetail",
      //   component: () => import("./../pages/WJS/Peminjaman/PeminjamanDetailPage.vue"),
      // },
      // {
      //   path: "peminjaman-approval",
      //   name: "peminjaman-approval",
      //   component: () => import("./../pages/WJS/Peminjaman/ApprovalDirect.vue"),
      // },
      // {
      //   path: "peminjaman-revision",
      //   name: "peminjaman-revision",
      //   component: () => import("./../pages/WJS/Peminjaman/RevisionForm.vue"),
      // },
      // {
      //   path: "peminjaman-bast",
      //   name: "peminjaman-bast",
      //   component: () => import("./../pages/WJS/Peminjaman/BASTForm.vue"),
      // },
      // {
      //   path: "peminjaman-user-confirm",
      //   name: "peminjaman-user-confirm",
      //   component: () => import("./../pages/WJS/Peminjaman/UserConfirmation.vue"),
      // },
      // {
      //   path: "peminjaman-log",
      //   name: "peminjaman-log",
      //   component: () => import("./../pages/WJS/Peminjaman/LogTiketPage.vue"),
      // },
      // {
      //   path: "master-lokasi-arsip",
      //   component: () => import("./../pages/WJS/Master/LokasiArsip.vue"),
      // },
      // {
      //   path: "master-arsip-lokasi",
      //   component: () => import("./../pages/WJS/Master/ArsipLokasi.vue"),
      // },
      // {
      //   path: "master-lemari-arsip",
      //   component: () => import("./../pages/WJS/Master/LemariArsip.vue"),
      // },
      // {
      //   path: "mapping-bisnis-unit",
      //   component: () => import("./../pages/WJS/Master/MappingKodeBisnis.vue"),
      // },
      // {
      //   path: "master-sub-kategori-dokumen",
      //   component: () => import("./../pages/WJS/Master/SubKategoriDokumen.vue"),
      // },
      // {
      //   path: "master-konter-transaksi",
      //   component: () => import("./../pages/WJS/Master/KonterTransaksi.vue"),
      // },
      // {
      //   path: "master-jenis-approval",
      //   component: () => import("./../pages/WJS/Master/JenisApproval.vue"),
      // },
      // {
      //   path: "master-type-approval",
      //   component: () => import("./../pages/WJS/Master/TypeApproval.vue"),
      // },
      // {
      //   path: "master-konter",
      //   component: () => import("./../pages/WJS/Master/Konter.vue"),
      // },
      // {
      //   path: "master-approval",
      //   component: () => import("./../pages/WJS/Master/ApprovalPage.vue"),
      // },
      // {
      //   path: "pemusnahan",
      //   name: "Pemusnahan",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/PemusnahanPage.vue"),
      // },
      // {
      //   path: "pemusnahan/create",
      //   name: "PemusnahanCreate",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/PemusnahanFormPage.vue"),
      // },
      // {
      //   path: "pemusnahan/:id",
      //   name: "PemusnahanDetail",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/PemusnahanDetailPage.vue"),
      // },
      // {
      //   path: "pemusnahan/:id/revise",
      //   name: "PemusnahanRevisi",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/PemusnahanRevisiPage.vue"),
      // },
      // {
      //   path: "pemusnahan/:id/bast",
      //   name: "PemusnahanBAST",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/PemusnahanBASTPage.vue"),
      // },
      // {
      //   path: "mutasi",
      //   name: "Mutasi",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/MutasiPage.vue"),
      // },
      // {
      //   path: "mutasi/create",
      //   name: "MutasiCreate",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/MutasiFormPage.vue"),
      // },
      // {
      //   path: "mutasi/approval",
      //   name: "MutasiApproval",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/MutasiApprovalPage.vue"),
      // },
      // {
      //   path: "mutasi/:id/revise",
      //   name: "MutasiRevisi",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/MutasiRevisiPage.vue"),
      // },
      // {
      //   path: "mutasi/:id/bast",
      //   name: "MutasiBAST",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/MutasiBASTPage.vue"),
      // },
      // {
      //   path: "mutasi/:id",
      //   name: "MutasiDetail",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/MutasiDetailPage.vue"),
      // },
      // {
      //   path: "log-tiket-pemusnahan-mutasi",
      //   name: "LogTiketPemusnahanMutasi",
      //   component: () => import("./../pages/WJS/PemindahanDanPemusnahan/LogTiketPage.vue"),
      // },
      // {
      //   path: "pengaduan",
      //   name: "Pengaduan",
      //   component: () => import("./../pages/WJS/Pengaduan/PengaduanPage.vue"),
      // },
      // {
      //   path: "pengaduan/log-tiket",
      //   name: "LogTiketPengaduan",
      //   component: () => import("./../pages/WJS/Pengaduan/LogTiketPengaduanPage.vue"),
      // },
      // {
      //   path: "pengaduan/riwayat",
      //   name: "RiwayatPengaduan",
      //   component: () => import("./../pages/WJS/Pengaduan/RiwayatPengaduanPage.vue"),
      // },
      // {
      //   path: "pengaduan/:id",
      //   name: "PengaduanDetail",
      //   component: () => import("./../pages/WJS/Pengaduan/PengaduanDetailPage.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan",
      //   name: "PengembalianPerpanjangan",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/Index.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan/pengembalian",
      //   name: "PengembalianForm",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/PengembalianFormPage.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan/pengembalian-arsiparis",
      //   name: "PengembalianArsiparis",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/PengembalianArsiparisPage.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan/perpanjangan",
      //   name: "PerpanjanganForm",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/PerpanjanganFormPage.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan/perpanjangan-atasan-user",
      //   name: "PerpanjanganAtasanUser",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/PerpanjanganAtasanUserPage.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan/perpanjangan-legal",
      //   name: "PerpanjanganLegal",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/PerpanjanganLegalPage.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan/perpanjangan-atasan-legal",
      //   name: "PerpanjanganAtasanLegal",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/PerpanjanganAtasanLegalPage.vue"),
      // },
      // {
      //   path: "pengembalian-perpanjangan/laporan",
      //   name: "LaporanPeminjaman",
      //   component: () => import("./../pages/WJS/PengembalianPerpanjangan/LaporanPage.vue"),
      // },
      // {
      //   path: "rekapitulasi/rekap-arsip",
      //   name: "RekapArsip",
      //   component: () => import("./../pages/WJS/Rekapitulasi/RekapArsipPage.vue"),
      // },
      // {
      //   path: "rekapitulasi/rekap-arsip-bulan",
      //   name: "RekapArsipBulan",
      //   component: () => import("./../pages/WJS/Rekapitulasi/RekapArsipBulanPage.vue"),
      // },
      // {
      //   path: "rekapitulasi/rekap-arsip-dbc",
      //   name: "RekapArsipDbc",
      //   component: () => import("./../pages/WJS/Rekapitulasi/RekapArsipDbcPage.vue"),
      // },
      // {
      //   path: "rekapitulasi/rekap-arsip-pertahun",
      //   name: "RekapArsipPertahun",
      //   component: () => import("./../pages/WJS/Rekapitulasi/RekapArsipPertahunPage.vue"),
      // },
      // {
      //   path: "rekapitulasi/perbandingan",
      //   name: "RekapPerbandingan",
      //   component: () => import("./../pages/WJS/Rekapitulasi/RekapPerbandinganPage.vue"),
      // },
      // {
      //   path: "document/recap",
      //   name: "DocumentRecap",
      //   component: () => import("./../pages/WJS/Document/DocumentRecapPage.vue"),
      // },
      // {
      //   path: "document",
      //   name: "Document",
      //   component: () => import("./../pages/WJS/Document/DocumentPage.vue"),
      // },
      // {
      //   path: "document/report",
      //   name: "DocumentReport",
      //   component: () => import("./../pages/WJS/Document/ReportPage.vue"),
      // },
      // {
      //   path: "document/report-renewable",
      //   name: "DocumentReportRenewable",
      //   component: () => import("./../pages/WJS/Document/ReportRenewablePage.vue"),
      // },
      // {
      //   path: "document/restore",
      //   name: "DocumentRestore",
      //   component: () => import("./../pages/WJS/Document/RestorePage.vue"),
      // },
      // {
      //   path: "document/view",
      //   name: "DocumentView",
      //   component: () => import("./../components/WJS/Document/DocumentViewForm.vue"),
      // },
      // {
      //   path: "document/approval",
      //   name: "DocumentApprovalAtasan",
      //   component: () => import("./../components/WJS/Document/ApprovalAtasanForm.vue"),
      // },
      // {
      //   path: "document/revisi",
      //   name: "DocumentRevisi",
      //   component: () => import("./../components/WJS/Document/RevisiForm.vue"),
      // },
      // {
      //   path: "document/approve",
      //   name: "DocumentApprovalArsiparis",
      //   component: () => import("./../components/WJS/Document/ApprovalArsiparisForm.vue"),
      // },
      // {
      //   path: "document/confirm-keeper",
      //   name: "DocumentConfirmKeeper",
      //   component: () => import("./../components/WJS/Document/ConfirmKeeperForm.vue"),
      // },
    ],
    beforeEnter: (to, from, next) => {
      if (!isLoggedIn()) {
        next({
          path: "/login",
        });
      } else {  
        next();
      }
    },
  },
]
