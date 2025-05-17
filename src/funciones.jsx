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