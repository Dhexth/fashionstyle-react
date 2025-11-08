import React from "react";

interface ModalProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ show, title, onClose, children }: ModalProps) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0, 0, 0, 0.6)", zIndex: 2000 }}
    >
      <div className="bg-white p-4 rounded shadow-lg" style={{ minWidth: "350px", maxWidth: "500px" }}>
        {title && <h5 className="mb-3">{title}</h5>}
        <div>{children}</div>
        <div className="text-end mt-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
