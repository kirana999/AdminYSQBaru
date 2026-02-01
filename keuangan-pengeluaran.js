/* ========================================================= */
/* BLOCK 1: MANAJEMEN MODAL (BUKA & TUTUP)                   */
/* ========================================================= */

// Fungsi untuk memunculkan popup modal
function openModalPengeluaran() {
    const modal = document.getElementById('modalPengeluaran');
    if (modal) {
        modal.style.display = 'flex'; // Menggunakan flex agar konten di tengah
        
        // Mengisi input tanggal otomatis dengan tanggal hari ini
        const tglInput = document.getElementById('out-tgl');
        if (tglInput) tglInput.valueAsDate = new Date();
    }
}

// Fungsi untuk menyembunyikan popup modal
function closeModalPengeluaran() {
    const modal = document.getElementById('modalPengeluaran');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Menutup modal secara otomatis jika Admin klik di luar kotak putih modal
window.onclick = function(event) {
    const modal = document.getElementById('modalPengeluaran');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


/* ========================================================= */
/* BLOCK 2: PROSES SIMPAN DATA KE TABEL                      */
/* ========================================================= */

function savePengeluaran() {
    // Mengambil nilai dari setiap input di dalam modal
    const jenis = document.getElementById('out-jenis').value;
    const tgl = document.getElementById('out-tgl').value;
    const nominal = document.getElementById('out-nominal').value;
    const ket = document.getElementById('out-ket').value;
    const tableBody = document.getElementById('ysq-pengeluaran-body');

    // Validasi: Mencegah data kosong masuk ke tabel
    if (!jenis || !nominal || !tgl) {
        alert("Harap lengkapi Jenis Pengeluaran, Tanggal, dan Nominal!");
        return;
    }

    // Mengubah format tanggal dari YYYY-MM-DD menjadi DD/MM/YYYY agar enak dibaca
    const formattedDate = tgl.split('-').reverse().join('/');

    // Membuat baris (row) baru untuk tabel
    const newRow = `
        <tr class="ysq-row-out">
            <td>${formattedDate}</td>
            <td><strong>${jenis}</strong></td>
            <td>${ket || '-'}</td>
            <td class="text-nominal-out">Rp ${parseInt(nominal).toLocaleString('id-ID')}</td>
        </tr>
    `;

    // Memasukkan baris baru ke posisi paling atas tabel (afterbegin)
    tableBody.insertAdjacentHTML('afterbegin', newRow);

    // Selesaikan proses: tutup modal dan bersihkan form input
    closeModalPengeluaran();
    document.getElementById('out-jenis').value = "";
    document.getElementById('out-nominal').value = "";
    document.getElementById('out-ket').value = "";
}


/* ========================================================= */
/* BLOCK 3: FITUR FILTER (URUTAN, KATEGORI, & SEARCH)        */
/* ========================================================= */

// Fungsi untuk mengurutkan data (Terbaru/Terlama)
function sortDataPengeluaran() {
    const tableBody = document.getElementById('ysq-pengeluaran-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const sortValue = document.getElementById('sort-pengeluaran').value;

    if (rows.length === 0) return;

    rows.sort((a, b) => {
        // Mengubah teks tanggal di tabel kembali ke format tanggal sistem untuk dibandingkan
        const dateA = a.cells[0].innerText.split('/').reverse().join('-');
        const dateB = b.cells[0].innerText.split('/').reverse().join('-');
        
        return sortValue === 'asc' 
            ? new Date(dateA) - new Date(dateB)  // Terlama ke Terbaru
            : new Date(dateB) - new Date(dateA); // Terbaru ke Terlama
    });

    // Tampilkan ulang baris yang sudah terurut ke dalam tabel
    tableBody.innerHTML = "";
    rows.forEach(row => tableBody.appendChild(row));
}

// Fungsi Pencarian: Menyaring tabel berdasarkan teks yang diketik Admin
function searchPengeluaran() {
    const input = document.getElementById("search-out").value.toLowerCase();
    const tableBody = document.getElementById("ysq-pengeluaran-body");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        // Mencari kata kunci di seluruh teks dalam satu baris
        const textRow = rows[i].innerText.toLowerCase();
        rows[i].style.display = textRow.indexOf(input) > -1 ? "" : "none";
    }
}

// Fungsi Filter Kategori: Menyaring berdasarkan jenis pengeluaran yang dipilih
function filterByCategory() {
    const category = document.getElementById("filter-kategori").value.toLowerCase();
    const tableBody = document.getElementById("ysq-pengeluaran-body");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const cellJenis = rows[i].getElementsByTagName("td")[1]; // Kolom Jenis Pengeluaran
        if (cellJenis) {
            const textValue = cellJenis.textContent.toLowerCase();
            // Tampilkan jika kategori adalah "all" atau kata kunci kategori ditemukan
            rows[i].style.display = (category === "all" || textValue.indexOf(category) > -1) ? "" : "none";
        }
    }
}