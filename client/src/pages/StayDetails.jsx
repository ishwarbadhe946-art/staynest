import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { errorMessage, getHostel } from "../api";

export default function StayDetails() {
  const { id } = useParams();
  const [stay, setStay] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHostel(id)
      .then((h) => {
        setStay(h);
        document.title = `StayNest | ${h.hostelName}`;
      })
      .catch((e) => setError(errorMessage(e, "Property not found.")));
  }, [id]);

  if (error) return <div className="state-box error">{error} <br /><Link to="/find-stays" className="view-link">← Back to stays</Link></div>;
  if (!stay) return <div className="state-box">Loading...</div>;

  return (
    <div className="content-section" style={{ maxWidth: 900 }}>
      <Link to="/find-stays" className="view-link">← Back to stays</Link>
      <article className="property-card" style={{ marginTop: 20 }}>
        {stay.image && <img src={stay.image} alt={stay.hostelName} style={{ height: 340 }} />}
        <div className="property-body">
          <div className="property-rating">★ {Number(stay.rating).toFixed(1)}</div>
          <h3 style={{ fontSize: 28 }}>{stay.hostelName}</h3>
          <p className="property-location">⌖ {stay.location}</p>
          <div className="facility-row">{[stay.type, stay.hostelType, stay.roomType, ...stay.facilities].map((f) => <span key={f}>{f}</span>)}</div>
          {stay.description && <p style={{ margin: "16px 0", color: "#6d7485" }}>{stay.description}</p>}
          <p><strong>Owner:</strong> {stay.ownerName} &nbsp;•&nbsp; <strong>Phone:</strong> <a href={`tel:${stay.contact}`}>{stay.contact}</a>{stay.email && <> &nbsp;•&nbsp; <a href={`mailto:${stay.email}`}>{stay.email}</a></>}</p>
          <p><strong>Rooms available:</strong> {stay.availableRooms}</p>
          <div className="property-footer">
            <div><strong>₹{Number(stay.rent).toLocaleString("en-IN")}</strong><small>/month</small></div>
            <a className="view-property" href={`tel:${stay.contact}`}>Call Owner</a>
          </div>
        </div>
      </article>
    </div>
  );
}
