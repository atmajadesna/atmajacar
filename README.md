<div align="center">

# AtmajaCar

**Rental mobil dengan cek ketersediaan per tanggal dan rincian biaya yang terbuka.**

[![Demo](https://img.shields.io/badge/demo-live-b45309?style=flat-square)](https://atmajadesna.github.io/atmajacar/)
![Tanpa build step](https://img.shields.io/badge/build-tanpa%20build%20step-2f6f4f?style=flat-square)
![Lisensi MIT](https://img.shields.io/badge/lisensi-MIT-1f4e79?style=flat-square)

<a href="https://atmajadesna.github.io/atmajacar/"><img src="docs/screenshot.jpg" alt="Tangkapan layar AtmajaCar" width="100%"></a>

</div>

## Masalahnya

Situs rental mobil biasanya cuma menampilkan daftar mobil dan nomor WhatsApp. Penyewa tidak tahu unit mana yang benar-benar kosong di tanggal dia, dan biaya baru muncul di akhir percakapan.

## Yang menarik di dalamnya

**Ketersediaan per rentang tanggal** — Dua pesanan dianggap bentrok kalau rentangnya beririsan — `a1 < b2 && b1 < a2`. Perbandingan pakai string ISO supaya tidak perlu konversi Date.
**Rincian biaya yang berubah langsung** — Supir, antar-jemput, asuransi, dan deposit dihitung ulang tiap opsi diubah. Total dan deposit dipisah supaya jelas mana yang dikembalikan.
**Panel kelola** — Status pesanan: Menunggu → Disetujui → Berjalan → Selesai. Pesanan batal otomatis melepas unitnya.
**Foto armada tanpa latar** — Latar foto dipotong dengan model segmentasi, lalu tiap mobil diletakkan di kanvas 960×600 dengan skala seragam.

## Jalanin

Buka `index.html` di browser, atau jalankan server lokal:

```bash
python3 -m http.server 8000
```

Tidak ada dependency, tidak ada build step. Semua jalan di browser.

## Struktur

```
index.html    tampilan dan struktur halaman
app.js        seluruh logika: data, hitungan, penyimpanan
styles.css    tata letak dan komponen
tokens.css    warna, ukuran teks, dan spasi sebagai variabel
```

## Catatan

Data pesanan disimpan di `localStorage` perangkat sendiri — bukan backend, tidak ada data yang terkirim.

Dibuat dengan JavaScript, CSS, HTML, tanpa framework.

## Kredit foto

Foto armada dari Wikimedia Commons, lisensi **CC BY-SA 4.0**. Latarnya sudah dihapus dan
diganti warna seragam, jadi gambar di `img/` adalah karya turunan dengan lisensi yang sama.

| Mobil | Berkas asal |
| --- | --- |
| Toyota Avanza | [2022 Toyota Avanza 1.3 E, IIMS Hybrid](https://commons.wikimedia.org/wiki/File:2022_Toyota_Avanza_1.3_E,_IIMS_Hybrid,_Grand_City,_Central_Surabaya.jpg) |
| Toyota Innova Zenix | [2022 Toyota Kijang Innova Zenix V (Indonesia)](https://commons.wikimedia.org/wiki/File:2022_Toyota_Kijang_Innova_Zenix_V_(Indonesia)_front_view.jpg) |
| Honda Brio | [2023 Honda Brio Satya E (front left)](https://commons.wikimedia.org/wiki/File:2023_Honda_Brio_Satya_E_(front_left),_Citraland,_West_Surabaya.jpg) |
| Mitsubishi Xpander | [2018 Mitsubishi Xpander Ultimate 1.5 NC1W](https://commons.wikimedia.org/wiki/File:2018_Mitsubishi_Xpander_Ultimate_1.5_NC1W_(20190623).jpg) |
| Toyota Rush | [2022 Toyota Rush GR-S](https://commons.wikimedia.org/wiki/File:2022_Toyota_Rush_GR-S_20221010.jpg) |
| Suzuki Carry Blind Van | [2021 Suzuki Carry FB (DC61T)](https://commons.wikimedia.org/wiki/File:2021_Suzuki_Carry_FB_(DC61T).jpg) |
