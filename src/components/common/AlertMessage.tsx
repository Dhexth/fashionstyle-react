import React from "react";
import classNames from "classnames";

interface AlertMessageProps {
  type?: "success" | "danger" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export default function AlertMessage({ type = "info", message, onClose }: AlertMessageProps) {
  return (
    <div
      className={classNames("alert", `alert-${type}`, "d-flex justify-content-between align-items-center")}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose}></button>
      )}
    </div>
  );
}
