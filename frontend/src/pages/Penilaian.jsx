import React, { useState } from 'react';
import './Penilaian.css';
import IconPenilaian from "../assets/Icon.png"; // Pastikan path file benar
import { FiClock, FiMapPin, FiClipboard, FiUser, FiCamera } from "react-icons/fi";

const Penilaian = ({ data, onClose }) => {
  // State untuk kontrol kondisional
  const [statusKehadiran, setStatusKehadiran] = useState("hadir");
  const [selectedNilai, setSelectedNilai] = useState("");

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  });

  return (
    <div className="modal-overlay-new" onClick={onClose}>
      <div className="modal-container-penilaian" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-penilaian">
          <div className="header-icon-box">
            {/* Menggunakan Icon.png sesuai permintaan */}
            <img src={IconPenilaian} alt="icon" className="header-custom-icon" />
          </div>
          <h2>Penilaian</h2>
        </div>

        <form className="modal-form-penilaian">
          <div className="form-group-p">
            <label><FiClock className="icon-p" /> Hari, Tanggal <span className="req">*</span></label>
            <input type="text" value={today} readOnly className="input-p-disabled" />
          </div>

          <div className="form-group-p">
            <label><FiMapPin className="icon-p" /> Area <span className="req">*</span></label>
            <input type="text" value={data.area} readOnly className="input-p-disabled" />
          </div>

          <div className="form-group-p">
            <label><FiClipboard className="icon-p" /> Tugas <span className="req">*</span></label>
            <input type="text" value={data.tugas} readOnly className="input-p-disabled" />
          </div>

          <div className="form-group-p">
            <label><FiClock className="icon-p" /> Shift <span className="req">*</span></label>
            <input type="text" value={data.shift} readOnly className="input-p-disabled" />
          </div>

          {/* Kondisional Status Kehadiran */}
          <div className="form-group-p">
            <label><FiClock className="icon-p" /> Status Kehadiran <span className="req">*</span></label>
            <select 
              className="form-select-p" 
              value={statusKehadiran}
              onChange={(e) => setStatusKehadiran(e.target.value)}
            >
              <option value="hadir">Hadir</option>
              <option value="tidak-hadir">Tidak Hadir</option>
            </select>
          </div>

          <div className="form-group-p">
            <label><FiUser className="icon-p" /> {statusKehadiran === "hadir" ? "Petugas/OB" : "Pengganti"} <span className="req">*</span></label>
            {statusKehadiran === "hadir" ? (
              <select className="form-select-p">
                <option value="petugas">{data.petugas}</option>
              </select>
            ) : (
              <input type="text" className="input-p-text" placeholder="Masukkan nama pengganti..." />
            )}
          </div>

          <div className="form-group-p">
            <label><FiCamera className="icon-p" /> Nilai <span className="req">*</span></label>
            <div className="radio-group-p">
              <label className="radio-item-p">
                <input 
                  type="radio" 
                  name="nilai" 
                  value="green" 
                  onChange={(e) => setSelectedNilai(e.target.value)}
                />
                <span className="color-box-p green-p"></span>
              </label>
              <label className="radio-item-p">
                <input 
                  type="radio" 
                  name="nilai" 
                  value="yellow" 
                  onChange={(e) => setSelectedNilai(e.target.value)}
                />
                <span className="color-box-p yellow-p"></span>
              </label>
              <label className="radio-item-p">
                <input 
                  type="radio" 
                  name="nilai" 
                  value="red" 
                  onChange={(e) => setSelectedNilai(e.target.value)}
                />
                <span className="color-box-p red-p"></span>
              </label>
            </div>
          </div>

          {/* Kondisional Upload Foto: Muncul jika nilai BUKAN hijau */}
          {selectedNilai !== "" && selectedNilai !== "green" && (
            <div className="form-group-p fade-in">
              <label><FiCamera className="icon-p" /> Upload Foto <span className="req">*</span></label>
              <div className="upload-placeholder">
                <input type="file" id="upload-poto" hidden />
                <label htmlFor="upload-poto" style={{ cursor: 'pointer' }}>Klik untuk tambah foto...</label>
              </div>
            </div>
          )}

          <div className="modal-footer-p">
            <button type="button" className="btn-p-batal" onClick={onClose}>
              ✕ Batal
            </button>
            <button type="button" className="btn-p-simpan" onClick={onClose}>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Penilaian;