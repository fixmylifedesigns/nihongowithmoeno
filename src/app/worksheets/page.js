"use client";

import { useState, useEffect } from "react";
import styles from "./Worksheets.module.css";

export default function WorksheetsPage() {
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorksheets();
  }, []);

  const fetchWorksheets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/worksheets");
      const result = await response.json();

      if (result.success) {
        setWorksheets(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load worksheets");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = (worksheet) => {
    // Check for PDF URL first, then Worksheet File attachment
    const pdfUrl = worksheet.fields["PDF Url"];
    const worksheetFile = worksheet.fields["Worksheet File"];

    let downloadUrl = null;

    if (pdfUrl) {
      downloadUrl = pdfUrl;
    } else if (worksheetFile && worksheetFile.length > 0) {
      downloadUrl = worksheetFile[0].url;
    }

    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else {
      alert("Download not available for this worksheet");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Free Worksheets</h1>
          <p className={styles.subtitle}>
            Download free educational worksheets for your learning journey
          </p>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading worksheets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Free Worksheets</h1>
          <p className={styles.subtitle}>
            Download free educational worksheets for your learning journey
          </p>
        </div>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchWorksheets} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Free Worksheets</h1>
        <p className={styles.subtitle}>
          Download free educational worksheets for your learning journey
        </p>
      </div>

      <div className={styles.worksheetList}>
        <div className={styles.listHeader}>
          <span className={styles.colTitle}>Title</span>
          <span className={styles.colDate}>Date Added</span>
          <span className={styles.colAction}>Download</span>
        </div>

        {worksheets.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No worksheets available yet. Check back soon!</p>
          </div>
        ) : (
          worksheets.map((worksheet) => (
            <div key={worksheet.id} className={styles.worksheetRow}>
              <div className={styles.worksheetInfo}>
                <h3 className={styles.worksheetTitle}>
                  {worksheet.fields.Title || "Untitled Worksheet"}
                </h3>
                {worksheet.fields.Description && (
                  <p className={styles.worksheetDescription}>
                    {worksheet.fields.Description}
                  </p>
                )}
              </div>
              <span className={styles.worksheetDate}>
                {formatDate(worksheet.fields["Date Created"])}
              </span>
              <button
                className={styles.downloadButton}
                onClick={() => handleDownload(worksheet)}
                aria-label={`Download ${worksheet.fields.Title}`}
              >
                <svg
                  className={styles.downloadIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <p>
          {worksheets.length} worksheet{worksheets.length !== 1 ? "s" : ""}{" "}
          available
        </p>
      </div>
    </div>
  );
}