import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthUser = {
  name: string;
  email: string;
  area?: string;
  pincode?: string;
  addressVerified?: boolean;
  aadhaarLast4?: string;
  aadhaarVerified?: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, area?: string, pincode?: string) => Promise<void>;
  verifyAddress: () => void;
  verifyAadhaar: (last4: string, otp: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "civicforum_user";
const API_URL = "http://localhost:5000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { localStorage.removeItem(STORAGE_KEY); }
    }
  }, []);

  const persistUser = (value: AuthUser | null) => {
    setUser(value);
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("civicforum_token", data.token);
    localStorage.setItem("civicforum_userid", data.user.id.toString());
    persistUser({
      name: data.user.name,
      email: data.user.email,
      pincode: data.user.pincode || "",
      addressVerified: false,
      aadhaarVerified: false,
    });
  };

  const signup = async (name: string, email: string, password: string, area?: string, pincode?: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, pincode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    await login(email, password);
    if (pincode) {
      const userId = localStorage.getItem("civicforum_userid");
      await fetch(`${API_URL}/citizen/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        user_id: parseInt(localStorage.getItem("civicforum_userid") || "1"),
          full_name: name,
          pincode: pincode,
          address: area || "",
          phone: "",
          aadhar_number: null,
        }),
      });
    }
  };

  const verifyAddress = () => {
    if (!user) return;
    persistUser({ ...user, addressVerified: true });
  };

  const verifyAadhaar = async (last4: string, otp: string) => {
    if (!user) return;
    if (otp !== "123456" || last4.length !== 4) throw new Error("Invalid Aadhaar verification data");
    persistUser({ ...user, aadhaarLast4: last4, aadhaarVerified: true });
  };

  const logout = () => {
    localStorage.removeItem("civicforum_token");
    localStorage.removeItem("civicforum_userid");
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyAddress, verifyAadhaar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}