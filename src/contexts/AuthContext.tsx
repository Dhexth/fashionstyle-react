import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import * as authService from "../services/authService";

// Tipo User basado en lo que devuelve tu backend
type User = { 
  id: string; 
  email: string;
  name: string;
  lastName: string;
  role: string;
  run?: string;
  isAuthenticated: boolean;
} | null;

export type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  registerUser: (userData: any) => Promise<void>;
  isAdmin: () => boolean;
  updateUserProfile: (userData: any) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser({
            ...currentUser,
            isAuthenticated: true
          });
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login - CORREGIDO
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // authService.login() recibe email y password directamente, NO un objeto
      const response = await authService.login(email, password);
      const userData = response.user; // { user, token }
      
      const userSession: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        role: userData.role,
        run: userData.run || "",
        isAuthenticated: true
      };

      setUser(userSession);
    } catch (error: any) {
      throw new Error(error.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  // Registro - CORREGIDO
  const registerUser = async (userData: any) => {
    setLoading(true);
    try {
      // authService.register() recibe un objeto con los datos del usuario
      const response = await authService.register(userData);
      const userDataResponse = response.user;
      
      const userSession: User = {
        id: userDataResponse.id,
        email: userDataResponse.email,
        name: userDataResponse.name,
        lastName: userDataResponse.lastName,
        role: userDataResponse.role,
        run: userDataResponse.run || "",
        isAuthenticated: true
      };

      setUser(userSession);
    } catch (error: any) {
      throw new Error(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = () => {
    authService.logout();
    setUser(null);
  };

  // Verificar si es admin
  const isAdmin = () => {
    return user?.role === "ADMIN";
  };

  // Actualizar perfil - OPCIONAL (si no tienes este endpoint, elimínalo)
  const updateUserProfile = async (userData: any) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      const userSession: User = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        run: updatedUser.run || "",
        isAuthenticated: true
      };
      setUser(userSession);
    } catch (error: any) {
      throw new Error(error.message || "Error al actualizar perfil");
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    registerUser,
    isAdmin,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};