"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    googleMeetsUrl: "",
    trelloUrl: "",
    slackChannel: "",
    applicationUrl: "",
    activeStudent: true,
    scheduledClasses: [],
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/students");
      const result = await response.json();

      if (result.success) {
        // Log data for debugging
        console.log("Fetched students:", result.data);
        setStudents(result.data);
      } else {
        setError(result.error || "Failed to fetch students");
        console.error("API error:", result.error);
      }
    } catch (err) {
      setError("An error occurred while fetching students");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (editingStudent) {
      setEditingStudent({
        ...editingStudent,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setNewStudent({
        ...newStudent,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleAddNewClass = () => {
    const newClass = {
      date: new Date().toISOString().split("T")[0] + "T10:00:00",
      topic: "New Lesson",
    };

    if (editingStudent) {
      setEditingStudent({
        ...editingStudent,
        scheduledClasses: [
          ...(editingStudent.scheduledClasses || []),
          newClass,
        ],
      });
    } else {
      setNewStudent({
        ...newStudent,
        scheduledClasses: [...newStudent.scheduledClasses, newClass],
      });
    }
  };

  const handleRemoveClass = (index) => {
    if (editingStudent) {
      const updatedClasses = [...editingStudent.scheduledClasses];
      updatedClasses.splice(index, 1);
      setEditingStudent({
        ...editingStudent,
        scheduledClasses: updatedClasses,
      });
    } else {
      const updatedClasses = [...newStudent.scheduledClasses];
      updatedClasses.splice(index, 1);
      setNewStudent({
        ...newStudent,
        scheduledClasses: updatedClasses,
      });
    }
  };

  const handleUpdateClass = (index, field, value) => {
    if (editingStudent) {
      const updatedClasses = [...editingStudent.scheduledClasses];
      updatedClasses[index] = {
        ...updatedClasses[index],
        [field]: value,
      };
      setEditingStudent({
        ...editingStudent,
        scheduledClasses: updatedClasses,
      });
    } else {
      const updatedClasses = [...newStudent.scheduledClasses];
      updatedClasses[index] = {
        ...updatedClasses[index],
        [field]: value,
      };
      setNewStudent({
        ...newStudent,
        scheduledClasses: updatedClasses,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log("Submitting student data:", newStudent);
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        setNewStudent({
          firstName: "", // Fixed: was "first" in original code
          lastName: "",
          email: "",
          googleMeetsUrl: "",
          trelloUrl: "",
          slackChannel: "",
          applicationUrl: "",
          activeStudent: true,
          scheduledClasses: [],
        });
        setShowAddForm(false);
        fetchStudents(); // Refresh student list
      } else {
        setSubmitError(result.error || "Failed to add student");
      }
    } catch (err) {
      setSubmitError("An error occurred while adding the student");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      console.log("Updating student data:", editingStudent);
      const response = await fetch("/api/students", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingStudent),
      });

      const result = await response.json();
      console.log("API update response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        setEditingStudent(null);
        fetchStudents(); // Refresh student list
      } else {
        setSubmitError(result.error || "Failed to update student");
      }
    } catch (err) {
      setSubmitError("An error occurred while updating the student");
      console.error("Update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id, soft = true) => {
    if (
      !confirm(
        `Are you sure you want to ${
          soft ? "deactivate" : "delete"
        } this student?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/students?id=${id}&softDelete=${soft}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      console.log("Delete response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        fetchStudents(); // Refresh student list
      } else {
        setError(
          result.error || `Failed to ${soft ? "deactivate" : "delete"} student`
        );
      }
    } catch (err) {
      setError(
        `An error occurred while ${
          soft ? "deactivating" : "deleting"
        } the student`
      );
      console.error("Delete error:", err);
    }
  };

  const handleActivateStudent = async (id) => {
    try {
      const response = await fetch("/api/students", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          activeStudent: true,
        }),
      });

      const result = await response.json();
      console.log("Activate response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        fetchStudents(); // Refresh student list
      } else {
        setError(result.error || "Failed to activate student");
      }
    } catch (err) {
      setError("An error occurred while activating the student");
      console.error("Activate error:", err);
    }
  };

  const startEditing = (student) => {
    console.log("Starting to edit student:", student);
    setEditingStudent({
      ...student,
      scheduledClasses: student.scheduledClasses || [],
    });
    setSubmitError(null);
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setSubmitError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-black">
        <h2 className="text-xl font-semibold text-gray-900">
          Student Management
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-2 rounded-md ${
            showAddForm ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"
          }`}
        >
          {showAddForm ? "Cancel" : "Add New Student"}
        </button>
      </div>

      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Student {editingStudent ? "updated" : "added"} successfully!
        </div>
      )}

      {/* Error message */}
      {(error || submitError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error || submitError}
        </div>
      )}

      {/* Add/Edit Student Form */}
      {(showAddForm || editingStudent) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-black">
          <h3 className="text-lg font-semibold mb-4 text-black">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h3>
          <form onSubmit={editingStudent ? handleUpdateSubmit : handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={
                    editingStudent
                      ? editingStudent.firstName
                      : newStudent.firstName
                  }
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={
                    editingStudent
                      ? editingStudent.lastName
                      : newStudent.lastName
                  }
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={
                    editingStudent ? editingStudent.email : newStudent.email
                  }
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="googleMeetsUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Google Meets URL
                </label>
                <input
                  type="url"
                  id="googleMeetsUrl"
                  name="googleMeetsUrl"
                  value={
                    editingStudent
                      ? editingStudent.googleMeetsUrl
                      : newStudent.googleMeetsUrl
                  }
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="trelloUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trello URL
                </label>
                <input
                  type="url"
                  id="trelloUrl"
                  name="trelloUrl"
                  value={
                    editingStudent
                      ? editingStudent.trelloUrl
                      : newStudent.trelloUrl
                  }
                  onChange={handleInputChange}
                  placeholder="https://trello.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="slackChannel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Slack Channel
                </label>
                <input
                  type="text"
                  id="slackChannel"
                  name="slackChannel"
                  value={
                    editingStudent
                      ? editingStudent.slackChannel
                      : newStudent.slackChannel
                  }
                  onChange={handleInputChange}
                  placeholder="#student-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="applicationUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Application URL
                </label>
                <input
                  type="url"
                  id="applicationUrl"
                  name="applicationUrl"
                  value={
                    editingStudent
                      ? editingStudent.applicationUrl
                      : newStudent.applicationUrl
                  }
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activeStudent"
                  name="activeStudent"
                  checked={
                    editingStudent
                      ? editingStudent.activeStudent
                      : newStudent.activeStudent
                  }
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="activeStudent"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active Student
                </label>
              </div>
            </div>

            {/* Scheduled Classes Section */}
            <div className="mt-6 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-medium text-gray-800">
                  Scheduled Classes
                </h4>
                <button
                  type="button"
                  onClick={handleAddNewClass}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
                >
                  Add Class
                </button>
              </div>

              {/* Classes List */}
              <div className="space-y-3 mb-4">
                {(editingStudent
                  ? editingStudent.scheduledClasses
                  : newStudent.scheduledClasses
                ).map((cls, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={cls.date}
                          onChange={(e) =>
                            handleUpdateClass(index, "date", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Topic
                        </label>
                        <input
                          type="text"
                          value={cls.topic}
                          onChange={(e) =>
                            handleUpdateClass(index, "topic", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {(editingStudent
                  ? editingStudent.scheduledClasses?.length
                  : newStudent.scheduledClasses.length) === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No classes scheduled yet
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              {editingStudent && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Saving..."
                  : editingStudent
                  ? "Update Student"
                  : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Students</h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="h-8 w-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No students found. Add your first student using the button above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Enrolled
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Classes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className={
                      !student.activeStudent ? "bg-gray-50" : undefined
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.activeStudent
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.activeStudent ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.dateEnrolled
                        ? new Date(student.dateEnrolled).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.scheduledClasses?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => startEditing(student)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            student.activeStudent
                              ? handleDeleteStudent(student.id, true)
                              : handleActivateStudent(student.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          {student.activeStudent ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
