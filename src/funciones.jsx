import { useState } from 'react';

// Hook para alternar la visibilidad de la contraseña
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

// Formatear fecha en formato local (DD/MM/YYYY)
export function formatFecha(dateString) {
  if (!dateString) return "";
  const fecha = new Date(dateString);
  return fecha.toLocaleDateString("es-VE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// Formatear hora en formato local (HH:MM:SS)
export function formatHora(dateString) {
  if (!dateString) return "";
  const fecha = new Date(dateString);
  return fecha.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// Función para capitalizar la primera letra de cada palabra en una cadena
export const toCapitalize = (text) => {
  if (typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
