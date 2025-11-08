import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../contexts/UserContext";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Min 6 caracteres")
});
type Form = z.infer<typeof schema>;

export default function LoginForm(){
  const { loginUser } = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Form){
    try {
      await loginUser(data.email, data.password);
      alert("Inicio de sesión exitoso");
    } catch (error) {
      // MANEJO DE ERROR CORREGIDO:
      if (error instanceof Error) {
        alert("Error: " + error.message);
      } else {
        alert("Error desconocido en el inicio de sesión");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <button className="btn btn-primary">Entrar</button>
    </form>
  );
}