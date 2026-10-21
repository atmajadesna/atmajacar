/* AtmajaCar — logika sewa, ketersediaan, dan panel petugas.
 * Tanpa framework. Data contoh disimpan di localStorage perangkat sendiri.
 */

const TARIF_SUPIR = 150000;
const TARIF_ANTAR = 75000;
const TARIF_ASURANSI = 50000;
const DENDA_PER_JAM = 25000;
const KUNCI_SIMPAN = "atmajacar.booking.v1";

const MOBIL = [
  { id: "avanza",  nama: "Toyota Avanza",        kelas: "MPV",       tahun: 2022, kursi: 7, transmisi: "Manual", tarif: 350000 },
  { id: "innova",  nama: "Toyota Innova Zenix",  kelas: "MPV",       tahun: 2023, kursi: 7, transmisi: "Matic",  tarif: 550000 },
  { id: "brio",    nama: "Honda Brio",           kelas: "Hatchback", tahun: 2021, kursi: 5, transmisi: "Matic",  tarif: 275000 },
  { id: "xpander", nama: "Mitsubishi Xpander",   kelas: "MPV",       tahun: 2023, kursi: 7, transmisi: "Matic",  tarif: 425000 },
  { id: "rush",    nama: "Toyota Rush",          kelas: "SUV",       tahun: 2022, kursi: 7, transmisi: "Manual", tarif: 400000 },
  { id: "carry",   nama: "Suzuki Carry",         kelas: "Pickup",    tahun: 2020, kursi: 2, transmisi: "Manual", tarif: 250000 },
];

const state = {
  mulai: "",
  kembali: "",
  kelas: "semua",
  booking: [],
  pilihan: null, // { mobil, hari, total, ... }
};

/* ---------------- utilitas ---------------- */
const rupiah = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
const el = (id) => document.getElementById(id);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function tambahHari(tanggal, n) {
  const d = new Date(tanggal + "T00:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
}

/** Jumlah hari sewa. Tanggal sama = 1 hari. */
function hitungHari(mulai, kembali) {
  if (!mulai || !kembali) return 0;
  const a = new Date(mulai + "T00:00:00");
  const b = new Date(kembali + "T00:00:00");
  const selisih = Math.round((b - a) / 86400000);
  return selisih < 0 ? 0 : Math.max(1, selisih);
}

/** Dua rentang tanggal bertabrakan? Perbandingan string ISO aman. */
function bertabrakan(a1, a2, b1, b2) {
  return a1 < b2 && b1 < a2;
}

function bookingAktif() {
  return state.booking.filter((b) => b.status !== "Batal");
}

function mobilTersedia(mobilId, mulai, kembali) {
  if (!mulai || !kembali) return true;
  return !bookingAktif().some(
    (b) => b.mobilId === mobilId && bertabrakan(mulai, kembali, b.mulai, b.kembali)
  );
}

/* ---------------- gambar mobil (SVG tangan) ---------------- */
/* Tiap kelas digambar dengan siluet berbeda: tinggi atap, panjang bodi,
   ukuran roda, dan detail khas (roof rail, pintu geser, bak terbuka). */
function svgMobil(kelas) {
  const bentuk = {
    // MPV: satu kotak, atap tinggi dan rata, buritan tegak, pintu geser
    MPV: {
      body: "M18,84 V62 Q18,52 30,50 H62 L82,26 H212 Q224,26 232,36 L244,50 H288 Q300,52 300,62 V84 Z",
      kaca: "M90,46 L106,31 H206 L222,46 Z",
      detail: `<path d="M250,58 H286" stroke="var(--paper-3)" stroke-width="3" stroke-linecap="round"/>
               <path d="M96,52 V76" stroke="var(--paper-3)" stroke-width="2.5" stroke-linecap="round"/>`,
      roda: [[72, 88], [248, 88]], r: 14,
    },
    // SUV: atap lebih tinggi, ground clearance besar, roda besar, roof rail
    SUV: {
      body: "M20,80 V54 Q20,44 34,42 H66 L88,22 H214 Q228,22 236,34 L248,42 H286 Q296,44 296,56 V80 Z",
      kaca: "M96,42 L112,28 H208 L226,42 Z",
      detail: `<rect x="112" y="16" width="88" height="5" rx="2.5" fill="var(--ink)"/>
               <path d="M22,74 H294" stroke="var(--paper-3)" stroke-width="3" stroke-linecap="round"/>`,
      roda: [[74, 86], [246, 86]], r: 17,
    },
    // Hatchback: bodi pendek, atap rendah, buritan miring tajam
    Hatchback: {
      body: "M44,84 V68 Q44,58 56,56 H74 L104,34 H190 L226,56 H268 Q282,58 282,70 V84 Z",
      kaca: "M114,52 L130,38 H186 L210,52 Z",
      detail: `<path d="M56,62 H74" stroke="var(--paper-3)" stroke-width="3" stroke-linecap="round"/>`,
      roda: [[84, 90], [240, 90]], r: 12,
    },
    // Pickup: kabin pendek, bak terbuka rendah di belakang
    Pickup: {
      body: "M18,84 V62 Q18,52 30,50 H58 L80,30 H150 L164,50 H298 Q306,52 306,62 V84 Z",
      kaca: "M88,48 L102,35 H144 L156,48 Z",
      detail: `<rect x="172" y="56" width="126" height="24" rx="3" fill="var(--paper-3)" opacity="0.55"/>
               <path d="M172,56 V80 M298,56 V80" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>`,
      roda: [[70, 88], [252, 88]], r: 15,
    },
  }[kelas] || {
    body: "M18,84 V62 Q18,52 30,50 H288 Q300,52 300,62 V84 Z",
    kaca: "M90,46 L106,31 H206 L222,46 Z", detail: "", roda: [[72, 88], [248, 88]], r: 14,
  };

  const roda = bentuk.roda
    .map(([cx, cy]) => `
      <circle cx="${cx}" cy="${cy}" r="${bentuk.r}" fill="var(--ink)"/>
      <circle cx="${cx}" cy="${cy}" r="${bentuk.r * 0.42}" fill="var(--paper-3)"/>`)
    .join("");

  return `<svg viewBox="0 0 320 110" role="img" aria-label="Ilustrasi mobil ${kelas}">
    <ellipse cx="160" cy="99" rx="134" ry="6" fill="var(--ink)" opacity="0.10"/>
    <path d="${bentuk.body}" fill="var(--ink)"/>
    <path d="${bentuk.kaca}" fill="var(--accent)" opacity="0.65"/>
    ${bentuk.detail}
    <rect x="276" y="64" width="18" height="7" rx="3.5" fill="var(--accent)"/>
    ${roda}
  </svg>`;
}

/* ---------------- render armada ---------------- */
function renderArmada() {
  const daftar = MOBIL.filter((m) => state.kelas === "semua" || m.kelas === state.kelas);
  const hari = hitungHari(state.mulai, state.kembali);

  el("daftarArmada").innerHTML = daftar
    .map((m) => {
      const kosong = mobilTersedia(m.id, state.mulai, state.kembali);
      return `
      <article class="kartu">
        <div class="kartu__gambar">
          <span class="kartu__status" data-status="${kosong ? "kosong" : "penuh"}">
            ${kosong ? "Tersedia" : "Tersewa"}
          </span>
          <img class="kartu__foto" src="img/${m.id}.jpg?v=2" alt="Foto ${m.nama}"
               width="960" height="600" decoding="async"
               onerror="this.closest('.kartu__gambar').classList.add('tanpa-foto')">
          <div class="kartu__ilustrasi">${svgMobil(m.kelas)}</div>
        </div>
        <div class="kartu__isi">
          <h3>${m.nama}</h3>
          <div class="kartu__spek">
            <span>${m.kelas}</span>
            <span>${m.kursi} kursi</span>
            <span>${m.transmisi}</span>
            <span>${m.tahun}</span>
          </div>
          <div class="kartu__kaki">
            <p class="harga">${rupiah(m.tarif)} <small>/hari</small></p>
            <button class="btn ${kosong ? "btn--utama" : "btn--garis"}" type="button"
              data-sewa="${m.id}" ${kosong ? "" : "disabled"}>
              ${kosong ? "Sewa" : "Tidak tersedia"}
            </button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  const ket = el("ketArmada");
  if (hari > 0) {
    const sisa = daftar.filter((m) => mobilTersedia(m.id, state.mulai, state.kembali)).length;
    ket.textContent = `${sisa} dari ${daftar.length} unit kosong untuk ${hari} hari (${state.mulai} → ${state.kembali}).`;
  } else {
    ket.textContent = "Enam unit, semua rutin servis tiap 5.000 km. Pilih tanggal dulu untuk melihat yang kosong.";
  }
}

/* ---------------- dialog sewa ---------------- */
function bukaDialog(mobil) {
  const hari = hitungHari(state.mulai, state.kembali);
  if (hari < 1) {
    alert("Isi tanggal ambil dan kembali dulu.");
    return;
  }
  state.pilihan = { mobil, hari };
  el("judulDialog").textContent = mobil.nama;
  el("subDialog").textContent = `${state.mulai} → ${state.kembali} · ${hari} hari · ${mobil.transmisi}`;
  el("tarifSupir").textContent = `+${rupiah(TARIF_SUPIR)}/hari`;
  el("panelRincian").hidden = false;
  el("panelData").hidden = true;
  el("panelSukses").hidden = true;
  el("salahRincian").textContent = "";
  el("salahData").textContent = "";
  el("formSewa").reset();
  hitungRincian();
  el("dialogSewa").showModal();
}

function hitungRincian() {
  if (!state.pilihan) return;
  const { mobil, hari } = state.pilihan;
  const paket = document.querySelector('input[name="paket"]:checked').value;
  const antar = el("opsiAntar").checked;
  const asuransi = el("opsiAsuransi").checked;

  const dasar = mobil.tarif * hari;
  const supir = paket === "supir" ? TARIF_SUPIR * hari : 0;
  const biayaAntar = antar ? TARIF_ANTAR : 0;
  const biayaAsuransi = asuransi ? TARIF_ASURANSI * hari : 0;
  const total = dasar + supir + biayaAntar + biayaAsuransi;
  const deposit = paket === "lepas" ? 500000 : 0;

  state.pilihan = { mobil, hari, paket, dasar, supir, biayaAntar, biayaAsuransi, total, deposit };

  const baris = [
    [`Sewa ${hari} hari × ${rupiah(mobil.tarif)}`, rupiah(dasar)],
    paket === "supir" ? [`Supir ${hari} hari × ${rupiah(TARIF_SUPIR)}`, rupiah(supir)] : null,
    antar ? ["Antar-jemput bandara", rupiah(biayaAntar)] : null,
    asuransi ? [`Asuransi ${hari} hari × ${rupiah(TARIF_ASURANSI)}`, rupiah(biayaAsuransi)] : null,
    ["Total dibayar", rupiah(total)],
    deposit > 0 ? ["Deposit (dikembalikan saat mobil kembali utuh)", rupiah(deposit)] : null,
  ].filter(Boolean);

  el("rincian").innerHTML = baris
    .map(([kiri, kanan], i) => {
      const total = kiri === "Total dibayar";
      const kecil = kiri.startsWith("Deposit");
      const kelas = ["rincian__baris", total ? "rincian__baris--total" : "", kecil ? "rincian__baris--kecil" : ""]
        .filter(Boolean).join(" ");
      return `<div class="${kelas}"><span>${esc(kiri)}</span><span>${esc(kanan)}</span></div>`;
    })
    .join("");
}

/* ---------------- simpan booking ---------------- */
function buatKode() {
  const abjad = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let k = "";
  for (let i = 0; i < 5; i++) k += abjad[Math.floor(Math.random() * abjad.length)];
  return "AC-" + k;
}

function simpan() {
  try {
    localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(state.booking));
  } catch (e) {
    /* mode privat: data hanya bertahan selama halaman terbuka */
  }
}

function muat() {
  try {
    const isi = localStorage.getItem(KUNCI_SIMPAN);
    if (isi) state.booking = JSON.parse(isi);
  } catch (e) {
    state.booking = [];
  }
}

function validasiData() {
  const nama = el("nama").value.trim();
  const nik = el("nik").value.replace(/\s/g, "");
  const sim = el("sim").value.trim();
  const hp = el("hp").value.replace(/[\s-]/g, "");

  if (nama.length < 3) return "Nama minimal 3 karakter.";
  if (!/^\d{16}$/.test(nik)) return "NIK harus 16 angka.";
  if (sim.length < 5) return "Nomor SIM belum lengkap.";
  if (!/^08\d{8,11}$/.test(hp)) return "Nomor WhatsApp harus diawali 08 dan 10–13 angka.";
  return "";
}

function kirimSewa(ev) {
  ev.preventDefault();
  const salah = validasiData();
  if (salah) {
    el("salahData").textContent = salah;
    return;
  }

  const p = state.pilihan;
  if (!mobilTersedia(p.mobil.id, state.mulai, state.kembali)) {
    el("salahData").textContent = "Mobil ini baru saja dipesan orang lain di tanggal tersebut. Pilih tanggal lain.";
    return;
  }

  const kode = buatKode();
  state.booking.push({
    kode,
    mobilId: p.mobil.id,
    nama: el("nama").value.trim(),
    hp: el("hp").value.replace(/[\s-]/g, ""),
    mulai: state.mulai,
    kembali: state.kembali,
    hari: p.hari,
    paket: p.paket,
    total: p.total,
    deposit: p.deposit,
    status: "Menunggu",
    dibuat: new Date().toISOString(),
  });
  simpan();
  renderTabel();

  el("panelData").hidden = true;
  el("panelSukses").hidden = false;
  el("kodeBooking").textContent = kode;
  el("ringkasSukses").textContent =
    `${p.mobil.nama} · ${state.mulai} → ${state.kembali} · ${rupiah(p.total)}` +
    (p.deposit ? ` + deposit ${rupiah(p.deposit)}` : "");
  el("salinRincian").dataset.teks =
    `AtmajaCar ${kode}\n${p.mobil.nama}\n${state.mulai} → ${state.kembali} (${p.hari} hari)\n` +
    `Total: ${rupiah(p.total)}` + (p.deposit ? `\nDeposit: ${rupiah(p.deposit)}` : "");
}

/* ---------------- panel kelola ---------------- */
function renderTabel() {
  const tbody = el("isiTabel");
  const daftar = [...state.booking].sort((a, b) => (a.mulai < b.mulai ? 1 : -1));

  if (!daftar.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="kosong">Belum ada pesanan. Coba tombol “Isi contoh pesanan”.</td></tr>`;
  } else {
    tbody.innerHTML = daftar
      .map((b) => {
        const mobil = MOBIL.find((m) => m.id === b.mobilId);
        const opsi = ["Menunggu", "Disetujui", "Berjalan", "Selesai", "Batal"]
          .map((s) => `<option ${s === b.status ? "selected" : ""}>${s}</option>`)
          .join("");
        return `<tr>
          <td class="mono">${esc(b.kode)}</td>
          <td>${esc(b.nama)}</td>
          <td>${esc(mobil ? mobil.nama : b.mobilId)}</td>
          <td class="mono">${esc(b.mulai)} → ${esc(b.kembali)}</td>
          <td class="mono">${rupiah(b.total)}</td>
          <td><select data-kode="${esc(b.kode)}" aria-label="Status ${esc(b.kode)}">${opsi}</select></td>
        </tr>`;
      })
      .join("");
  }

  const bulan = new Date().toISOString().slice(0, 7);
  const pendapatan = state.booking
    .filter((b) => b.status !== "Batal" && b.mulai.slice(0, 7) === bulan)
    .reduce((n, b) => n + b.total, 0);
  const aktif = state.booking.filter((b) => ["Menunggu", "Disetujui", "Berjalan"].includes(b.status)).length;
  const jalan = state.booking.filter((b) => b.status === "Berjalan").length;

  el("statPendapatan").textContent = rupiah(pendapatan);
  el("statAktif").textContent = aktif;
  el("statJalan").textContent = jalan;
  el("statUtilisasi").textContent = Math.round((jalan / MOBIL.length) * 100) + "%";
}

/* ---------------- contoh data ---------------- */
function isiContoh() {
  const t = iso(new Date());
  const contoh = [
    { kode: "AC-7K2MD", mobilId: "avanza",  nama: "Rizky Pratama",   hp: "081234567890", mulai: t, kembali: tambahHari(t, 3), hari: 3, paket: "lepas", total: 350000 * 3 + TARIF_ANTAR, deposit: 500000, status: "Berjalan" },
    { kode: "AC-QW9PT", mobilId: "innova",  nama: "Sari Wulandari",  hp: "081298765432", mulai: tambahHari(t, 1), kembali: tambahHari(t, 5), hari: 4, paket: "supir", total: (550000 + TARIF_SUPIR) * 4, deposit: 0, status: "Disetujui" },
    { kode: "AC-3HN8X", mobilId: "brio",    nama: "Bagas Nugroho",   hp: "085712345678", mulai: tambahHari(t, 2), kembali: tambahHari(t, 4), hari: 2, paket: "lepas", total: 275000 * 2 + TARIF_ASURANSI * 2, deposit: 500000, status: "Menunggu" },
  ].map((b) => ({ ...b, dibuat: new Date().toISOString() }));

  state.booking = [...contoh, ...state.booking];
  simpan();
  renderTabel();
  renderArmada();
}

/* ---------------- pemasangan ---------------- */
function pasang() {
  const hariIni = iso(new Date());
  state.mulai = hariIni;
  state.kembali = tambahHari(hariIni, 2);
  el("cariMulai").value = state.mulai;
  el("cariKembali").value = state.kembali;
  el("cariMulai").min = hariIni;
  el("cariKembali").min = hariIni;

  muat();
  renderArmada();
  renderTabel();

  el("formCari").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const mulai = el("cariMulai").value;
    const kembali = el("cariKembali").value;
    if (!mulai || !kembali) return alert("Isi kedua tanggal dulu.");
    if (kembali < mulai) return alert("Tanggal kembali tidak boleh sebelum tanggal ambil.");
    state.mulai = mulai;
    state.kembali = kembali;
    state.kelas = el("cariKelas").value;
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.kelas === state.kelas)));
    renderArmada();
    el("armada").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.kelas = chip.dataset.kelas;
      el("cariKelas").value = chip.dataset.kelas;
      document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      renderArmada();
    });
  });

  el("daftarArmada").addEventListener("click", (ev) => {
    const tombol = ev.target.closest("[data-sewa]");
    if (!tombol || tombol.disabled) return;
    const mobil = MOBIL.find((m) => m.id === tombol.dataset.sewa);
    if (mobil) bukaDialog(mobil);
  });

  document.querySelectorAll('input[name="paket"], #opsiAntar, #opsiAsuransi')
    .forEach((i) => i.addEventListener("change", hitungRincian));

  el("lanjutData").addEventListener("click", () => {
    const mulai = state.mulai;
    const kembali = state.kembali;
    if (!mulai || !kembali || hitungHari(mulai, kembali) < 1) {
      el("salahRincian").textContent = "Tanggal belum lengkap.";
      return;
    }
    el("panelRincian").hidden = true;
    el("panelData").hidden = false;
    el("nama").focus();
  });

  el("kembaliRincian").addEventListener("click", () => {
    el("panelData").hidden = true;
    el("panelRincian").hidden = false;
  });

  el("formSewa").addEventListener("submit", kirimSewa);

  el("tutupDialog").addEventListener("click", () => el("dialogSewa").close());
  el("tutupSukses").addEventListener("click", () => {
    el("dialogSewa").close();
    renderArmada();
  });

  el("salinRincian").addEventListener("click", async (ev) => {
    const teks = ev.currentTarget.dataset.teks || "";
    try {
      await navigator.clipboard.writeText(teks);
      ev.currentTarget.textContent = "Tersalin";
      setTimeout(() => (ev.currentTarget.textContent = "Salin rincian"), 1600);
    } catch (e) {
      el("salahData").textContent = "";
      alert(teks);
    }
  });

  el("isiTabel").addEventListener("change", (ev) => {
    const sel = ev.target.closest("select[data-kode]");
    if (!sel) return;
    const b = state.booking.find((x) => x.kode === sel.dataset.kode);
    if (b) {
      b.status = sel.value;
      simpan();
      renderTabel();
      renderArmada();
    }
  });

  el("tombolContoh").addEventListener("click", isiContoh);
}

document.addEventListener("DOMContentLoaded", pasang);
