"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput, TextInput, Button } from "@mantine/core";
import useAuth from "@/utils/contexts/UserContext";
import { apiPost } from "@/utils/http/http";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await apiPost("auth/login", {
        email,
        password,
      });

      const userData = res.data.data;

      // clear old login data
      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      // store new login session
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      // update global user state
      setUser(userData);
  
      router.push("/dashboard");
      
    } 
    catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-black text-2xl font-bold text-center">Login</h2>

        <TextInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

       {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-lg py-2 px-3">
            {error}
          </p>
        )}
 
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Signing in..." : "Login"}
        </Button>

        <p className="text-gray-600 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
