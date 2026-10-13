import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import useHostels from "../useHostels";

const loadFavs = () => {
  try {
    return JSON.parse(localStorage.getItem("staynest_favs") || "[]");
  } catch {
    return [];
  }
};

// Search/filter from practical 04 + favourites from practical 03.
export default function FindStays() {
  const { hostels, loading, error } = useHostels();
  const [params] = useSearchParams();

  const [search, setSearch] = useState(params.get("q") || "");
  const [type, setType] = useState("All");
  const [maxRent, setMaxRent] = useState("15000");
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [favs, setFavs] = useState(loadFavs);

  useEffect(() => {
    document.title = "StayNest | Find Stays";
  }, []);

  useEffect(() => setSearch(params.get("q") || ""), [params]);

  const toggleFav = (id) =>
    setFavs((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      try { localStorage.setItem("staynest_favs", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });

  const filtered = useMemo(
    () =>
      hostels.filter((h) => {
        const q = search.toLowerCase();
        return (
          (h.hostelName.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)) &&
          (type === "All" || h.type === type) &&
          h.rent <= Number(maxRent) &&
          (!onlyFavs || favs.includes(h.id))
        );
      }),
    [hostels, search, type, maxRent, onlyFavs, favs]
  );

  return (
    <div className="find-page">
      <section className="page-hero">
        <div>
          <span className="section-label">FIND YOUR STAY</span>
          <h1>Explore PGs & hostels</h1>
          <p>Search comfortable accommodation based on your preferred location, property type and budget.</p>
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-field search-field">
          <label>Search location</label>
          <input type="text" placeholder="Andheri, Powai, Thane..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-field">
          <label>Property type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All properties</option>
            <option value="PG">PG</option>
            <option value="Hostel">Hostel</option>
          </select>
        </div>
        <div className="filter-field">
          <label>Maximum rent</label>
          <select value={maxRent} onChange={(e) => setMaxRent(e.target.value)}>
            <option value="6000">₹6,000</option>
            <option value="8000">₹8,000</option>
            <option value="10000">₹10,000</option>
            <option value="15000">₹15,000</option>
            <option value="1000000">Any</option>
          </select>
        </div>
        <div className="filter-field">
          <label>&nbsp;</label>
          <button className={`favorites-toggle ${onlyFavs ? "active" : ""}`} onClick={() => setOnlyFavs(!onlyFavs)}>
            ♥ Favorites ({favs.length})
          </button>
        </div>
      </section>

      <section className="results-section">
        <div className="results-heading">
          <div>
            <span className="section-label">AVAILABLE PROPERTIES</span>
            <h2>{filtered.length} stays found</h2>
          </div>
          <span className="results-info">Showing properties matching your preferences</span>
        </div>

        {loading ? (
          <div className="state-box">Loading properties...</div>
        ) : error ? (
          <div className="state-box error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="no-results">
            <div>⌕</div>
            <h3>No stays found</h3>
            <p>Try another location or increase your maximum rent.</p>
          </div>
        ) : (
          <div className="property-grid">
            {filtered.map((s) => (
              <PropertyCard key={s.id} stay={s} isFavorite={favs.includes(s.id)} onToggleFavorite={toggleFav} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
