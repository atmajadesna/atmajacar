<div align="center">

# AtmajaCar

**Rental mobil dengan pemeriksaan ketersediaan per tanggal dan rincian biaya yang terbuka.**

[![Demo](https://img.shields.io/badge/demo-live-b45309?style=flat-square)](https://atmajadesna.github.io/atmajacar/)
![Tanpa build step](https://img.shields.io/badge/build-tanpa%20build%20step-2f6f4f?style=flat-square)
![Lisensi MIT](https://img.shields.io/badge/lisensi-MIT-1f4e79?style=flat-square)

<a href="https://atmajadesna.github.io/atmajacar/"><img src="docs/screenshot.jpg" alt="Tangkapan layar AtmajaCar" width="100%"></a>

</div>

## Latar Belakang

Situs rental mobil umumnya hanya menampilkan daftar kendaraan beserta nomor kontak. Penyewa tidak memperoleh informasi unit mana yang benar-benar tersedia pada tanggal yang dipilih, dan rincian biaya baru diketahui setelah percakapan berlangsung.

## Poin Teknis

**Ketersediaan berdasarkan rentang tanggal.** Dua pesanan dinyatakan bertabrakan apabila rentang tanggalnya beririsan — `a1 < b2 && b1 < a2`. Perbandingan menggunakan string ISO sehingga tidak memerlukan konversi objek Date.

**Rincian biaya yang diperbarui langsung.** Komponen supir, antar-jemput, asuransi, dan deposit dihitung ulang setiap opsi diubah. Total sewa dan deposit dipisahkan agar jelas komponen mana yang dikembalikan.

**Panel pengelolaan pesanan.** Status pesanan: Menunggu → Disetujui → Berjalan → Selesai. Pesanan berstatus batal otomatis melepaskan unit terkait.

**Foto armada tanpa latar.** Latar foto dipisahkan menggunakan model segmentasi, kemudian setiap kendaraan ditempatkan pada kanvas 960×600 dengan skala seragam.

## Menjalankan

Berkas `index.html` dapat dibuka langsung pada peramban, atau dijalankan melalui server lokal:

```bash
python3 -m http.server 8000
```

Tidak diperlukan dependensi maupun proses build. Seluruh proses berjalan pada peramban.

## Struktur Berkas

```
index.html    struktur halaman dan tampilan
app.js        seluruh logika: data, perhitungan, dan penyimpanan
styles.css    tata letak dan komponen antarmuka
tokens.css    warna, ukuran teks, dan spasi sebagai variabel
```

## Catatan

Data pesanan disimpan pada `localStorage` perangkat, bukan pada basis data server, sehingga tidak ada data yang dikirimkan ke pihak lain.

Dibangun menggunakan JavaScript, CSS, dan HTML, tanpa kerangka kerja.

## Kredit Foto

Foto armada berasal dari Wikimedia Commons dengan lisensi CC BY-SA 4.0. Latar telah dipisahkan
dan diganti warna seragam, sehingga gambar pada direktori `img/` merupakan karya turunan dengan
lisensi yang sama.

| Kendaraan | Berkas asal |
| --- | --- |
| Toyota Avanza | [2022 Toyota Avanza 1.3 E, IIMS Hybrid](https://commons.wikimedia.org/wiki/File:2022_Toyota_Avanza_1.3_E,_IIMS_Hybrid,_Grand_City,_Central_Surabaya.jpg) |
| Toyota Innova Zenix | [2022 Toyota Kijang Innova Zenix V (Indonesia)](https://commons.wikimedia.org/wiki/File:2022_Toyota_Kijang_Innova_Zenix_V_(Indonesia)_front_view.jpg) |
| Honda Brio | [2023 Honda Brio Satya E (front left)](https://commons.wikimedia.org/wiki/File:2023_Honda_Brio_Satya_E_(front_left),_Citraland,_West_Surabaya.jpg) |
| Mitsubishi Xpander | [2018 Mitsubishi Xpander Ultimate 1.5 NC1W](https://commons.wikimedia.org/wiki/File:2018_Mitsubishi_Xpander_Ultimate_1.5_NC1W_(20190623).jpg) |
| Toyota Rush | [2022 Toyota Rush GR-S](https://commons.wikimedia.org/wiki/File:2022_Toyota_Rush_GR-S_20221010.jpg) |
| Suzuki Carry Blind Van | [2021 Suzuki Carry FB (DC61T)](https://commons.wikimedia.org/wiki/File:2021_Suzuki_Carry_FB_(DC61T).jpg) |
