/**
 * rapor-admin.js 
 * Logic for Administrative Report Management - YSQ System
 */

// Menangkap elemen modal dengan ID unik
const modalOverlay = document.getElementById('reviewModal');
const modalTitle = document.getElementById('modal-title');
const modalNama = document.getElementById('modal-nama');
const modalNis = document.getElementById('modal-nis');
const modalKelas = document.getElementById('modal-kelas');

// Elemen konten dinamis di dalam modal
const publishConfirmBox = document.getElementById('publish-confirmation');
const publishedInfoBox = document.getElementById('published-info');
const btnSubmitAction = document.getElementById('btn-action-publish');

/**
 * Membuka Modal dengan posisi center (flex)
 */
function openReview(nama, nis, kelas, status) {
    // 1. Sinkronisasi data identitas
    modalNama.innerText = nama;
    modalNis.innerText = nis;
    modalKelas.innerText = kelas;

    // 2. Kontrol tampilan berdasarkan status (Draft vs Terbit)
    if (status.toLowerCase() === 'draft') {
        modalTitle.innerText = "Verifikasi Penerbitan Rapor";
        
        publishConfirmBox.style.display = "block";
        publishedInfoBox.style.display = "none";
        
        btnSubmitAction.style.display = "block";
        btnSubmitAction.innerText = "Terbitkan Rapor";
    } else {
        modalTitle.innerText = "Detail Rapor Resmi";
        
        publishConfirmBox.style.display = "none";
        publishedInfoBox.style.display = "block";
        
        // Tombol terbitkan disembunyikan jika sudah terbit
        btnSubmitAction.style.display = "none";
    }

    // 3. Memunculkan Modal dengan DISPLAY FLEX agar align-items:center bekerja
    modalOverlay.style.display = "flex";
}

/**
 * Menutup Modal
 */
function closeModal() {
    modalOverlay.style.display = "none";
}

/**
 * Menutup modal jika area blur (di luar kotak) diklik
 */
window.onclick = function(event) {
    if (event.target == modalOverlay) {
        closeModal();
    }
}

/**
 * Aksi Final: Menerbitkan Rapor
 */
function processPublish() {
    const nama = modalNama.innerText;
    
    // Alert sukses sederhana
    alert(`Alhamdulillah, Rapor ${nama} berhasil diterbitkan secara resmi!`);
    
    closeModal();
    
    // Optional: Refresh tabel atau update status baris secara langsung
    // location.reload(); 
}

/**
 * Fungsi Filter Tabel (Nama, NIS, Kelas, dan Status)
 */
function filterRapor() {
    const searchInput = document.getElementById('search-santri').value.toLowerCase();
    const classFilter = document.getElementById('filter-kelas').value;
    const statusFilter = document.getElementById('filter-status').value;
    const rows = document.querySelectorAll('#rapor-table-body tr');

    rows.forEach(row => {
        // Ambil data dari kolom tabel
        const nameText = row.cells[0].innerText.toLowerCase();
        const nisText = row.cells[1].innerText.toLowerCase();
        const classText = row.cells[2].innerText;
        
        // Cek status dari badge
        const badge = row.querySelector('.badge-status');
        const isPublished = badge.classList.contains('published');
        const statusValue = isPublished ? 'published' : 'draft';

        // Logika kecocokan filter
        const matchSearch = nameText.includes(searchInput) || nisText.includes(searchInput);
        const matchClass = classFilter === 'all' || classText === classFilter;
        const matchStatus = statusFilter === 'all' || statusValue === statusFilter;

        // Tampilkan atau sembunyikan baris
        row.style.display = (matchSearch && matchClass && matchStatus) ? "" : "none";
    });
}