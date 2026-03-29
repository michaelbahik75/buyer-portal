"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput, TextInput, Button } from "@mantine/core";
import { apiPost } from "@/utils/http/http";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiPost("auth/register", { name, email, password });

      // show success message then redirect
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-black text-2xl font-bold text-center">Signup</h2>

        <TextInput
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        {success && (
          <p className="text-green-600 text-sm text-center bg-green-50 border border-green-100 rounded-lg py-2 px-3">
            {success}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
          color="green"
        >
          {loading ? "Creating account..." : "Signup"}
        </Button>

        <p className="text-gray-600 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}