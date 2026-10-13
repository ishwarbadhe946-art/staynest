import { useState } from "react";
import { FACILITIES } from "../api";

const FIELDS = ["hostelName","ownerName","contact","email","location","type","hostelType","roomType","rent","availableRooms","facilities","description","image"];
const pick = (obj = {}) => Object.fromEntries(FIELDS.filter((k) => k in obj).map((k) => [k, obj[k]]));

const EMPTY = {
  hostelName: "",
  ownerName: "",
  contact: "",
  email: "",
  location: "",
  type: "PG",
  hostelType: "Co-ed",
  roomType: "Double Sharing",
  rent: "",
  availableRooms: 1,
  facilities: [],
  description: "",
  image: ""
};

// One form for Add (05), Update (05), Edit (09) and the Owner listing (04).
export default function HostelForm({ initial, onSubmit, submitLabel = "Save", loading = false, className = "primary-button" }) {
  const [form, setForm] = useState({ ...EMPTY, ...pick(initial) });

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const toggle = (name) =>
    setForm((f) => ({
      ...f,
      facilities: f.facilities.includes(name) ? f.facilities.filter((x) => x !== name) : [...f.facilities, name]
    }));

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({
      ...form,
      rent: Number(form.rent),
      availableRooms: Number(form.availableRooms)
    });
    if (ok && !initial) setForm(EMPTY); // clear after a successful "add"
  };

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Property Name *</label>
          <input name="hostelName" value={form.hostelName} onChange={set} placeholder="e.g. NestView Premium PG" required />
        </div>
        <div className="form-group">
          <label>Owner Name *</label>
          <input name="ownerName" value={form.ownerName} onChange={set} placeholder="Owner full name" required />
        </div>
        <div className="form-group">
          <label>Contact Number *</label>
          <input name="contact" type="tel" value={form.contact} onChange={set} placeholder="10-digit mobile" pattern="[6-9][0-9]{9}" maxLength="10" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={set} placeholder="owner@example.com" />
        </div>
        <div className="form-group">
          <label>Location *</label>
          <input name="location" value={form.location} onChange={set} placeholder="e.g. Andheri East, Mumbai" required />
        </div>
        <div className="form-group">
          <label>Property Type</label>
          <select name="type" value={form.type} onChange={set}>
            <option>PG</option>
            <option>Hostel</option>
          </select>
        </div>
        <div className="form-group">
          <label>Suitable For</label>
          <select name="hostelType" value={form.hostelType} onChange={set}>
            <option>Boys</option>
            <option>Girls</option>
            <option>Co-ed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Room Type</label>
          <select name="roomType" value={form.roomType} onChange={set}>
            <option>Single</option>
            <option>Double Sharing</option>
            <option>Triple Sharing</option>
          </select>
        </div>
        <div className="form-group">
          <label>Monthly Rent (₹) *</label>
          <input name="rent" type="number" min="500" value={form.rent} onChange={set} placeholder="e.g. 8500" required />
        </div>
        <div className="form-group">
          <label>Available Rooms *</label>
          <input name="availableRooms" type="number" min="0" value={form.availableRooms} onChange={set} required />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Facilities</label>
        <div className="facility-grid">
          {FACILITIES.map((f) => (
            <label className="facility-item" key={f}>
              <input type="checkbox" checked={form.facilities.includes(f)} onChange={() => toggle(f)} />
              <span>{f}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group full-width">
        <label>Image URL (optional)</label>
        <input name="image" type="url" value={form.image} onChange={set} placeholder="https://..." />
      </div>

      <div className="form-group full-width">
        <label>Description</label>
        <textarea name="description" rows="4" value={form.description} onChange={set} placeholder="Rooms, food, security, nearby colleges..." />
      </div>

      <button className={className} type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
