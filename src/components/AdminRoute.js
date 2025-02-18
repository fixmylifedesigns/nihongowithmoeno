// src/components/AdminRoute.js
"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdmin } from "../utils/adminUtils";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !isAdmin(user.email)) {
      router.push("/");
    }
  }, [router, user]);

  return user && isAdmin(user.email) ? children : null;
}
