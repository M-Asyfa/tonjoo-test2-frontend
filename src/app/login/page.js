'use client';
import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      // 1. Get CSRF cookie
      // await API.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sanctum/csrf-cookie`);

      // 2. Post login credentials
      await API.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, { email, password });

      // 3. Redirect on success
      router.push("/transactions");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Master CRUD App</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
