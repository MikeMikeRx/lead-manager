import { getLeads, type Lead } from "@/lib/api";

const Home = async () => {
  let leads: Lead[] = [];
  let error: string | null = null;

  try {
    leads = await getLeads();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch leads";
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Leads</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!error && leads.length === 0 && <p>No leads found.</p>}
      {leads.length > 0 && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {["Name", "Email", "Status", "Created"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #ccc" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td style={{ padding: "8px 12px" }}>{lead.name}</td>
                <td style={{ padding: "8px 12px" }}>{lead.email}</td>
                <td style={{ padding: "8px 12px" }}>{lead.status}</td>
                <td style={{ padding: "8px 12px" }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default Home;
