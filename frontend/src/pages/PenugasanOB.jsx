import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; 
import TambahTugas from "./TambahTugas";
import poto from "../assets/poto.jpg";
import "./PenugasanOB.css";
import Hapus from "./Delete"; // Import modal hapus
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronDown 
} from "react-icons/fi";

export default function PenugasanOB() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // State untuk modal hapus
  const [selectedTask, setSelectedTask] = useState(null);

  const dataPenugasan = [
    { id: 1, periode: "1 Feb 26 - 7 Feb 26", area: "Lantai 1 - Kantor", tugas: "Sapu Lantai", shift: "Pagi", petugas: "Ahmad Suryadi", status: "Lengkap", deskripsi: "Sapu bersih sampai pojok" },
    { id: 2, periode: "1 Feb 26 - 7 Feb 26", area: "Lantai 1 - Toilet", tugas: "Kuras dan Sikat Toilet", shift: "Siang", petugas: "Ahmad Suryadi", status: "Lengkap", deskripsi: "Wangi karbol" },
    { id: 3, periode: "1 Feb 26 - 7 Feb 26", area: "Lantai 1 - Kantor", tugas: "-", shift: "Siang", petugas: "Ahmad Suryadi", status: "Belum", deskripsi: "" },
  ];

  const handleOpenAdd = () => {
    setSelectedTask(null); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Fungsi untuk membuka modal hapus
  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Cari" />
          </div>
          <div className="user-profile">
            <img src={poto} alt="avatar" className="avatar" />
            <div className="user-info">
              <p className="user-name">Wowo</p>
              <p className="user-role">Pengawas</p>
            </div>
            <FiChevronDown />
          </div>
        </header>

        <section className="content-inner">
          <div className="page-header">
            <div className="header-text">
              <h1>Penugasan OB</h1>
              <p>Lihat penugasan dan assign tugas</p>
            </div>
            <button className="btn-add-penugasan" onClick={handleOpenAdd}>
              <FiPlus /> Tambah Penugasan
            </button>
          </div>

          <div className="table-card">
            <div className="table-card-header">
              <h2>Daftar Penugasan</h2>
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Area</th>
                  <th>Tugas</th>
                  <th>Shift</th>
                  <th>Petugas</th>
                  <th>Input Tugas</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataPenugasan.map((item) => (
                  <tr key={item.id}>
                    <td>{item.periode}</td>
                    <td>{item.area}</td>
                    <td>{item.tugas}</td>
                    <td>{item.shift}</td>
                    <td>{item.petugas}</td>
                    <td>
                      <span className={`badge ${item.status.toLowerCase() === 'lengkap' ? 'lengkap' : 'belum'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="action-btns">
                      <FiEdit2 className="edit-icon" onClick={() => handleOpenEdit(item)} style={{cursor: 'pointer'}} />
                      <FiTrash2 className="delete-icon" onClick={handleOpenDelete} style={{cursor: 'pointer'}} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <TambahTugas 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        dataEdit={selectedTask}
      />
      <Hapus 
        show={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={() => setIsDeleteOpen(false)} 
      />
    </div>
  );
}