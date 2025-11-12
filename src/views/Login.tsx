"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/axios";
import { IconEye, IconEyeOff, IconLock, IconMail } from "@tabler/icons-react";

import bgLogin from "@/assets/images/bg-login.png";
import Image from "next/image";

// --------------- Schema Zod ---------------
const loginSchema = z.object({
  email: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("Email inválido"),
  password: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

// --------------- Componente ---------------
export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      const { data } = await api.post("/auth/login", values);

      // Guardado del token — si querés mejor usar cookie httpOnly desde el backend
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }

      router.push("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Error al iniciar sesión";
      setError("email" as any, { type: "manual", message }); // ejemplo simple
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="w-full h-screen bg-white flex justify-between items-center">
      <section className="bg-primary relative text-white py-12 text-start h-full px-20 w-[60%] flex justify-center items-center overflow-hidden max-lg:hidden">
        <div className="size-60 border-[10px] border-white opacity-50 absolute -top-20 -right-20 rounded-full"></div>

        <div className="size-60 border-[10px] border-white opacity-50 absolute -bottom-40 -left-0 rounded-full"></div>

        <div className="mb-40 -ml-30">
          <h2 className="text-4xl font-medium mb-4">Gestión de Inventario</h2>
          <p className="text-xl font-extralight opacity-90 max-w-[500px] mb-4">
            Controla, organiza y optimiza tus productos en tiempo real desde un
            solo lugar.
          </p>

          <p className="text-lg">- Aguamarina</p>
        </div>

        <Image
          width={1920}
          height={1080}
          src={bgLogin}
          alt="bgLogin"
          className="aspect-video object-cover absolute -bottom-[30%] -right-[30%] shadow-2xl"
        />
      </section>

      <section className="flex-1 2xl:px-40 xl:px-20 px-5">
        <h1 className="xl:text-4xl text-2xl font-medium mb-10">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div>
            <label className="block text-base font-semibold mb-1">Correo</label>
            <div className="relative">
              <IconMail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-6"
                strokeWidth={1.5}
              />
              <input
                {...register("email")}
                type="email"
                placeholder="correo@ejemplo.com"
                className={`w-full border-1 px-14 py-4 font-medium rounded-2xl focus:shadow-2xl transition-all duration-500  ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold mb-1">
              Contraseña
            </label>
            <div className="relative">
              {/* Icono de candado */}
              <IconLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-6"
                strokeWidth={1.5}
              />

              {/* Input */}
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••••"
                className={`w-full border px-14 py-4 font-medium rounded-2xl focus:shadow-2xl transition-all duration-500  ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } focus:outline-none focus:ring-2 `}
              />

              {/* Botón para mostrar/ocultar */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <IconEyeOff size={22} strokeWidth={1.5} />
                ) : (
                  <IconEye size={22} strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Error */}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Mensaje global de error (si seteás así en el catch) */}
          {errors.email?.type === "manual" &&
            typeof errors.email.message === "string" && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-4 rounded-2xl disabled:opacity-60 cursor-pointer hover:scale-105 transition-all duration-300 active:scale-100"
          >
            {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </main>
  );
}
