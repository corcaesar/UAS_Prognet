// --- Logika Asli Anda untuk Menu Mobile ---
const menu = document.querySelector(".menu");
const hamburgerMenu = document.querySelector(".hamburger-menu");

// Periksa apakah elemen ditemukan sebelum menambahkan listener
if (menu && hamburgerMenu) {
  menu.addEventListener("click", displayMenu);
  hamburgerMenu.addEventListener("click", displayMenu);
}

const iconBars = document.querySelector("#hamburger");
const iconClose = document.querySelector("#close");

function displayMenu() {
  // Pastikan semua elemen ada
  if (!menu || !iconBars || !iconClose) {
    console.error("Elemen menu atau ikon hamburger/close tidak ditemukan.");
    return;
  }

  // PERUBAHAN: Kelas 'top-14' diganti menjadi 'top-20' agar pas di bawah navbar h-20
  // Kelas 'text-amber-900' dll. dihapus agar style diambil dari 'menu'
  if (menu.classList.contains("absolute")) {
    menu.classList.add("hidden");
    iconBars.style.display = "inline";
    iconClose.style.display = "none";

    menu.classList.remove("absolute");
    menu.classList.remove("top-20"); // Diubah dari top-14
    menu.classList.remove("w-full");
    menu.classList.remove("left-0");
    menu.classList.remove("bg-white");
    menu.classList.remove("divide-y-2");
    menu.classList.remove("p-4"); // Hapus padding jika ada
    menu.classList.remove("space-y-2"); // Hapus space jika ada
    menu.classList.remove("z-40"); // Hapus z-index jika ada

  } else {
    menu.classList.remove("hidden");
    iconBars.style.display = "none";
    iconClose.style.display = "inline";

    menu.classList.add("absolute");
    menu.classList.add("top-20"); // Diubah dari top-14
    menu.classList.add("w-full");
    menu.classList.add("left-0");
    menu.classList.add("bg-white"); // Sebaiknya 'bg-background'
    menu.classList.add("divide-y-2");
    menu.classList.add("p-4"); // Tambahkan padding
    menu.classList.add("space-y-2"); // Tambahkan spasi
    menu.classList.add("z-40"); // Tambahkan z-index
  }
}

// --- Logika "Hide on Scroll" TELAH DIHAPUS ---
// Navbar sekarang sticky dan selalu terlihat