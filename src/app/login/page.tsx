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
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateEmail(email) || !password) {
      if (!password) alert("Password is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      router.push("/movie");
    } catch (error) {
      alert("Login failed: " + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* Background wave effect */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
        <svg className="w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.2" d="M0 100L48 108.3C96 116.7 192 133.3 288 133.3C384 133.3 480 116.7 576 100C672 83.3 768 66.7 864 75C960 83.3 1056 116.7 1152 125C1248 133.3 1344 116.7 1392 108.3L1440 100V200H0V100Z" fill="#1E5470"/>
          <path opacity="0.4" d="M0 120L48 125C96 130 192 140 288 140C384 140 480 130 576 120C672 110 768 100 864 105C960 110 1056 130 1152 135C1248 140 1344 130 1392 125L1440 120V200H0V120Z" fill="#1E5470"/>
        </svg>
      </div>

      {/* Form Container */}
      <div className="w-[360px] mx-auto px-2 z-10">
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-2">Sign in</h1>
          <p className="text-gray-300 text-sm">Access your movie database</p>
        </div>

        <div className="space-y-4 p-4 rounded-lg bg-opacity-10">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            onBlur={() => validateEmail(email)}
            error={emailError}
          />

          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-300">Remember me</label>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-[#66D37E] hover:bg-[#50C268] text-white font-medium py-2 sm:py-3 rounded-md transition-colors"
          >
            Login
          </Button>

          <div className="text-center mt-4">
            <Link href="/signup" className="text-[#66D37E] hover:text-[white] text-sm">
              New user? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}