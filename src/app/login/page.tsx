"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store token
      alert("User logged in successfully!");
      router.push("/movies"); // Redirect to movies after login
    } catch (error) {
        const err = error as Error;  // ✅ Type assertion
        alert("Signup failed: " + err.message);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Movies app</h1>
      {/* <div className="w-80 space-y-4"></div> */}
      <h2 className="text-3xl font-bold mb-4">Sign In</h2>
      <div className="w-80 space-y-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin}>Login</Button>

        {/* Sign Up Link */}
        <p className="text-white">
          New user? <Link href="/signup" className="text-green-400">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
