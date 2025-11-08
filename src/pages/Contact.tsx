import React from "react";
import ContactForm from "../components/forms/ContactForm";

export default function Contact() {
  return (
    <div className="row">
      <div className="col-md-5">
        <h2>Contáctanos</h2>
        <p>Estamos aquí para ayudarte. Completa el formulario y te responderemos pronto.</p>
        <ContactForm />
      </div>

      <div className="col-md-5">
        <h5>Información</h5>
        <p>📞 +56 9 1234 5678</p>
        <p>✉ info@fashionstyle.com</p>
        <p>📍 Calle Principal 123, Ciudad</p>
        <div className="mt-3 p-3 border rounded">
          <strong>Horario</strong>
          <p>Lun-Vie 9:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
}
