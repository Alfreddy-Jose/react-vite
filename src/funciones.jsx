import { useState } from 'react';

export function useTogglePassword() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    passwordType: showPassword ? 'text' : 'password',
    togglePasswordVisibility
  };
}

export function formatFecha(dateString) {
  if (!dateString) return "";
  const fecha = new Date(dateString);
  return fecha.toLocaleDateString("es-VE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatHora(dateString) {
  if (!dateString) return "";
  const fecha = new Date(dateString);
  return fecha.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
