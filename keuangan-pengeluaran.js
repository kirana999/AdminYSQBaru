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
    if (modal) {
        modal.style.display = 'none';
    }
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

// Fungsi untuk membuat titik otomatis saat Admin mengetik
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

// Fungsi untuk menghapus titik agar bisa dihitung secara matematis
function cleanRupiah(string) {
    return parseInt(string.replace(/\./g, "")) || 0;
}

/* ========================================================= */
/* BLOCK 3: PROSES SIMPAN DATA KE TABEL                      */
/* ========================================================= */

function savePengeluaran() {
    const jenis = document.getElementById('out-jenis').value;
    const tgl = document.getElementById('out-tgl').value;
    const nominalRaw = document.getElementById('out-nominal').value; // Mengambil string ber-titik
    const ket = document.getElementById('out-ket').value;
    const tableBody = document.getElementById('ysq-pengeluaran-body');

    // Membersihkan nominal dari titik sebelum divalidasi/disimpan
    const nominalMurni = cleanRupiah(nominalRaw);

    if (!jenis || nominalMurni <= 0 || !tgl) {
        alert("Harap lengkapi Jenis Pengeluaran, Tanggal, dan Nominal!");
        return;
    }

    const formattedDate = tgl.split('-').reverse().join('/');

    const newRow = `
        <tr class="ysq-row-out">
            <td>${formattedDate}</td>
            <td><strong>${jenis}</strong></td>
            <td>${ket || '-'}</td>
            <td class="text-nominal-out">Rp ${nominalMurni.toLocaleString('id-ID')}</td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('afterbegin', newRow);

    closeModalPengeluaran();
    
    // Reset Form
    document.getElementById('out-jenis').value = "";
    document.getElementById('out-nominal').value = "";
    document.getElementById('out-ket').value = "";
}

/* ========================================================= */
/* BLOCK 4: FITUR FILTER (URUTAN, KATEGORI, & SEARCH)        */
/* ========================================================= */

function sortDataPengeluaran() {
    const tableBody = document.getElementById('ysq-pengeluaran-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const sortValue = document.getElementById('sort-pengeluaran').value;

    if (rows.length === 0) return;

    rows.sort((a, b) => {
        const dateA = a.cells[0].innerText.split('/').reverse().join('-');
        const dateB = b.cells[0].innerText.split('/').reverse().join('-');
        
        return sortValue === 'asc' 
            ? new Date(dateA) - new Date(dateB) 
            : new Date(dateB) - new Date(dateA);
    });

    tableBody.innerHTML = "";
    rows.forEach(row => tableBody.appendChild(row));
}

function searchPengeluaran() {
    const input = document.getElementById("search-out").value.toLowerCase();
    const tableBody = document.getElementById("ysq-pengeluaran-body");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const textRow = rows[i].innerText.toLowerCase();
        rows[i].style.display = textRow.indexOf(input) > -1 ? "" : "none";
    }
}

function filterByCategory() {
    const category = document.getElementById("filter-kategori").value.toLowerCase();
    const tableBody = document.getElementById("ysq-pengeluaran-body");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const cellJenis = rows[i].getElementsByTagName("td")[1];
        if (cellJenis) {
            const textValue = cellJenis.textContent.toLowerCase();
            rows[i].style.display = (category === "all" || textValue.indexOf(category) > -1) ? "" : "none";
        }
    }
}