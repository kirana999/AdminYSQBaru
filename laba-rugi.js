/* ========================================================= */
/* BLOCK 1: DEKLARASI SUMBER DATA (EMPTY STATE)              */
/* ========================================================= */

// Variabel penampung data yang akan diambil dari database/sumber lain
let dataPemasukan = []; 
let dataPengeluaran = [];

/* ========================================================= */
/* BLOCK 2: LOGIKA PENGHITUNGAN & RENDER TABEL               */
/* ========================================================= */

function hitungLabaRugi() {
    const filterTipe = document.getElementById('filter-tipe-lr')?.value || 'all';
    const tableBody = document.getElementById('ysq-lr-body');
    
    let totalIn = 0;
    let totalOut = 0;
    
    if (!tableBody) return;
    tableBody.innerHTML = "";

    // 1. Memproses Data Pemasukan (Badge Hijau)
    if (filterTipe === 'all' || filterTipe === 'masuk') {
        dataPemasukan.forEach(item => {
            totalIn += item.nominal;
            tableBody.innerHTML += `
                <tr>
                    <td>${item.tgl}</td>
                    <td><strong>${item.ket}</strong></td>
                    <td><span class="badge-in">Masuk</span></td>
                    <td class="text-success" style="font-weight:700">Rp ${item.nominal.toLocaleString('id-ID')}</td>
                </tr>`;
        });
    }

    // 2. Memproses Data Pengeluaran (Badge Merah)
    if (filterTipe === 'all' || filterTipe === 'keluar') {
        dataPengeluaran.forEach(item => {
            totalOut += item.nominal;
            tableBody.innerHTML += `
                <tr class="row-lr-expense">
                    <td>${item.tgl}</td>
                    <td><strong>${item.ket}</strong></td>
                    <td><span class="badge-out">Keluar</span></td>
                    <td class="text-nominal-out">Rp ${item.nominal.toLocaleString('id-ID')}</td>
                </tr>`;
        });
    }

    // 3. Memperbarui Kartu Ringkasan (Dashboard Atas)
    updateSummaryCards(totalIn, totalOut);
}

/* ========================================================= */
/* BLOCK 3: UPDATE VISUAL KARTU RINGKASAN                    */
/* ========================================================= */

function updateSummaryCards(totalIn, totalOut) {
    const saldo = totalIn - totalOut;
    const balanceCard = document.getElementById('balance-card');

    document.getElementById('total-pemasukan').innerText = `Rp ${totalIn.toLocaleString('id-ID')}`;
    document.getElementById('total-pengeluaran').innerText = `Rp ${totalOut.toLocaleString('id-ID')}`;
    document.getElementById('total-saldo').innerText = `Rp ${saldo.toLocaleString('id-ID')}`;

    // Menandai kartu saldo dengan warna merah jika hasil akhirnya minus (Rugi)
    if (balanceCard) {
        if (saldo < 0) {
            balanceCard.classList.add('balance-negative');
        } else {
            balanceCard.classList.remove('balance-negative');
        }
    }
}

/* ========================================================= */
/* BLOCK 4: FITUR PENCARIAN TRANSAKSI                        */
/* ========================================================= */

function searchLR() {
    const input = document.getElementById("search-lr").value.toLowerCase();
    const tableBody = document.getElementById("ysq-lr-body");
    const rows = tableBody.getElementsByTagName("tr");

    for (let row of rows) {
        // Menyembunyikan baris yang tidak mengandung kata kunci pencarian
        row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
    }
}

/* ========================================================= */
/* BLOCK 5: INITIALIZATION (MENJALANKAN SAAT START)          */
/* ========================================================= */

// Memastikan fungsi hitung dipanggil saat halaman selesai dimuat
window.onload = hitungLabaRugi;