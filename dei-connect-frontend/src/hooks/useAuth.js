import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Convenience hook so components never import AuthContext directly.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
