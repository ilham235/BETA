import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { penugasanAPI } from "../service/api";
import "./Delete.css";

const Delete = ({ show, onClose, onConfirm, selectedTask }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedTask || !selectedTask.id_penugasan) {
      console.error("Error: Task ID tidak ditemukan");
      onClose();
      return;
    }

    try {
      setIsDeleting(true);
      await penugasanAPI.delete(selectedTask.id_penugasan);
      onConfirm();
    } catch (error) {
      console.error("Error deleting penugasan:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-hapus-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hapus-icon-bg">
          <FiAlertTriangle />
        </div>

        <h2 className="modal-hapus-title">Apakah Anda Yakin?</h2>
        <p className="modal-hapus-text">
          Tindakan ini tidak dapat dibatalkan. Semua nilai yang terkait dengan bidang ini akan hilang.
        </p>

        <div className="modal-hapus-actions">
          <button className="btn-hapus-confirm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
          <button className="btn-hapus-batal" onClick={onClose} disabled={isDeleting}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;