import { useEffect } from "react";
import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLoginSuccess = () => {
    setLocation("/admin");
  };

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      setLocation("/admin");
    }
  }, [setLocation]);

  return <LoginForm onSuccess={handleLoginSuccess} />;
}