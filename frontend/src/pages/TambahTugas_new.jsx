import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FiBriefcase,
    FiCalendar,
    FiMapPin,
    FiUsers,
    FiX
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { penugasanAPI } from "../service/api";
import "./TambahTugas.css";

const TambahTugas = ({ show, onClose, dataEdit, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tanggal_awal: new Date(),
    tanggal_akhir: new Date(),
    id_ob: '',
    id_ruangan: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [obList, setObList] = useState([]);
  const [ruanganList, setRuanganList] = useState([]);

  // Load OB and Ruangan data
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

  // Handle edit mode
  useEffect(() => {
    if (dataEdit) {
      setFormData({
        tanggal_awal: new Date(dataEdit.tanggal_awal || new Date()),
        tanggal_akhir: new Date(dataEdit.tanggal_akhir || new Date()),
        id_ob: dataEdit.id_ob || '',
        id_ruangan: dataEdit.id_ruangan || '',
      });
    }
  }, [dataEdit]);

  const handleDateChange = (date, name) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        id_user: user?.id_user || 1,
        id_ob: parseInt(formData.id_ob),
        id_ruangan: parseInt(formData.id_ruangan),
        tanggal_awal: formData.tanggal_awal.toISOString().split('T')[0],
        tanggal_akhir: formData.tanggal_akhir.toISOString().split('T')[0],
      };

      if (dataEdit) {
        // Update existing
        await penugasanAPI.update(dataEdit.id_penugasan, submitData);
      } else {
        // Create new
        await penugasanAPI.create(submitData);
      }

      // Call onSave callback to refresh parent component
      if (onSave) {
        onSave();
      }

      // Reset and close
      setFormData({
        tanggal_awal: new Date(),
        tanggal_akhir: new Date(),
        id_ob: '',
        id_ruangan: '',
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <FiBriefcase /> {dataEdit ? 'Edit Penugasan' : 'Tambah Penugasan'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <div className="form-group-item">
              <label className="label-with-icon"><FiUsers /> Pilih OB</label>
              <select 
                name="id_ob" 
                value={formData.id_ob} 
                onChange={handleChange} 
                className="custom-select"
                required
              >
                <option value="">-- Pilih OB --</option>
                {obList.map((ob) => (
                  <option key={ob.id_ob} value={ob.id_ob}>
                    {ob.nama_ob}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-item">
              <label className="label-with-icon"><FiMapPin /> Pilih Area/Ruangan</label>
              <select 
                name="id_ruangan" 
                value={formData.id_ruangan} 
                onChange={handleChange} 
                className="custom-select"
                required
              >
                <option value="">-- Pilih Area --</option>
                {ruanganList.map((ruangan) => (
                  <option key={ruangan.id_ruangan} value={ruangan.id_ruangan}>
                    {ruangan.nama_ruangan} (Lantai {ruangan.lantai})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-item">
              <label className="label-with-icon"><FiCalendar /> Pilih Periode</label>
              <div className="grid-periode">
                <div className="input-sub-group">
                  <span className="input-hint">Tanggal Mulai</span>
                  <DatePicker
                    selected={formData.tanggal_awal}
                    onChange={(date) => handleDateChange(date, "tanggal_awal")}
                    dateFormat="dd/MM/yyyy"
                    className="custom-input"
                  />
                </div>
                <div className="input-sub-group">
                  <span className="input-hint">Tanggal Selesai</span>
                  <DatePicker
                    selected={formData.tanggal_akhir}
                    onChange={(date) => handleDateChange(date, "tanggal_akhir")}
                    dateFormat="dd/MM/yyyy"
                    className="custom-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahTugas;
