import { useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import AuthContext from "./authContext";


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    let active = true;

    authService.getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status !== 401) {
          setSessionError("No pudimos comprobar tu sesión. Intentá nuevamente.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    sessionError,
    async login(credentials) {
      const currentUser = await authService.login(credentials);
      setUser(currentUser);
      setSessionError("");
      return currentUser;
    },
    async adminLogin(credentials) {
      const currentUser = await authService.adminLogin(credentials);
      setUser(currentUser);
      setSessionError("");
      return currentUser;
    },
    register: authService.register,
    updateCurrentUser(updatedUser) {
      setUser(updatedUser);
    },
    async logout() {
      try {
        await authService.logout();
        setUser(null);
      } catch (error) {
        if (error.status === 401) setUser(null);
        throw error;
      }
    },
  }), [isLoading, sessionError, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
