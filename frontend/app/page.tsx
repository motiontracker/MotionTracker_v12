"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Home: Usuário autenticado, redirecionando para dashboard");
      router.push("/dashboard");
    } else {
      console.log("Home: Usuário não autenticado, redirecionando para auth");
      router.push("/auth");
    }
  }, [router, isAuthenticated]);

  // Não renderizamos nada aqui, apenas redirecionamos
  return null;
}