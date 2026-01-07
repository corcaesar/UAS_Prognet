# Cara Mengakses Localhost Secara Online

Untuk membuat website yang ada di localhost kamu bisa diakses orang lain, ada dua cara utama:

## Cara 1: Menggunakan Tunneling (Paling Mudah & Cepat)
Ini cocok jika kamu hanya ingin menunjukkan website ke teman atau dosen **sementara waktu** saat laptop kamu menyala.

Kami merekomendasikan **ngrok**.

### Langkah-langkah:
1.  **Download ngrok**: Buka [ngrok.com](https://ngrok.com/download) dan download versi Windows.
2.  **Daftar Akun**: Buat akun gratis di website ngrok untuk mendapatkan "Authtoken".
3.  **Setup**:
    *   Extract file zip ngrok yang sudah didownload.
    *   Buka terminal (Command Prompt atau PowerShell) di folder tempat ngrok berada.
    *   Jalankan perintah connect akun (ganti `TOKEN_KAMU` dengan token dari dashboard ngrok):
        ```bash
        ngrok config add-authtoken TOKEN_KAMU
        ```
4.  **Jalankan**:
    *   Pastikan server website kamu sudah jalan (misalnya `node server.js` di port 3000).
    *   Di terminal ngrok, ketik:
        ```bash
        ngrok http 3000
        ```
    *   ngrok akan memberikan link (misalnya `https://a1b2-c3d4.ngrok-free.app`).
    *   **Kirim link tersebut ke temanmu**. Mereka bisa mengakses websitemu selama terminal ngrok tidak ditutup.

> **Catatan**: Karena kamu menggunakan database SQLite dan upload gambar lokal, cara ini paling aman karena semua data tetap ada di laptopmu.

---

## Cara 2: Hosting (Permanen)
Ini jika kamu ingin website terus aktif 24/7 walaupun laptop mati. Namun, untuk project Node.js dengan SQLite dan upload gambar, ini **lebih rumit**.

### Kenapa rumit?
Project kamu menggunakan:
1.  **SQLite**: Database berbentuk file.
2.  **Upload Gambar Lokal**: Gambar disimpan di folder project.

Layanan hosting gratis (seperti Render atau Vercel) biasanya memiliki sistem file yang **"Ephemeral"** (Sementara). Artinya, setiap kali server restart (yang sering terjadi di versi gratis), **semua data database dan gambar yang diupload akan HILANG**.

### Solusi Hosting (Jika benar-benar perlu):
Kamu harus menggunakan layanan yang mendukung "Persistent Storage" (Penyimpanan Tetap) atau mengubah kodingan untuk:
*   Menggunakan database cloud (seperti PostgreSQL di Supabase atau Railway).
*   Menyimpan gambar di cloud storage (seperti Cloudinary).

**Rekomendasi**: Untuk tugas kuliah, **Cara 1 (ngrok)** biasanya sudah cukup dan jauh lebih mudah.

## Cara Menyalakan Ulang (Restart)
Jika kamu mematikan laptop atau menutup terminal, ikuti langkah ini untuk menyalakannya lagi:

1.  **Nyalakan Server Website**:
    *   Buka terminal di folder project kamu.
    *   Ketik: `node server.js`
    *   Pastikan muncul tulisan "Server running on port 3000".

2.  **Nyalakan ngrok**:
    *   Buka terminal **baru** (jangan tutup terminal server).
    *   Ketik: `ngrok http 3000`
    *   Copy link baru yang muncul (Link akan selalu berubah setiap kali restart, kecuali kamu bayar versi Pro).
