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

## Kredit foto

Semua foto armada berasal dari Wikimedia Commons, lisensi **CC BY-SA 4.0**.
Latarnya sudah dihapus dan diganti satu warna seragam, jadi gambar di `img/` adalah
karya turunan — tetap berlisensi **CC BY-SA 4.0**.

| Mobil | Berkas asal |
| --- | --- |
| Toyota Avanza | [2022 Toyota Avanza 1.3 E, IIMS Hybrid, Grand City, Central Surabaya](https://commons.wikimedia.org/wiki/File:2022_Toyota_Avanza_1.3_E,_IIMS_Hybrid,_Grand_City,_Central_Surabaya.jpg) |
| Toyota Innova Zenix | [2022 Toyota Kijang Innova Zenix V (Indonesia) front view](https://commons.wikimedia.org/wiki/File:2022_Toyota_Kijang_Innova_Zenix_V_(Indonesia)_front_view.jpg) |
| Honda Brio | [2023 Honda Brio Satya E (front left), Citraland, West Surabaya](https://commons.wikimedia.org/wiki/File:2023_Honda_Brio_Satya_E_(front_left),_Citraland,_West_Surabaya.jpg) |
| Mitsubishi Xpander | [2018 Mitsubishi Xpander Ultimate 1.5 NC1W](https://commons.wikimedia.org/wiki/File:2018_Mitsubishi_Xpander_Ultimate_1.5_NC1W_(20190623).jpg) |
| Toyota Rush | [2022 Toyota Rush GR-S](https://commons.wikimedia.org/wiki/File:2022_Toyota_Rush_GR-S_20221010.jpg) |
| Suzuki Carry Blind Van | [2021 Suzuki Carry FB (DC61T)](https://commons.wikimedia.org/wiki/File:2021_Suzuki_Carry_FB_(DC61T).jpg) |

Pengolahan gambar: latar dipotong dengan model segmentasi (`u2netp` lewat `rembg`), lalu
tiap mobil diletakkan di kanvas 960×600 dengan skala dan posisi yang sama, ditambah
bayangan lembut di bawahnya. Hasilnya: mobil utuh, latar rata, tinggi objek seragam.

Kalau salah satu foto gagal dimuat, kartu otomatis kembali menampilkan ilustrasi SVG
yang digambar di dalam `app.js` — jadi tampilan tidak pernah rusak.

## Catatan

- Data disimpan di `localStorage` perangkat sendiri (`atmajacar.booking.v1`). Bukan backend,
  jadi tidak ada data yang terkirim ke mana pun.
- Ilustrasi mobil digambar sebagai SVG di dalam kode — tidak ada file gambar eksternal.
- Tombol "Isi contoh pesanan" menambahkan tiga pesanan demo supaya panel kelola tidak kosong.
