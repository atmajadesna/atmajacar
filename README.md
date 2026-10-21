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
Gambar sudah dipotong ke rasio 4:3 dan diperkecil agar ringan.

| Mobil | Berkas | Lisensi |
| --- | --- | --- |
| Toyota Avanza | [2022 Toyota Avanza 1.5 G Toyota Safety Sense W101RE](https://commons.wikimedia.org/wiki/File:2022_Toyota_Avanza_1.5_G_Toyota_Safety_Sense_W101RE_(20220403).jpg) | CC BY-SA 4.0 |
| Toyota Innova Zenix | [2022 Toyota Kijang Innova Zenix V (Indonesia) front view](https://commons.wikimedia.org/wiki/File:2022_Toyota_Kijang_Innova_Zenix_V_(Indonesia)_front_view.jpg) | CC BY-SA 4.0 |
| Honda Brio | [2020 Honda Brio Satya S 1.2 DD1](https://commons.wikimedia.org/wiki/File:2020_Honda_Brio_Satya_S_1.2_DD1_(20211001)_01.jpg) | CC BY-SA 4.0 |
| Mitsubishi Xpander | [2022 Mitsubishi Xpander GLS (20221009) 01](https://commons.wikimedia.org/wiki/File:2022_Mitsubishi_Xpander_GLS_(20221009)_01.jpg) | CC BY-SA 4.0 |
| Toyota Rush | [2022 Toyota Rush GR-S 20221010](https://commons.wikimedia.org/wiki/File:2022_Toyota_Rush_GR-S_20221010.jpg) | CC BY-SA 4.0 |
| Suzuki Carry | [2021 Suzuki Carry FB (DC61T)](https://commons.wikimedia.org/wiki/File:2021_Suzuki_Carry_FB_(DC61T).jpg) | CC BY-SA 4.0 |

Kalau salah satu foto gagal dimuat, kartu otomatis kembali menampilkan ilustrasi SVG
yang digambar di dalam `app.js` — jadi tampilan tidak pernah rusak.

## Catatan

- Data disimpan di `localStorage` perangkat sendiri (`atmajacar.booking.v1`). Bukan backend,
  jadi tidak ada data yang terkirim ke mana pun.
- Ilustrasi mobil digambar sebagai SVG di dalam kode — tidak ada file gambar eksternal.
- Tombol "Isi contoh pesanan" menambahkan tiga pesanan demo supaya panel kelola tidak kosong.
