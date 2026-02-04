/* ========================================================= */
/* BLOCK 1: NAVIGASI & GENERATE LAPORAN UTAMA                */
/* ========================================================= */

function generateIncomeReport() {
    const filterCat = document.getElementById('ysq-filter-cat').value;
    
    // Reset Header: Menghapus tombol kondisional (SPP/Infaq)
    resetHeaderActions();

    if (filterCat === 'iuran') {
        renderSPPView(); // Mode Pencarian Santri & Tunggakan
    } else if (filterCat === 'infaq') {
        renderInfaqView(); // Mode Donatur & Tombol Input Baru
    } else {
        renderGeneralView(); // Ringkasan Utama (Semua Pemasukan)
    }
}

function resetHeaderActions() {
    const actionContainer = document.getElementById('ysq-header-actions');
    if (!actionContainer) return;

    actionContainer.innerHTML = `
        <button class="ysq-inc-btn ysq-inc-btn-export" onclick="exportData('pdf')">
            <i class="fas fa-file-pdf"></i> Export PDF
        </button>
        <button class="ysq-inc-btn ysq-inc-btn-export" onclick="exportData('excel')">
            <i class="fas fa-file-excel"></i> Export Excel
        </button>
    `;
}

/* ========================================================= */
/* BLOCK 2: TAMPILAN MODE SPP (IURAN SANTRI)                 */
/* ========================================================= */

function renderSPPView() {
    const summaryGrid = document.querySelector('.ysq-inc-summary-grid');
    const filterGrid = document.querySelector('.ysq-inc-filter-grid');
    const tableHead = document.querySelector('.ysq-inc-table thead');
    const actionContainer = document.getElementById('ysq-header-actions');
    const wrapper = document.getElementById('all-income-wrapper');

    if (actionContainer && !document.getElementById('btn-tambah-spp')) {
        const btnTambahSPP = document.createElement('button');
        btnTambahSPP.id = 'btn-tambah-spp';
        btnTambahSPP.className = 'ysq-inc-btn ysq-inc-btn-primary';
        btnTambahSPP.innerHTML = '<i class="fas fa-plus-circle"></i> Tambah SPP';
        btnTambahSPP.onclick = openSPPModal;
        actionContainer.prepend(btnTambahSPP);
    }

    if (summaryGrid) summaryGrid.style.display = 'none';
    if (wrapper) wrapper.className = ""; 

    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>Periode Awal</th>
                <th>Kelas</th>
                <th>Kategori</th>
                <th>Total Tagihan</th>
                <th>Dibayar</th>
                <th>Tunggakan</th>
                <th>Status</th>
            </tr>
        `;
    }
}

/* ========================================================= */
/* BLOCK 3: TAMPILAN MODE INFAQ & DONASI                     */
/* ========================================================= */

function renderInfaqView() {
    const actionContainer = document.getElementById('ysq-header-actions');
    const tableHead = document.querySelector('.ysq-inc-table thead');

    if (actionContainer && !document.getElementById('btn-tambah-infaq')) {
        const btnTambah = document.createElement('button');
        btnTambah.id = 'btn-tambah-infaq';
        btnTambah.className = 'ysq-inc-btn ysq-inc-btn-primary';
        btnTambah.innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Infaq dan Donasi';
        btnTambah.onclick = openInfaqModal;
        actionContainer.prepend(btnTambah);
    }

    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>Tanggal</th>
                <th>Nama Donatur</th>
                <th>Keterangan</th>
                <th>Nominal Infaq</th>
            </tr>
        `;
    }
}

/* ========================================================= */
/* BLOCK 4: LOGIKA MODAL SPP & PERHITUNGAN TUNGGAKAN         */
/* ========================================================= */

function openSPPModal() {
    const modal = document.getElementById('sppModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('spp-tgl-mulai').valueAsDate = new Date();
    }
}

function closeSPPModal() {
    document.getElementById('sppModal').style.display = 'none';
}

function saveSPPFromModal() {
    const nominalRaw = document.getElementById('spp-nominal').value;
    const nominal = cleanRupiah(nominalRaw);
    const kelas = document.getElementById('spp-kelas').value;
    const kategori = document.getElementById('spp-kategori').value;
    const tglMulai = document.getElementById('spp-tgl-mulai').value;
    const tableBody = document.getElementById('ysq-income-body');

    // Standar Biaya SPP Yayasan (Ubah sesuai kebijakan)
    const biayaWajib = 350000; 

    if (!nominal || !tglMulai) {
        alert("Harap lengkapi Nominal dan Tanggal!");
        return;
    }

    // Hitung Selisih untuk Tunggakan
    const sisa = biayaWajib - nominal;
    const status = sisa <= 0 ? "Lunas" : "Mencicil";
    const badgeClass = sisa <= 0 ? "ysq-badge-iuran" : "ysq-badge-warning";

    const newRow = `
        <tr style="background-color: #f0fdf4; text-align: center;">
            <td>${tglMulai.split('-').reverse().join('/')}</td>
            <td>${kelas}</td>
            <td>${kategori}</td>
            <td>Rp ${biayaWajib.toLocaleString('id-ID')}</td>
            <td class="text-success">Rp ${nominal.toLocaleString('id-ID')}</td>
            <td style="color: red; font-weight: bold;">Rp ${sisa.toLocaleString('id-ID')}</td>
            <td><span class="ysq-badge ${badgeClass}">${status}</span></td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('afterbegin', newRow);
    closeSPPModal();
    document.getElementById('spp-nominal').value = "";
}

/* ========================================================= */
/* BLOCK 5: MANAJEMEN MODAL INPUT INFAQ                      */
/* ========================================================= */

function openInfaqModal() {
    const modal = document.getElementById('infaqModal');
    if (modal) {
        modal.style.display = 'flex'; 
        document.getElementById('modal-tgl').valueAsDate = new Date();
    }
}

function closeInfaqModal() {
    document.getElementById('infaqModal').style.display = 'none';
}

function saveInfaqFromModal() {
    const nama = document.getElementById('modal-nama').value;
    const tgl = document.getElementById('modal-tgl').value;
    const nominal = parseInt(document.getElementById('modal-nominal').value) || 0;
    const ket = document.getElementById('modal-ket').value;
    const tableBody = document.getElementById('ysq-income-body');

    if (!nama || !nominal || !tgl) {
        alert("Harap lengkapi data Infaq!");
        return;
    }

    const newRow = `
        <tr style="background-color: #f0fdf4; text-align: center;">
            <td>${tgl.split('-').reverse().join('/')}</td>
            <td><strong>${nama}</strong></td>
            <td>${ket || '-'}</td>
            <td class="text-success" style="font-weight:bold;">Rp ${nominal.toLocaleString('id-ID')}</td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('afterbegin', newRow);
    closeInfaqModal();
}

/* ========================================================= */
/* BLOCK 6: TAMPILAN UMUM & LOAD DATA                        */
/* ========================================================= */

function renderGeneralView() {
    const tableHead = document.querySelector('.ysq-inc-table thead');
    const wrapper = document.getElementById('all-income-wrapper');
    if (wrapper) wrapper.className = "ysq-all-income-container"; 

    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>Tanggal</th>
                <th>Nama / Sumber</th>
                <th>Keterangan</th>
                <th>Nominal</th>
            </tr>
        `;
    }
}

/* ========================================================= */
/* BLOCK 7: FORMATTER RUPIAH OTOMATIS (INPUT REAL-TIME)      */
/* ========================================================= */

function formatRupiah(elemen) {
    let value = elemen.value.replace(/[^,\d]/g, "").toString();
    let split = value.split(",");
    let sisa  = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
    elemen.value = rupiah;
}

// Fungsi bantu untuk membersihkan titik sebelum simpan ke database
function cleanRupiah(string) {
    return parseInt(string.replace(/\./g, "")) || 0;
}

function loadSPPData() { 
    document.getElementById('ysq-income-body').innerHTML = ""; 
}

function loadInfaqData() { 
    document.getElementById('ysq-income-body').innerHTML = ""; 
}