import { Link } from "react-router-dom";

const FALLBACK =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80";

// Card from practicals 03/04 (+ favourites from 03), driven by real API data.
export default function PropertyCard({ stay, isFavorite, onToggleFavorite }) {
  const available = stay.availableRooms > 0;

  return (
    <article className="property-card">
      <div className="property-image">
        <img src={stay.image || FALLBACK} alt={stay.hostelName} loading="lazy" />
        <span className="property-tag">{stay.type}</span>
        <span className={`available-tag ${available ? "" : "full"}`}>
          {available ? "Available" : "Full"}
        </span>
        {onToggleFavorite && (
          <button
            type="button"
            className={`heart-button ${isFavorite ? "liked" : ""}`}
            onClick={() => onToggleFavorite(stay.id)}
            aria-label={`Toggle favorite for ${stay.hostelName}`}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        )}
      </div>

      <div className="property-body">
        <div className="property-rating">★ {Number(stay.rating || 0).toFixed(1)}</div>
        <h3>{stay.hostelName}</h3>
        <p className="property-location">⌖ {stay.location}</p>

        <div className="facility-row">
          {(stay.facilities || []).slice(0, 4).map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>

        <div className="property-footer">
          <div>
            <strong>₹{Number(stay.rent).toLocaleString("en-IN")}</strong>
            <small>/month</small>
          </div>
          <Link to={`/stays/${stay.id}`} className="view-property">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
