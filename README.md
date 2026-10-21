# AtmajaCar

Aplikasi rental mobil: cek ketersediaan per tanggal, susun paket sewa, dan kelola pesanan
dari satu halaman. HTML, CSS, dan JavaScript tanpa framework — langsung jalan di GitHub Pages.

**Demo:** https://atmajadesna.github.io/atmajacar/

## Yang dihitung

| Bagian | Aturan |
| --- | --- |
| Durasi | Selisih tanggal, minimal 1 hari |
| Harga dasar | Tarif harian × durasi |
| Supir | Rp150.000 per hari |
| Antar-jemput bandara | Rp75.000 sekali jalan |
| Asuransi all risk | Rp50.000 per hari |
| Deposit | Rp500.000 (hanya paket lepas kunci, dikembalikan) |
| Denda telat | Rp25.000 per jam |

Semua angka ada di satu tempat di `app.js` (`TARIF_SUPIR`, `TARIF_ANTAR`, `TARIF_ASURANSI`,
`DENDA_PER_JAM`), jadi gampang diubah tanpa menyentuh tampilan.

## Ketersediaan

Mobil dianggap tidak tersedia kalau ada pesanan aktif yang rentang tanggalnya bertabrakan:

```js
function bertabrakan(a1, a2, b1, b2) {
  return a1 < b2 && b1 < a2;
}
```

Perbandingan pakai string ISO (`YYYY-MM-DD`) yang urutannya sama dengan urutan tanggal,
jadi tidak perlu konversi ke objek Date. Pesanan berstatus **Batal** diabaikan.

## Alur

1. Isi tanggal ambil dan kembali → daftar armada langsung tersaring.
2. Pilih mobil → atur paket (lepas kunci / supir, antar-jemput, asuransi).
3. Isi data penyewa (nama, NIK 16 angka, SIM, WhatsApp) → dapat kode booking.
4. Panel **Kelola** untuk mengubah status: Menunggu → Disetujui → Berjalan → Selesai.

## Catatan

- Data disimpan di `localStorage` perangkat sendiri (`atmajacar.booking.v1`). Bukan backend,
  jadi tidak ada data yang terkirim ke mana pun.
- Ilustrasi mobil digambar sebagai SVG di dalam kode — tidak ada file gambar eksternal.
- Tombol "Isi contoh pesanan" menambahkan tiga pesanan demo supaya panel kelola tidak kosong.
