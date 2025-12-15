import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const schema = z.object({
  run: z.string().min(8, "RUN inválido"),
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirm: z.string()
}).refine((v) => v.password === v.confirm, {
  message: "Contraseñas no coinciden",
  path: ["confirm"]
});

type Form = z.infer<typeof schema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<Form>({
      resolver: zodResolver(schema),
    });

  async function onSubmit(data: Form) {
    try {
      await registerUser({
        run: data.run,
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      
      navigate("/");
    } catch (error: any) {
      setError("root", {
        message: error.message || "Error al registrar usuario",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="alert alert-danger">{errors.root.message}</div>
      )}

      <div className="mb-3">
        <label className="form-label">RUN</label>
        <input className="form-control" {...register("run")} />
        {errors.run && <small className="text-danger">{errors.run.message}</small>}
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input className="form-control" {...register("name")} />
        {errors.name && <small className="text-danger">{errors.name.message}</small>}
      </div>

      <div className="mb-3">
        <label className="form-label">Apellido</label>
        <input className="form-control" {...register("lastName")} />
        {errors.lastName && (
          <small className="text-danger">{errors.lastName.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input className="form-control" {...register("email")} />
        {errors.email && <small className="text-danger">{errors.email.message}</small>}
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input type="password" className="form-control" {...register("password")} />
        {errors.password && (
          <small className="text-danger">{errors.password.message}</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Confirmar Contraseña</label>
        <input type="password" className="form-control" {...register("confirm")} />
        {errors.confirm && (
          <small className="text-danger">{errors.confirm.message}</small>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}