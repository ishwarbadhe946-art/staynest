import { useEffect, useState } from "react";
import HostelForm from "../components/HostelForm";
import { createHostel, errorMessage } from "../api";

// Owner listing page (practical 04) now saves to MongoDB through the API (practical 09).
export default function Owner() {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "StayNest | List Your Property";
  }, []);

  const submit = async (data) => {
    setSaving(true); setError(""); setDone("");
    try {
      const res = await createHostel(data);
      setDone(res.message || "Property listed successfully");
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="owner-page">
      <section className="owner-hero">
        <div className="owner-intro">
          <span className="section-label">FOR PROPERTY OWNERS</span>
          <h1>Find students for<span> your property.</span></h1>
          <p>List your PG or hostel on StayNest and make it easier for students to discover your property.</p>
          <div className="owner-benefits">
            {[
              ["Reach students", "Show your property to students looking for stays."],
              ["Show property details", "Add rent, location, facilities and contact information."],
              ["Simple listing", "Create a clear property listing in a few steps."]
            ].map(([t, s]) => (
              <div key={t}><span>✓</span><div><strong>{t}</strong><small>{s}</small></div></div>
            ))}
          </div>
        </div>

        <div className="owner-form-card">
          <div className="form-card-header">
            <span className="form-number">01</span>
            <div><h2>Property details</h2><p>Enter information about your PG or hostel.</p></div>
          </div>

          <div className="crud-page">
            <HostelForm onSubmit={submit} loading={saving} submitLabel="List Property →" />
          </div>

          {done && <div className="success-message"><strong>✓ {done}</strong><span>Your property is now visible on Find Stays.</span></div>}
          {error && <div className="error-banner">✕ {error}</div>}
        </div>
      </section>
    </div>
  );
}
