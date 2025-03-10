// src/components/StudentRoute.js
"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      // If no user is logged in, redirect to login
      if (!user) {
        router.push("/");
        return;
      }

      // Check if student data exists in localStorage
      const studentData = localStorage.getItem("studentData");

      if (studentData) {
        // Parse the student data
        const parsedData = JSON.parse(studentData);

        // Make sure the logged-in user email matches the student data email
        if (parsedData.email === user.email) {
          setIsAuthorized(true);
        } else {
          // If emails don't match, clear the stored data and redirect
          localStorage.removeItem("studentData");
          router.push("/");
        }
      } else {
        // No student data found, redirect to login
        router.push("/");
      }

      setLoading(false);
    };

    checkAuthorization();
  }, [router, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}
