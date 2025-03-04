"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //Email Validation Function
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

  //Password Validation Function
  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Signup API Call
  const handleSignup = async () => {
    if (!validateEmail(email) || !validatePassword() || !name) {
      if (!name) toast.error("Name is required");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      toast.success("User registered successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* Background wave effect */}
      <div className="absolute bottom-0 w-full">
        <svg className="w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.2" d="M0 100L48 108.3C96 116.7 192 133.3 288 133.3C384 133.3 480 116.7 576 100C672 83.3 768 66.7 864 75C960 83.3 1056 116.7 1152 125C1248 133.3 1344 116.7 1392 108.3L1440 100V200H0V100Z" fill="#1E5470"/>
          <path opacity="0.4" d="M0 120L48 125C96 130 192 140 288 140C384 140 480 130 576 120C672 110 768 100 864 105C960 110 1056 130 1152 135C1248 140 1344 130 1392 125L1440 120V200H0V120Z" fill="#1E5470"/>
        </svg>
      </div>

      {/* Form Container */}
      <div className="w-[400px] mx-auto px-6 z-10">
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-semibold mb-2">Sign up</h1>
          <p className="text-gray-300 text-sm">Create your movie database account</p>
        </div>

        <div className="space-y-4 p-6 rounded-lg bg-opacity-10">
          {/* Full Name */}
          <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />

          {/* Email Input */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            error={emailError}
          />

          {/* Password Input */}
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {/* Confirm Password Input */}
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={validatePassword}
            error={passwordError}
          />

          {/* Signup Button */}
          <Button onClick={handleSignup} className="w-full bg-[#66D37E] hover:bg-[#50C268] text-white font-medium py-3 rounded-md">
            Sign Up
          </Button>

          {/* Redirect to Login */}
          <div className="text-center mt-4">
            <Link href="/login" className="text-[#66D37E] hover:text-[white] text-sm">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
