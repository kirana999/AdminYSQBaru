/* ========================================================= */
/* BLOCK 1: MANAJEMEN MODAL (BUKA & TUTUP)                   */
/* ========================================================= */

function openModalPengeluaran() {
    const modal = document.getElementById('modalPengeluaran');
    if (modal) {
        modal.style.display = 'flex';
        const tglInput = document.getElementById('out-tgl');
        if (tglInput) tglInput.valueAsDate = new Date();
    }
}

function closeModalPengeluaran() {
    const modal = document.getElementById('modalPengeluaran');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modalPengeluaran');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

/* ========================================================= */
/* BLOCK 2: FORMATTER RUPIAH & PEMBERSIH ANGKA               */
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
    elemen.value = rupiah;
}

function cleanRupiah(string) {
    return parseInt(string.replace(/\./g, "")) || 0;
}

/* ========================================================= */
/* BLOCK 3: LOGIKA GENERATE LAPORAN & HITUNG TOTAL           */
/* ========================================================= */

// Fungsi utama untuk memproses filter (Tombol Tampilkan Data)
function generateExpenseReport() {
    const dateStart = document.getElementById('ysq-out-date-start').value;
    const dateEnd = document.getElementById('ysq-out-date-end').value;
    const category = document.getElementById('ysq-out-filter-cat').value;

    // Logika filter tabel secara visual
    const tableBody = document.getElementById('ysq-pengeluaran-body');
    const rows = tableBody.getElementsByTagName('tr');

    for (let row of rows) {
        const rowDate = row.cells[0].innerText.split('/').reverse().join('-'); // YYYY-MM-DD
        const rowCat = row.cells[1].innerText;

        let matchDate = true;
        let matchCat = true;

        if (dateStart && dateEnd) {
            matchDate = (rowDate >= dateStart && rowDate <= dateEnd);
        }
        if (category !== 'all') {
            matchCat = (rowCat === category);
        }

        row.style.display = (matchDate && matchCat) ? "" : "none";
    }
    
    updateTotalPengeluaran();
}

// Fungsi untuk menjumlahkan semua nominal yang tampil di tabel
function updateTotalPengeluaran() {
    const tableBody = document.getElementById('ysq-pengeluaran-body');
    const rows = tableBody.getElementsByTagName('tr');
    let total = 0;

    for (let row of rows) {
        if (row.style.display !== "none") {
            const nominalText = row.cells[3].innerText; // Kolom Nominal
            const nominalMurni = cleanRupiah(nominalText.replace("Rp ", ""));
            total += nominalMurni;
        }
    }

    document.getElementById('ysq-total-pengeluaran').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

/* ========================================================= */
/* BLOCK 4: PROSES SIMPAN DATA KE TABEL                      */
/* ========================================================= */

function savePengeluaran() {
    const jenis = document.getElementById('out-jenis').value;
    const tgl = document.getElementById('out-tgl').value;
    const nominalRaw = document.getElementById('out-nominal').value;
    const ket = document.getElementById('out-ket').value;
    const tableBody = document.getElementById('ysq-pengeluaran-body');

    const nominalMurni = cleanRupiah(nominalRaw);

    if (!jenis || nominalMurni <= 0 || !tgl) {
        alert("Harap lengkapi Kategori, Tanggal, dan Nominal!");
        return;
    }

    const formattedDate = tgl.split('-').reverse().join('/');

    const newRow = `
        <tr class="ysq-row-out">
            <td>${formattedDate}</td>
            <td><strong>${jenis}</strong></td>
            <td>${ket || '-'}</td>
            <td class="text-nominal-out" style="font-weight:bold; color:#e74c3c;">Rp ${nominalMurni.toLocaleString('id-ID')}</td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('afterbegin', newRow);

    closeModalPengeluaran();
    updateTotalPengeluaran(); // Langsung update kartu total
    
    // Reset Form
    document.getElementById('out-jenis').value = "";
    document.getElementById('out-nominal').value = "";
    document.getElementById('out-ket').value = "";
}