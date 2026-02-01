/* ========================================================= */
/* BLOCK 1: NAVIGASI & GENERATE LAPORAN UTAMA                */
/* ========================================================= */

// Fungsi Utama yang dipanggil tombol "Tampilkan Data"
function generateIncomeReport() {
    const filterCat = document.getElementById('ysq-filter-cat').value;
    
    // Reset Header: Menghapus tombol input kondisional
    resetHeaderActions();

    if (filterCat === 'iuran') {
        renderSPPView(); // Mode Pencarian Santri & Cicilan
    } else if (filterCat === 'infaq') {
        renderInfaqView(); // Mode Donatur & Tombol Input Baru
    } else {
        renderGeneralView(); // Kembali ke Ringkasan Utama (Semua Pemasukan)
    }
}

// Fungsi Reset Header untuk menjaga tombol Export tetap ada
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
    const wrapper = document.getElementById('all-income-wrapper');

    if (summaryGrid) summaryGrid.style.display = 'none';
    if (wrapper) wrapper.className = ""; // Matikan scope 4 kolom agar tabel SPP bisa lebar

    if (filterGrid) {
        filterGrid.style.gridTemplateColumns = "1fr 1fr 1.5fr"; 
        filterGrid.innerHTML = `
            <div class="ysq-inc-form-group">
                <label>Cari Nama Santri:</label>
                <input type="text" id="search-name" class="ysq-inc-input" placeholder="Masukkan nama...">
            </div>
            <div class="ysq-inc-form-group">
                <label>Periode (Bulan/Tahun):</label>
                <input type="month" id="filter-month" class="ysq-inc-input">
            </div>
            <div class="ysq-spp-btn-group">
                <button class="ysq-inc-btn ysq-inc-btn-primary ysq-btn-large" onclick="loadSPPData()">
                    <i class="fas fa-search"></i> Cari SPP
                </button>
                <button class="ysq-inc-btn ysq-btn-large ysq-btn-secondary" onclick="location.reload()">
                    <i class="fas fa-undo"></i> Kembali
                </button>
            </div>
        `;
    }

    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>Nama Santri</th>
                <th>Kelas</th>
                <th>Periode</th>
                <th>Total Tagihan</th>
                <th>Sudah Dibayar</th>
                <th>Sisa Tagihan</th>
                <th>Status</th>
            </tr>
        `;
    }
}

/* ========================================================= */
/* BLOCK 3: TAMPILAN MODE INFAQ & DONASI                     */
/* ========================================================= */

function renderInfaqView() {
    const summaryGrid = document.querySelector('.ysq-inc-summary-grid');
    const filterGrid = document.querySelector('.ysq-inc-filter-grid');
    const tableHead = document.querySelector('.ysq-inc-table thead');
    const actionContainer = document.getElementById('ysq-header-actions');

    // Tambahkan Tombol "Tambah Infaq" secara dinamis di Header
    if (actionContainer && !document.getElementById('btn-tambah-infaq')) {
        const btnTambah = document.createElement('button');
        btnTambah.id = 'btn-tambah-infaq';
        btnTambah.className = 'ysq-inc-btn ysq-inc-btn-primary';
        btnTambah.innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Infaq dan Donasi';
        btnTambah.onclick = openInfaqModal;
        actionContainer.prepend(btnTambah);
    }

    if (summaryGrid) summaryGrid.style.display = 'grid';

    if (filterGrid) {
        filterGrid.style.gridTemplateColumns = "1.5fr 1fr 1.5fr"; 
        filterGrid.innerHTML = `
            <div class="ysq-inc-form-group">
                <label>Cari Nama Donatur:</label>
                <input type="text" id="search-infaq" class="ysq-inc-input" placeholder="Contoh: Hamba Allah...">
            </div>
            <div class="ysq-inc-form-group">
                <label>Urutan Data:</label>
                <select id="sort-date" class="ysq-inc-input" onchange="loadInfaqData()">
                    <option value="desc">Terbaru ke Terlama</option>
                    <option value="asc">Terlama ke Terbaru</option>
                </select>
            </div>
            <div class="ysq-spp-btn-group">
                <button class="ysq-inc-btn ysq-inc-btn-primary ysq-btn-large" onclick="loadInfaqData()">
                    <i class="fas fa-search"></i> Cari Data
                </button>
                <button class="ysq-inc-btn ysq-btn-large ysq-btn-secondary" onclick="location.reload()">
                    <i class="fas fa-undo"></i> Kembali
                </button>
            </div>
        `;
    }

    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>Tanggal Diberi</th>
                <th>Nama Donatur</th>
                <th>Keterangan</th>
                <th>Nominal Infaq</th>
            </tr>
        `;
    }
}

/* ========================================================= */
/* BLOCK 4: MANAJEMEN MODAL INPUT INFAQ                      */
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
    const nominal = document.getElementById('modal-nominal').value;
    const ket = document.getElementById('modal-ket').value;
    const tableBody = document.getElementById('ysq-income-body');

    if (!nama || !nominal || !tgl) {
        alert("Nama, Tanggal, dan Nominal wajib diisi!");
        return;
    }

    const formattedDate = tgl.split('-').reverse().join('/');
    const newRow = `
        <tr style="background-color: #f0fdf4;">
            <td>${formattedDate}</td>
            <td><strong>${nama}</strong></td>
            <td>${ket || '-'}</td>
            <td class="text-success" style="font-weight:bold;">Rp ${parseInt(nominal).toLocaleString('id-ID')}</td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('afterbegin', newRow);
    closeInfaqModal();
    
    // Reset fields
    document.getElementById('modal-nama').value = "";
    document.getElementById('modal-nominal').value = "";
    document.getElementById('modal-ket').value = "";
}

/* ========================================================= */
/* BLOCK 5: TAMPILAN UMUM (SEMUA PEMASUKAN)                  */
/* ========================================================= */

function renderGeneralView() {
    const summaryGrid = document.querySelector('.ysq-inc-summary-grid');
    const wrapper = document.getElementById('all-income-wrapper');
    const tableHead = document.querySelector('.ysq-inc-table thead');

    if (summaryGrid) summaryGrid.style.display = 'grid';
    if (wrapper) wrapper.className = "ysq-all-income-container"; // Aktifkan scope 4 kolom

    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>Tanggal</th>
                <th>Nama / Sumber</th>
                <th>Periode / Keterangan</th>
                <th>Nominal</th>
            </tr>
        `;
    }
}

/* ========================================================= */
/* BLOCK 6: FUNGSI LOAD DATA (DIHUBUNGKAN KE API/DATABASE)   */
/* ========================================================= */

function loadSPPData() {
    const tableBody = document.getElementById('ysq-income-body');
    if (tableBody) tableBody.innerHTML = ""; 
    // Di sini nantinya Anda melakukan Fetch data dari database
}

function loadInfaqData() {
    const tableBody = document.getElementById('ysq-income-body');
    if (tableBody) tableBody.innerHTML = ""; 
    // Di sini nantinya Anda melakukan Fetch data dari database
}