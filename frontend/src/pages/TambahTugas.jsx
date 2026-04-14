import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiBriefcase,
  FiCalendar,
  FiClock, FiFileText,
  FiMapPin,
  FiUserPlus,
  FiUsers,
  FiX
} from "react-icons/fi";
import { penugasanAPI } from "../service/api";
import "./TambahTugas.css";

const TambahTugas = ({ show, onClose, dataEdit }) => {
  const [formData, setFormData] = useState({
    tanggalMulai: new Date(),
    tanggalSelesai: new Date(),
    petugas: "Udin Mujadi",
    area: "Lantai 1 - Toilet",
    tugas: "Pel Lantai",
    shift: "Pagi",
    deskripsi: ""
  });
  const [obList, setObList] = useState([]);
  const [ruanganList, setRuanganList] = useState([]);

  // Load OB and Ruangan data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        const obResponse = await penugasanAPI.getOB();
        setObList(obResponse.data.data || []);
        
        const ruanganResponse = await penugasanAPI.getRuangan();
        setRuanganList(ruanganResponse.data.data || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // Logika Frontend: Pantau jika ada dataEdit yang masuk
  useEffect(() => {
    if (dataEdit) {
      setFormData({
        tanggalMulai: new Date(), // Dummy date
        tanggalSelesai: new Date(),
        petugas: dataEdit.petugas,
        area: dataEdit.area,
        tugas: dataEdit.tugas === "-" ? "Pel Lantai" : dataEdit.tugas,
        shift: dataEdit.shift,
        deskripsi: dataEdit.deskripsi || ""
      });
    } else {
      // Reset form jika klik "Tambah Penugasan"
      setFormData({
        tanggalMulai: new Date(),
        tanggalSelesai: new Date(),
        petugas: "Udin Mujadi",
        area: "Lantai 1 - Toilet",
        tugas: "Pel Lantai",
        shift: "Pagi",
        deskripsi: ""
      });
    }
  }, [dataEdit, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-section">
          <div className="icon-main-bg"><FiUserPlus /></div>
          <h2 className="modal-title">{dataEdit ? "Edit Penugasan" : "Input Penugasan"}</h2>
        </div>

        <form className="modal-form-body" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          
          <div className="form-group-item">
            <label className="label-with-icon"><FiCalendar /> Pilih Periode</label>
            <div className="grid-periode">
              <div className="input-sub-group">
                <span className="input-hint">Tanggal Mulai</span>
                <DatePicker
                  selected={formData.tanggalMulai}
                  onChange={(date) => handleDateChange(date, "tanggalMulai")}
                  dateFormat="dd/MM/yyyy"
                  className="custom-input"
                />
              </div>
              <div className="input-sub-group">
                <span className="input-hint">Tanggal Selesai</span>
                <DatePicker
                  selected={formData.tanggalSelesai}
                  onChange={(date) => handleDateChange(date, "tanggalSelesai")}
                  dateFormat="dd/MM/yyyy"
                  className="custom-input"
                />
              </div>
            </div>
          </div>

          <div className="form-group-item">
            <label className="label-with-icon"><FiUsers /> Pilih Petugas/OB</label>
            <select name="petugas" value={formData.petugas} onChange={handleChange} className="custom-select">
              <option value="">-- Pilih Petugas --</option>
              {obList.map((ob) => (
                <option key={ob.id_ob} value={ob.nama_ob}>
                  {ob.nama_ob}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-item">
            <label className="label-with-icon"><FiMapPin /> Pilih Area</label>
            <select name="area" value={formData.area} onChange={handleChange} className="custom-select">
              <option value="">-- Pilih Area --</option>
              {ruanganList.map((ruangan) => (
                <option key={ruangan.id_ruangan} value={`${ruangan.nama_ruangan} - Lantai ${ruangan.lantai}`}>
                  {ruangan.nama_ruangan} (Lantai {ruangan.lantai})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-item">
            <label className="label-with-icon"><FiBriefcase /> Pilih Tugas</label>
            <select name="tugas" value={formData.tugas} onChange={handleChange} className="custom-select">
              <option value="">-- Pilih Tugas --</option>
              {ruanganList.map((ruangan) => (
                <option key={ruangan.id_ruangan} value={ruangan.detail_pekerjaan || ''}>
                  {ruangan.detail_pekerjaan || 'Tanpa tugas'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-item">
            <label className="label-with-icon"><FiClock /> Pilih Shift</label>
            <select name="shift" value={formData.shift} onChange={handleChange} className="custom-select">
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Sore">Sore</option>
            </select>
          </div>

          <div className="form-group-item">
            <label className="label-with-icon"><FiFileText /> Deskripsi</label>
            <textarea 
              name="deskripsi" 
              value={formData.deskripsi} 
              onChange={handleChange} 
              className="custom-textarea" 
              placeholder="Tuliskan detail pekerjaan..."
            ></textarea>
          </div>

          <div className="modal-footer-btns">
            <button type="button" className="btn-modal-batal" onClick={onClose}><FiX /> Batal</button>
            <button type="submit" className="btn-modal-simpan">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahTugas;