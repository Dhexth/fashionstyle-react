import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../contexts/UserContext"; // ← Importar el contexto

const schema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirm: z.string()
}).refine((v) => v.password === v.confirm, { 
  message: "Contraseñas no coinciden", 
  path: ["confirm"] 
});

type Form = z.infer<typeof schema>;

export default function RegisterForm(){
  const { registerUser } = useUser(); // ← Usar el contexto
  const { register, handleSubmit, formState: { errors }, setError } = useForm<Form>({ 
    resolver: zodResolver(schema) 
  });

  async function onSubmit(data: Form) {
    try {
      // ← LLAMAR A LA FUNCIÓN REAL DE REGISTRO
      await registerUser(data.name, data.email, data.password);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } catch (error) {
      // Manejar errores
      setError("root", { 
        message: error instanceof Error ? error.message : "Error en el registro" 
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Mostrar errores generales */}
      {errors.root && (
        <div className="alert alert-danger">{errors.root.message}</div>
      )}
      
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
        <label className="form-label">Contraseña</label>
        <input type="password" className="form-control" {...register("password")} />
        {errors.password && <small className="text-danger">{errors.password.message}</small>}
      </div>
      <div className="mb-3">
        <label className="form-label">Confirmar Contraseña</label>
        <input type="password" className="form-control" {...register("confirm")} />
        {errors.confirm && <small className="text-danger">{errors.confirm.message}</small>}
      </div>
      <button type="submit" className="btn btn-primary">Registrarse</button>
    </form>
  );
}