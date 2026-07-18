# RasaNusa — Setup

## Jalankan secara lokal
```bash
npm install
npm run dev
```
Buka URL lokal yang muncul (default `http://localhost:5173`).

## Alur & Rute
- `/` — Landing hero restoran (carousel menu andalan + ambience animasi resto)
- `/login` — Login staf & pelanggan (admin / kasir / pelanggan)
- `/pos` — Dashboard Kasir (khusus role `kasir` & `admin`)
- `/admin` — Dashboard Admin (khusus role `admin`): Ringkasan, Rekap Penjualan, Kelola Stok
- `/dashboard` — Dashboard Pelanggan (khusus role `pelanggan`): self-order, poin loyalitas, promo, riwayat pesanan

## Akun Demo
| Role      | Username   | Password      |
|-----------|------------|---------------|
| Admin     | admin      | admin123      |
| Kasir     | kasir      | kasir123      |
| Pelanggan | pelanggan  | pelanggan123  |

Tombol "Isi Otomatis" tersedia di halaman login untuk mengisi kredensial demo dengan cepat.

## Dashboard Pelanggan (baru)
- Banner sambutan dengan status member (Anggota Baru/Silver/Gold/Platinum) dan poin loyalitas (1 poin / Rp1.000 belanja), dihitung otomatis dari riwayat pesanan pelanggan tersebut.
- Kartu ringkasan: poin loyalitas, total pesanan, status member + progres ke level berikutnya, kategori favorit.
- Carousel promo yang berputar otomatis.
- Menu dengan tab kategori, pencarian, dan kartu menu dengan stepper jumlah langsung di kartu.
- Keranjang (drawer geser) dengan pilihan Makan di Tempat (+ nomor meja) / Bawa Pulang, dan metode pembayaran (QRIS/E-Wallet/Tunai di Kasir).
- Konfirmasi pesanan membuat transaksi baru (muncul juga di Rekap Penjualan admin) dan menampilkan modal sukses dengan animasi.
- Riwayat pesanan pelanggan yang bersangkutan ditampilkan di bagian bawah dashboard.

## Struktur
```
src/
  pages/
    HeroPage.tsx           landing restoran + carousel menu andalan + ambience animasi
    LoginPage.tsx           form login admin/kasir/pelanggan + ambience animasi
    PosPage.tsx              dashboard kasir (multi metode pembayaran)
    AdminDashboard.tsx        dashboard admin (tab: Ringkasan/Rekap/Stok)
    CustomerDashboard.tsx      dashboard pelanggan (self-order, poin, promo, riwayat)
  components/
    ProtectedRoute.tsx       guard berbasis role
    pos/
      ProductGrid.tsx          grid menu + badge (Best Seller/Baru/Pedas)
      CartSidebar.tsx           keranjang & ringkasan biaya
      PaymentModal.tsx           alur Tunai / QRIS / Kartu / E-Wallet
    admin/
      OverviewTab.tsx            KPI + chart (recharts)
      SalesRecapTab.tsx           riwayat transaksi + filter metode bayar
      StockTab.tsx                 kelola stok, tambah/edit/hapus menu
      ProductFormModal.tsx          form tambah/edit menu
    customer/
      MenuCard.tsx                kartu menu + stepper jumlah
      PromoCarousel.tsx            carousel promo otomatis
      CartDrawer.tsx                drawer keranjang + jenis pesanan + pembayaran
      OrderSuccessModal.tsx         modal sukses pesanan (animasi)
  context/
    AuthContext.tsx          sesi login (localStorage)
    AppDataContext.tsx        produk, transaksi, log stok (localStorage)
  data/
    products.ts              25 menu awal (4 kategori) + formatIDR
    users.ts                  kredensial demo admin/kasir
  types/
    pos.ts, auth.ts            tipe TypeScript bersama
```

## Catatan Implementasi
- Data (produk, stok, transaksi) disimpan di `localStorage` sehingga tetap konsisten walau berpindah halaman/login ulang di browser yang sama. Gunakan tombol "Reset" (via console: `localStorage.clear()`) untuk mengembalikan ke data awal saat demo.
- Stok baru dikurangi permanen setelah pembayaran dikonfirmasi; sebelum itu, "Sisa Stok" di grid = stok − jumlah di keranjang.
- 4 metode pembayaran di kasir: Tunai (dengan kalkulasi kembalian), QRIS (kode QR dari API publik), Kartu (mock EDC), dan E-Wallet (pilih provider: GoPay/OVO/DANA/ShopeePay).
- Dashboard admin: Ringkasan (KPI + grafik pendapatan per kategori & 5 menu terlaris), Rekap Penjualan (riwayat transaksi + filter metode bayar), Kelola Stok (tambah/kurangi stok, tambah/edit/hapus menu).
- Ini adalah autentikasi demo (kredensial di client-side). Untuk produksi, ganti dengan backend auth sungguhan.
