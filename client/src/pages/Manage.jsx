import { useEffect, useState } from "react";
import HostelForm from "../components/HostelForm";
import useHostels from "../useHostels";
import { createHostel, deleteHostel, errorMessage, updateHostel } from "../api";

// Practical 05 (Add / Retrieve / Update / Delete) wired to the unified API.
const TABS = [
  ["add", "＋", "Add Hostel"],
  ["retrieve", "⌕", "Retrieve Details"],
  ["update", "↻", "Update Details"],
  ["delete", "×", "Delete Hostel"]
];

function Messages({ message, error }) {
  return (
    <>
      {message && <div className="success-message">✓ {message}</div>}
      {error && <div className="error-message">✕ {error}</div>}
    </>
  );
}

function Heading({ badge, kind, title, text, children }) {
  return (
    <div className="section-heading">
      <div>
        <span className={`operation-badge ${kind}`}>{badge}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {children}
    </div>
  );
}

function AddTab({ refresh }) {
  const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (data) => {
    setBusy(true); setMsg(""); setErr("");
    try { setMsg((await createHostel(data)).message); refresh(); return true; }
    catch (e) { setErr(errorMessage(e)); return false; }
    finally { setBusy(false); }
  };
  return (
    <section className="crud-card">
      <Heading badge="CREATE" kind="create" title="Add Hostel" text="Add a new hostel property to the StayNest database." />
      <Messages message={msg} error={err} />
      <HostelForm onSubmit={submit} loading={busy} submitLabel="+ Add Hostel" />
    </section>
  );
}

function RetrieveTab({ hostels, loading, error, refresh }) {
  return (
    <section className="crud-card">
      <Heading badge="READ" kind="read" title="Retrieve Hostel Details" text="View all hostel properties stored in the StayNest database.">
        <button className="secondary-button" onClick={refresh}>↻ Refresh</button>
      </Heading>
      <Messages error={error} />
      {loading ? (
        <div className="loading">Loading hostel details...</div>
      ) : hostels.length === 0 ? (
        <div className="empty-state"><h3>No Hostels Found</h3><p>Add a hostel to display its details here.</p></div>
      ) : (
        <div className="hostel-grid">
          {hostels.map((h) => (
            <div className="hostel-card" key={h.id}>
              <div className="hostel-card-header">
                <div><span className="hostel-type">{h.type} · {h.hostelType}</span><h3>{h.hostelName}</h3></div>
                <div className="rent">₹{h.rent}<small>/month</small></div>
              </div>
              <div className="hostel-info">
                <p><strong>Owner:</strong> {h.ownerName}</p>
                <p><strong>Location:</strong> {h.location}</p>
                <p><strong>Contact:</strong> {h.contact}{h.email && ` · ${h.email}`}</p>
                <p><strong>Room:</strong> {h.roomType} · <strong>Rooms left:</strong> {h.availableRooms} ({h.availability})</p>
              </div>
              {h.facilities?.length > 0 && <div className="facilities">{h.facilities.map((f) => <span key={f}>{f}</span>)}</div>}
              {h.description && <p className="description">{h.description}</p>}
              <div className="record-id">ID: {h.id}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function HostelPicker({ hostels, value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label>Select Hostel *</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={hostels.length === 0}>
        <option value="">{hostels.length === 0 ? "No hostels available" : placeholder}</option>
        {hostels.map((h) => <option key={h.id} value={h.id}>{h.hostelName} — {h.location}</option>)}
      </select>
    </div>
  );
}

function UpdateTab({ hostels, refresh }) {
  const [id, setId] = useState("");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const selected = hostels.find((h) => h.id === id);

  const submit = async (data) => {
    setBusy(true); setMsg(""); setErr("");
    try { setMsg((await updateHostel(id, data)).message); await refresh(); return true; }
    catch (e) { setErr(errorMessage(e)); return false; }
    finally { setBusy(false); }
  };

  return (
    <section className="crud-card">
      <Heading badge="UPDATE" kind="update" title="Update Hostel Details" text="Select a hostel and update its information." />
      <Messages message={msg} error={err} />
      <HostelPicker hostels={hostels} value={id} onChange={(v) => { setId(v); setMsg(""); setErr(""); }} placeholder="Select hostel to update" />
      {selected && (
        // key forces the form to reload when another hostel / fresh data is selected
        <HostelForm key={`${selected.id}-${selected.updatedAt}`} initial={selected} onSubmit={submit} loading={busy} submitLabel="✓ Update Hostel" className="update-button" />
      )}
    </section>
  );
}

function DeleteTab({ hostels, refresh }) {
  const [id, setId] = useState("");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const selected = hostels.find((h) => h.id === id);

  const remove = async () => {
    if (!window.confirm(`Are you sure you want to delete "${selected.hostelName}"?`)) return;
    setBusy(true); setMsg(""); setErr("");
    try {
      await deleteHostel(id);
      setMsg(`"${selected.hostelName}" has been deleted successfully.`);
      setId("");
      await refresh();
    } catch (e) { setErr(errorMessage(e)); }
    finally { setBusy(false); }
  };

  return (
    <section className="crud-card">
      <Heading badge="DELETE OPERATION" kind="delete" title="Delete Hostel" text="Select a hostel, review it, then delete the record from the database." />
      <Messages message={msg} error={err} />
      <HostelPicker hostels={hostels} value={id} onChange={setId} placeholder="Select a hostel to delete" />
      {selected && (
        <div className="delete-container">
          <div className="delete-icon">🗑</div>
          <h3>{selected.hostelName}</h3>
          <p className="record-id">ID: {selected.id}</p>
          <div className="hostel-info">
            <p><strong>Owner:</strong> {selected.ownerName}</p>
            <p><strong>Location:</strong> {selected.location}</p>
            <p><strong>Rent:</strong> ₹{selected.rent}</p>
          </div>
          <button className="delete-button" onClick={remove} disabled={busy}>{busy ? "Deleting..." : "🗑 Delete Hostel"}</button>
        </div>
      )}
    </section>
  );
}

export default function Manage() {
  const [tab, setTab] = useState("add");
  const data = useHostels();

  useEffect(() => {
    document.title = "StayNest | Manage Hostels";
  }, []);

  return (
    <div className="crud-page">
      <main className="crud-main">
        <section className="crud-hero">
          <div>
            <span className="crud-hero-label">HOSTEL MANAGEMENT SYSTEM</span>
            <h2>Manage your hostel<br /><span>records effortlessly.</span></h2>
            <p>Add, view, update and delete hostel information directly through the StayNest database.</p>
          </div>
          <div className="database-card">
            <span className="database-dot" />
            <div><strong>{data.hostels.length} records</strong><span>{data.error ? "API unreachable" : "Connected to API"}</span></div>
          </div>
        </section>

        <nav className="crud-navigation">
          {TABS.map(([key, icon, label]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>

        {tab === "add" && <AddTab refresh={data.refresh} />}
        {tab === "retrieve" && <RetrieveTab {...data} />}
        {tab === "update" && <UpdateTab hostels={data.hostels} refresh={data.refresh} />}
        {tab === "delete" && <DeleteTab hostels={data.hostels} refresh={data.refresh} />}
      </main>
    </div>
  );
}
