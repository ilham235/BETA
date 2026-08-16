# Fix: Filter Area tidak Menampilkan Data

## 📋 Masalah yang Ditemukan

### 1. ❌ Backend: Field name salah di API area
**File:** `backend/src/models/areaModel.js`

Field `lantai` di-return dengan nama `deskripsi`:
```javascript
// ❌ SALAH
SELECT id_ruangan as id_area, nama_ruangan as nama, lantai as deskripsi
```

Frontend mengharapkan field `lantai`, bukan `deskripsi`.

### 2. ❌ Frontend: Filter area hanya dari laporan, bukan dari database
**File:** `frontend/src/pages/Laporan.jsx`

`allAreas` hanya diisi dari data laporan yang sudah ada:
```javascript
// ❌ SEKARANG - hanya area dengan laporan yang muncul
const uniqueAreas = [...new Set(transformedData.map(item => item.area))];
setAllAreas(uniqueAreas);
```

**Akibat:** Jika tidak ada laporan untuk suatu area, area tersebut tidak muncul di dropdown.

---

## ✅ Solusi yang Diterapkan

### 1. ✅ Backend: Return field yang benar
**File:** `backend/src/models/areaModel.js`

```javascript
// ✅ BENAR
SELECT id_ruangan as id_area, nama_ruangan, lantai, status FROM ruangan
```

Updated functions:
- `findAllArea()` - return field lantai yang benar
- `findAreaById()` - return field lantai yang benar  
- `createArea()` - return field lantai yang benar
- `updateArea()` - return field lantai yang benar

### 2. ✅ Frontend: Fetch area dari API saat mount
**File:** `frontend/src/pages/Laporan.jsx`

```javascript
// ✅ BARU - Fetch area dari database saat component mount
useEffect(() => {
  const fetchAreas = async () => {
    try {
      const response = await areaAPI.getAll();
      if (response.data.success && response.data.data) {
        const areaList = response.data.data.map(area => {
          const lantai = area.lantai || "1";
          return `${area.nama_ruangan || area.nama} - Lantai ${lantai}`;
        });
        setAllAreas(areaList);
      }
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };
  fetchAreas();
}, []);
```

### 3. ✅ Frontend: Gabungkan area dari API + area dari laporan
```javascript
// ✅ SEKARANG - Gabungkan area dari API dengan area dari laporan
const uniqueLaporanAreas = [...new Set(transformedData.map(item => item.area))];
const combinedAreas = [...new Set([...allAreas, ...uniqueLaporanAreas])].sort();
setAllAreas(combinedAreas);
```

**Benefit:**
- Semua area dari KelolaArea muncul di dropdown
- Area baru yang ditambahkan ke laporan juga akan muncul
- Sorted alphabetically untuk UX yang lebih baik

---

## 🔄 Flow yang Sudah Diperbaiki

```
KelolaArea.jsx (setup area)
    ↓
Database (ruangan table)
    ↓
Backend API: GET /api/area
    ↓
Laporan.jsx: useEffect dengan areaAPI.getAll()
    ↓
allAreas state terisi dengan semua area dari database
    ↓
Dropdown filter area menampilkan SEMUA area
    ↓
User dapat filter laporan berdasarkan area
```

---

## 📝 Files yang Diubah

1. ✏️ `backend/src/models/areaModel.js`
   - Fixed SELECT query untuk return field `lantai` (bukan `deskripsi`)
   - 4 functions updated: `findAllArea`, `findAreaById`, `createArea`, `updateArea`

2. ✏️ `frontend/src/pages/Laporan.jsx`
   - Import `areaAPI` dari service/api
   - Tambah useEffect untuk fetch area dari API saat mount
   - Update logic untuk gabungkan area dari API + laporan data

---

## 🧪 Cara Test

1. **Pastikan ada area di KelolaArea** (minimal 1-2 area tanpa laporan)
2. **Buka halaman Laporan**
3. **Lihat dropdown "Filter Area"**
4. **Expected:** Semua area dari KelolaArea muncul, termasuk yang tidak ada laporannya

---

## 🚀 Deployment

1. Update backend code
2. Restart backend server: `npm run dev`
3. Frontend sudah auto-update via hot reload
4. Clear browser cache jika perlu: Ctrl+Shift+Delete

---

## 📌 Catatan

- API field mapping sekarang konsisten antara backend dan frontend
- Tidak ada breaking changes untuk endpoint lain
- Backward compatible dengan existing laporan data
