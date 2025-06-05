// src/components/StudentManagementTab.js
"use client";

import { useState } from "react";
import StudentManagement from "./StudentManagement";
import WaitlistManagement from "./WaitlistManagement";

export default function StudentManagementTab() {
  const [activeSection, setActiveSection] = useState("manage");

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveSection("manage")}
          className={`pb-3 px-4 ${
            activeSection === "manage"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Manage Students
        </button>
        <button
          onClick={() => setActiveSection("waitlist")}
          className={`pb-3 px-4 ${
            activeSection === "waitlist"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Waitlist Applications
        </button>
        <button
          onClick={() => setActiveSection("settings")}
          className={`pb-3 px-4 ${
            activeSection === "settings"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Settings
        </button>
      </div>

      {activeSection === "manage" && <StudentManagement />}
      {activeSection === "waitlist" && <WaitlistManagement />}

      {activeSection === "settings" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Student Settings
          </h3>
          <p className="text-gray-600">
            Configure student-related settings here. This section can be
            expanded with additional configuration options in the future.
          </p>

          {/* Placeholder for future settings */}
          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="border border-gray-200 rounded-md p-4">
              <h4 className="font-medium text-black">
                Default Student Settings
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                These settings will be applied to new students by default.
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="auto-activate"
                    name="auto-activate"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label
                    htmlFor="auto-activate"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Automatically activate new students
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="send-welcome"
                    name="send-welcome"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label
                    htmlFor="send-welcome"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Send welcome email to new students
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
