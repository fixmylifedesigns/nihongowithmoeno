"use client";

import { useState, useEffect } from "react";
import {
  EmailJSClient,
  getTemplateList,
  validateTemplateParams,
} from "../../utils/emailjs-client";

export default function WaitlistManagement() {
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEntry, setNewEntry] = useState({
    "Email Address": "",
    "First Name": "",
    "Last Name": "",
    "Phone Number": "",
    Address: "",
    Company: "",
    Status: "Not Contacted",
    NOTES: "",
    TAGS: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState("waitlist_contact");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [emailClient, setEmailClient] = useState(null);

  const statusOptions = [
    "Not Contacted",
    "Contacted",
    "Active Student",
    "Inactive Student",
    "Not Interested",
  ];

  // Fetch waitlist entries on component mount
  useEffect(() => {
    fetchWaitlistEntries();
    initializeEmailClient();
  }, []);

  const initializeEmailClient = async () => {
    try {
      const client = new EmailJSClient();
      await client.initialize();
      setEmailClient(client);
      setEmailTemplates(getTemplateList());
    } catch (error) {
      console.error("Failed to initialize EmailJS:", error);
      setError("Failed to initialize email service");
    }
  };

  // Reset success message after 3 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const fetchWaitlistEntries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/waitlist");
      const result = await response.json();

      if (result.success) {
        console.log("Fetched waitlist entries:", result.data);
        setWaitlistEntries(result.data);
      } else {
        setError(result.error || "Failed to fetch waitlist entries");
        console.error("API error:", result.error);
      }
    } catch (err) {
      setError("An error occurred while fetching waitlist entries");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (editingEntry) {
      setEditingEntry({
        ...editingEntry,
        fields: {
          ...editingEntry.fields,
          [name]: value,
        },
      });
    } else {
      setNewEntry({
        ...newEntry,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log("Submitting waitlist entry data:", newEntry);
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: newEntry }),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        setNewEntry({
          "Email Address": "",
          "First Name": "",
          "Last Name": "",
          "Phone Number": "",
          Address: "",
          Company: "",
          Status: "Not Contacted",
          NOTES: "",
          TAGS: "",
        });
        setShowAddForm(false);
        fetchWaitlistEntries(); // Refresh waitlist
      } else {
        setSubmitError(result.error || "Failed to add waitlist entry");
      }
    } catch (err) {
      setSubmitError("An error occurred while adding the waitlist entry");
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
      console.log("Updating waitlist entry data:", editingEntry);
      const response = await fetch("/api/waitlist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId: editingEntry.id,
          fields: editingEntry.fields,
        }),
      });

      const result = await response.json();
      console.log("API update response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        setEditingEntry(null);
        fetchWaitlistEntries(); // Refresh waitlist
      } else {
        setSubmitError(result.error || "Failed to update waitlist entry");
      }
    } catch (err) {
      setSubmitError("An error occurred while updating the waitlist entry");
      console.error("Update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!confirm("Are you sure you want to delete this waitlist entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/waitlist?recordId=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      console.log("Delete response:", result);

      if (result.success) {
        setSubmitSuccess(true);
        fetchWaitlistEntries(); // Refresh waitlist
      } else {
        setError(result.error || "Failed to delete waitlist entry");
      }
    } catch (err) {
      setError("An error occurred while deleting the waitlist entry");
      console.error("Delete error:", err);
    }
  };

  const startEditing = (entry) => {
    console.log("Starting to edit waitlist entry:", entry);
    setEditingEntry({
      id: entry.id,
      fields: { ...entry.fields },
    });
    setSubmitError(null);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setSubmitError(null);
  };

  const openEmailModal = (entry) => {
    setSelectedEntry(entry);
    setEmailModalOpen(true);
    setEmailMessage("");
    setSubmitError(null);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setSelectedEntry(null);
    setEmailMessage("");
    setEmailTemplate("waitlist_contact");
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    setSubmitError(null);

    if (!emailClient) {
      setSubmitError("Email service not initialized");
      setSendingEmail(false);
      return;
    }

    try {
      const templateParams = {
        to_email: selectedEntry.fields["Email Address"],
        to_name:
          selectedEntry.fields["First Name"] &&
          selectedEntry.fields["Last Name"]
            ? `${selectedEntry.fields["First Name"]} ${selectedEntry.fields["Last Name"]}`
            : selectedEntry.fields["Email Address"],
        from_name: "Moeno",
        custom_message: emailMessage,
        interest_level: selectedEntry.fields.TAGS || "",
        company: selectedEntry.fields.Company || "",
        reply_to: "moeno@nihongowithmoeno.com",
      };

      // Validate template parameters
      validateTemplateParams(emailTemplate, templateParams);

      // Get template configuration
      const templateConfig = emailTemplates.find(
        (t) => t.type === emailTemplate
      );
      if (!templateConfig) {
        throw new Error(`Template "${emailTemplate}" not found`);
      }

      // Send email using client-side EmailJS
      const result = await emailClient.sendEmail(
        templateConfig.id,
        templateParams
      );

      if (result.success) {
        setSubmitSuccess(true);
        closeEmailModal();

        // Log email sent for tracking
        console.log(`Email sent successfully:`, {
          template: emailTemplate,
          to: templateParams.to_email,
          timestamp: new Date().toISOString(),
        });

        // Update the entry status to "Contacted" if it was "Not Contacted"
        if (selectedEntry.fields.Status === "Not Contacted") {
          await fetch("/api/waitlist", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recordId: selectedEntry.id,
              fields: { Status: "Contacted" },
            }),
          });
          fetchWaitlistEntries(); // Refresh the list
        }
      } else {
        setSubmitError("Failed to send email");
      }
    } catch (err) {
      setSubmitError(
        err.message || "An error occurred while sending the email"
      );
      console.error("Email send error:", err);
    } finally {
      setSendingEmail(false);
    }
  };

  // Filter entries based on status
  const filteredEntries =
    statusFilter === "all"
      ? waitlistEntries
      : waitlistEntries.filter((entry) => entry.fields.Status === statusFilter);

  // Get status counts for filter badges
  const statusCounts = statusOptions.reduce((acc, status) => {
    acc[status] = waitlistEntries.filter(
      (entry) => entry.fields.Status === status
    ).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-black">
        <h2 className="text-xl font-semibold text-gray-900">
          Waitlist Management
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-2 rounded-md ${
            showAddForm ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"
          }`}
        >
          {showAddForm ? "Cancel" : "Add New Entry"}
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Filter by Status
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusFilter === "all"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({waitlistEntries.length})
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusFilter === status
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Waitlist entry {editingEntry ? "updated" : "added"} successfully!
        </div>
      )}

      {/* Error message */}
      {(error || submitError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error || submitError}
        </div>
      )}

      {/* Add/Edit Entry Form */}
      {showAddForm || editingEntry ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-black">
          <h3 className="text-lg font-semibold mb-4 text-black">
            {editingEntry ? "Edit Waitlist Entry" : "Add New Waitlist Entry"}
          </h3>
          <form onSubmit={editingEntry ? handleUpdateSubmit : handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="Email Address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address*
                </label>
                <input
                  type="email"
                  id="Email Address"
                  name="Email Address"
                  value={
                    editingEntry
                      ? editingEntry.fields["Email Address"] || ""
                      : newEntry["Email Address"]
                  }
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="First Name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="First Name"
                  name="First Name"
                  value={
                    editingEntry
                      ? editingEntry.fields["First Name"] || ""
                      : newEntry["First Name"]
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="Last Name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="Last Name"
                  name="Last Name"
                  value={
                    editingEntry
                      ? editingEntry.fields["Last Name"] || ""
                      : newEntry["Last Name"]
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="Phone Number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="Phone Number"
                  name="Phone Number"
                  value={
                    editingEntry
                      ? editingEntry.fields["Phone Number"] || ""
                      : newEntry["Phone Number"]
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="Company"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="Company"
                  name="Company"
                  value={
                    editingEntry
                      ? editingEntry.fields["Company"] || ""
                      : newEntry["Company"]
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="Status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status*
                </label>
                <select
                  id="Status"
                  name="Status"
                  value={
                    editingEntry
                      ? editingEntry.fields["Status"] || "Not Contacted"
                      : newEntry["Status"]
                  }
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="Address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="Address"
                  name="Address"
                  value={
                    editingEntry
                      ? editingEntry.fields["Address"] || ""
                      : newEntry["Address"]
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="TAGS"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="TAGS"
                  name="TAGS"
                  value={
                    editingEntry
                      ? editingEntry.fields["TAGS"] || ""
                      : newEntry["TAGS"]
                  }
                  onChange={handleInputChange}
                  placeholder="Comma-separated tags"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="NOTES"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="NOTES"
                  name="NOTES"
                  rows={3}
                  value={
                    editingEntry
                      ? editingEntry.fields["NOTES"] || ""
                      : newEntry["NOTES"]
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              {editingEntry && (
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
                  : editingEntry
                  ? "Update Entry"
                  : "Add Entry"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        //  Waitlist Table
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Waitlist Entries ({filteredEntries.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="h-8 w-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {statusFilter === "all"
                ? "No waitlist entries found. Add your first entry using the button above."
                : `No entries found with status "${statusFilter}".`}
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
                      Contact Info
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
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Joined
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
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.fields["First Name"] &&
                            entry.fields["Last Name"]
                              ? `${entry.fields["First Name"]} ${entry.fields["Last Name"]}`
                              : entry.fields["Email Address"]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.fields["Email Address"]}
                          </div>
                          {entry.fields["Phone Number"] && (
                            <div className="text-sm text-gray-500">
                              {entry.fields["Phone Number"]}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            entry.fields.Status === "Active Student"
                              ? "bg-green-100 text-green-800"
                              : entry.fields.Status === "Contacted"
                              ? "bg-blue-100 text-blue-800"
                              : entry.fields.Status === "Not Interested"
                              ? "bg-red-100 text-red-800"
                              : entry.fields.Status === "Inactive Student"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {entry.fields.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.fields.Company || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.fields.CC && entry.fields.REGION
                          ? `${entry.fields.REGION}, ${entry.fields.CC}`
                          : entry.fields.TIMEZONE || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.fields.OPTIN_TIME
                          ? new Date(
                              entry.fields.OPTIN_TIME
                            ).toLocaleDateString()
                          : new Date(entry.createdTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openEmailModal(entry)}
                            className="text-green-600 hover:text-green-900"
                            title="Send Email"
                          >
                            Email
                          </button>
                          <button
                            onClick={() => startEditing(entry)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
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
      )}

      {/* Email Modal */}
      {emailModalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Send Email to{" "}
                  {selectedEntry.fields["First Name"] &&
                  selectedEntry.fields["Last Name"]
                    ? `${selectedEntry.fields["First Name"]} ${selectedEntry.fields["Last Name"]}`
                    : selectedEntry.fields["Email Address"]}
                </h3>
                <button
                  onClick={closeEmailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSendEmail}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template
                  </label>
                  <select
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {emailTemplates.map((template) => (
                      <option key={template.type} value={template.type}>
                        {template.name} - {template.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
                    {selectedEntry.fields["Email Address"]}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Message (Optional)
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={4}
                    placeholder="Add a personal message that will be included in the email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Sending an email will
                        automatically update this person&apos;s status to
                        &quot;Contacted&quot; if they are currently &quot;Not
                        Contacted&quot;.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeEmailModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingEmail ? "Sending..." : "Send Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
