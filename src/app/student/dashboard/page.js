// src/app/student/dashboard/page.js
import StudentRoute from "@/components/StudentRoute";
import StudentDashboard from "@/components/StudentDashboard";

export default function StudentDashboardPage() {
  return (
    <StudentRoute>
      <StudentDashboard />
    </StudentRoute>
  );
}