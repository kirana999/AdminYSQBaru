/* ========================================================= */
/* BLOCK 1: INISIALISASI ELEMEN MENU                         */
/* ========================================================= */
const reportToggle = document.getElementById('laporan-btn');
const reportSubmenu = document.getElementById('laporan-submenu');

/* ========================================================= */
/* BLOCK 2: LOGIKA BUKA/TUTUP (TOGGLE) SUB-MENU              */
/* ========================================================= */
if (reportToggle && reportSubmenu) {
    reportToggle.onclick = function(e) {
        // Mencegah navigasi default jika elemen adalah link
        e.preventDefault(); 
        // Menghentikan penyebaran klik agar tidak memicu auto-close secara tidak sengaja
        e.stopPropagation(); 

        const chevron = this.querySelector('.ysq-report-chevron');

        // Menggunakan pengecekan classList.contains agar lebih akurat daripada toggle()
        if (reportSubmenu.classList.contains('ysq-active')) {
            // JIKA SUDAH TERBUKA -> TUTUP
            reportSubmenu.classList.remove('ysq-active');
            if (chevron) chevron.classList.remove('ysq-rotate');
        } else {
            // JIKA MASIH TERTUTUP -> BUKA
            reportSubmenu.classList.add('ysq-active');
            if (chevron) chevron.classList.add('ysq-rotate');
        }
    };
}

/* ========================================================= */
/* BLOCK 3: AUTO-CLOSE SAAT MENU LAIN DIKLIK                 */
/* ========================================================= */
const otherMenus = document.querySelectorAll('.menu-item:not(#laporan-btn)');
otherMenus.forEach(menu => {
    menu.onclick = function() {
        // Tutup submenu laporan jika Admin mengklik menu sidebar lainnya
        if (reportSubmenu && reportSubmenu.classList.contains('ysq-active')) {
            reportSubmenu.classList.remove('ysq-active');
            
            const chevron = reportToggle.querySelector('.ysq-report-chevron');
            if (chevron) {
                chevron.classList.remove('ysq-rotate');
            }
        }
    };
});