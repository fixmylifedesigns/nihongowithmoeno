"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  formatDateForStudent,
  formatTimeForStudent,
  formatDateTimeWithTimezone,
} from "@/utils/timezone";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [error, setError] = useState("");
  // Default timezone for US East Coast (change as needed for individual students)
  const [studentTimezone, setStudentTimezone] = useState("America/New_York");

  // Navigation tabs for student dashboard
  const nav = ["Overview", "Classes", "Resources", "Progress"];

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError("");

      try {
        // First check if we have cached data
        const cachedData = localStorage.getItem("studentData");

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setStudentData(parsedData);

          // Set timezone if it exists in student data
          if (parsedData.timezone) {
            setStudentTimezone(parsedData.timezone);
          }

          // If user is logged in, verify/refresh data from Airtable
          if (user?.email) {
            const response = await fetch(
              `/api/students?email=${encodeURIComponent(user.email)}`
            );
            const data = await response.json();

            if (response.ok && data.success && data.data.length > 0) {
              // Update local storage with fresh data
              const freshData = data.data[0];
              localStorage.setItem("studentData", JSON.stringify(freshData));
              setStudentData(freshData);

              // Update timezone if available
              if (freshData.timezone) {
                setStudentTimezone(freshData.timezone);
              }
            } else if (data.data.length === 0) {
              // Handle case where user is not found in Airtable
              setError(
                "Your student account was not found. Please contact support."
              );
            }
          }
        } else if (user?.email) {
          // No cached data, try to fetch directly from Airtable
          const response = await fetch(
            `/api/students?email=${encodeURIComponent(user.email)}`
          );
          const data = await response.json();

          if (response.ok && data.success && data.data.length > 0) {
            // Store student data for future use
            const studentData = data.data[0];
            localStorage.setItem("studentData", JSON.stringify(studentData));
            setStudentData(studentData);

            // Set timezone if available
            if (studentData.timezone) {
              setStudentTimezone(studentData.timezone);
            }
          } else {
            // If no student account found, show error
            setError(
              "Your student account was not found. Please contact support."
            );
          }
        } else {
          // No cached data and no user logged in
          setError("Please log in to view your dashboard");
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("studentData");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="h-8 w-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm border border-gray-100 max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Account Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No student data found
          </h2>
          <p className="text-gray-600 mb-4">
            Please log in again to access your dashboard.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Calculate upcoming classes (only show future classes) adjusted for student's timezone
  const now = new Date();
  const upcomingClasses = studentData.scheduledClasses
    ? (Array.isArray(studentData.scheduledClasses)
        ? studentData.scheduledClasses
        : typeof studentData.scheduledClasses === "string"
        ? JSON.parse(studentData.scheduledClasses)
        : []
      )
        .filter((cls) => new Date(cls.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="overflow-x-auto scrollbar-hide">
              <nav className="flex space-x-4 sm:space-x-8 min-w-max pr-2">
                {nav.map((button) => (
                  <button
                    key={button}
                    onClick={() => setActiveTab(button)}
                    className={`pb-4 px-1 text-sm sm:text-base whitespace-nowrap ${
                      activeTab === button
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {button}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-4">
              <span className="text-gray-600 text-sm sm:text-base hidden sm:inline">
                {studentData.name ||
                  `${studentData.firstName} ${studentData.lastName}`}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          {/* Overview Tab */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome back,{" "}
                  {studentData.firstName ||
                    studentData.name?.split(" ")[0] ||
                    "Student"}
                  !
                </h2>
                <p className="text-gray-600">
                  Track your progress, manage upcoming lessons, and access your
                  learning resources all in one place.
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Note: All class times are shown in your local time zone (
                  {studentTimezone.replace("_", " ")}).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Next Class Card */}
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Next Class
                  </h3>
                  {upcomingClasses.length > 0 ? (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {formatDateForStudent(
                              upcomingClasses[0].date,
                              studentTimezone
                            )}{" "}
                            at{" "}
                            {formatTimeForStudent(
                              upcomingClasses[0].date,
                              studentTimezone
                            )}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            Topic: {upcomingClasses[0].topic}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                          Upcoming
                        </span>
                      </div>
                      <div className="mt-4">
                        <a
                          href={studentData.googleMeetsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Join Google Meet
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No upcoming classes scheduled.
                    </p>
                  )}
                </div>

                {/* Resources Card */}
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Access
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                      href={studentData.trelloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-8.75 16.5h-5a.75.75 0 01-.75-.75v-12a.75.75 0 01.75-.75h5a.75.75 0 01.75.75v12a.75.75 0 01-.75.75zm8 0h-5a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75h5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Trello Board
                        </h4>
                        <p className="text-xs text-gray-500">
                          Manage assignments
                        </p>
                      </div>
                    </a>
                    <a
                      href="https://nihongowithmoeno.slack.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Slack Channel
                        </h4>
                        <p className="text-xs text-gray-500">General channel</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Upcoming Classes List */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Class Schedule
                </h3>
                {upcomingClasses.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingClasses.map((cls, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 border border-gray-100 rounded-lg bg-white hover:bg-gray-50"
                      >
                        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-medium">
                            {new Date(cls.date).getDate()}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {formatDateForStudent(
                                  cls.date,
                                  studentTimezone
                                )}{" "}
                                at{" "}
                                {formatTimeForStudent(
                                  cls.date,
                                  studentTimezone
                                )}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Topic: {cls.topic}
                              </p>
                            </div>
                            {index === 0 && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                                Next
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-600">
                    No upcoming classes scheduled.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === "Classes" && (
            <div className="space-y-6">
              {/* Calendar View Placeholder */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Class Calendar
                </h3>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-600">
                    Class calendar view will be available soon.
                  </p>
                </div>
              </div>

              {/* All Classes */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Scheduled Classes
                </h3>
                <p className="text-sm text-blue-600 mb-4">
                  Times shown are in your local timezone (
                  {studentTimezone.replace("_", " ")})
                </p>
                {upcomingClasses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date & Time
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Topic
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingClasses.map((cls, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {formatDateForStudent(
                                  cls.date,
                                  studentTimezone
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatTimeForStudent(
                                  cls.date,
                                  studentTimezone
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {cls.topic}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <a
                                href={studentData.googleMeetsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Join
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-600">
                    No upcoming classes scheduled.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
