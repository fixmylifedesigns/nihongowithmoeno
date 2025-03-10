"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Admin emails list
const ADMIN_EMAILS = [
  "nihongowithmoeno@gmail.com",
  "ijd.irving@gmail.com",
  "mo4324eno@gmail.com",
];

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        const email = result.user.email;

        // Check if the user's email is in the admin list
        if (ADMIN_EMAILS.includes(email)) {
          router.push("/dashboard");
          return;
        }

        // Check if the email exists in Airtable student data
        try {
          const response = await fetch(
            `/api/students?email=${encodeURIComponent(email)}`
          );
          const data = await response.json();

          if (response.ok && data.success && data.data.length > 0) {
            // Store student data in localStorage for use in the student dashboard
            localStorage.setItem("studentData", JSON.stringify(data.data[0]));
            router.push("/student/dashboard");
          } else {
            // Not authorized - neither admin nor registered student
            await result.user.delete();
            setError(
              "This email is not enrolled with NihongoWithMoeno. If you are a student, please use your registered email or contact us for support."
            );
          }
        } catch (fetchError) {
          console.error("Error fetching student data:", fetchError);
          setError("Unable to verify student status. Please try again later.");
          await result.user.delete();
        }
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center">
        {/* Logo */}
        <Image
          src="/images/nihongowithmoeno.png" // Replace with your actual logo path
          alt="Nihongo with Moeno"
          width={500}
          height={500}
          priority
        />

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Sign in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#fff"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#fff"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#fff"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#fff"
            />
          </svg>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
