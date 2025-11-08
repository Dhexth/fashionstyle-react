import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  message: z.string().min(5, "Mensaje muy corto")
});
type Form = z.infer<typeof schema>;

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Form) => {
    alert("Mensaje enviado (simulado). Gracias, " + data.name);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input className="form-control" {...register("name")} />
        {errors.name && <small className="text-danger">{errors.name.message}</small>}
      </div>
      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input className="form-control" {...register("email")} />
        {errors.email && <small className="text-danger">{errors.email.message}</small>}
      </div>
      <div className="mb-3">
        <label className="form-label">Mensaje</label>
        <textarea className="form-control" rows={5} {...register("message")}></textarea>
        {errors.message && <small className="text-danger">{errors.message.message}</small>}
      </div>
      <button className="btn btn-primary">Enviar</button>
    </form>
  );
}
