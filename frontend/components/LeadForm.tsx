"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLead } from "@/lib/api";

export default function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("NEW");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createLead({ name, email, status });
      setName("");
      setEmail("");
      setStatus("NEW");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const inputStyle: React.CSSProperties = {
    padding: "6px 8px",
    fontFamily: "monospace",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "6px 14px",
    fontFamily: "monospace",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    alignSelf: "flex-start",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "4rem", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}
    >
      <h2 style={{ margin: 0, display: "flex", justifyContent: "center" }}>Adding Form</h2>
      <div style={fieldStyle}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="NEW">New</option>
          <option value="ENGAGED">Engaged</option>
          <option value="PROPOSAL_SENT">Proposal Sent</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </select>
      </div>
      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? "Saving..." : "Add Lead"}
      </button>
    </form>
  );
}
