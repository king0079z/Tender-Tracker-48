import { useState } from 'react';

export function useAuth() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const handleShowLogin = () => setShowAdminLogin(true);
  const handleHideLogin = () => setShowAdminLogin(false);

  return {
    isAdmin,
    showAdminLogin,
    handleLogin,
    handleShowLogin,
    handleHideLogin
  };
}