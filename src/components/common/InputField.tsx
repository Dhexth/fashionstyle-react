import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        {...props}
        className={`form-control ${error ? "is-invalid" : ""}`}
        autoComplete="off"
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
