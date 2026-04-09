import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import "./Delete.css";

const Delete = ({ show, onClose, onConfirm }) => {
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
          <button className="btn-hapus-confirm" onClick={onConfirm}>
            Hapus
          </button>
          <button className="btn-hapus-batal" onClick={onClose}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;