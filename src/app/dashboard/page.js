// src/app/dashboard/page.js
import AdminRoute from "../../components/AdminRoute";
import Dashboard from "../../components/Dashboard";

export default function DashboardPage() {
  return (
    <AdminRoute>
      <Dashboard />
    </AdminRoute>
  );
}
