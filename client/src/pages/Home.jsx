import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import useHostels from "../useHostels";

const AREAS = [
  ["AE", "Andheri East"],
  ["PW", "Powai"],
  ["TW", "Thane West"],
  ["VS", "Vashi"]
];

export default function Home() {
  const { hostels, loading, error } = useHostels();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "StayNest | Find Your Perfect Stay";
  }, []);

  const featured = useMemo(
    () =>
      hostels
        .filter((h) => category === "All" || h.type === category)
        .filter((h) => `${h.hostelName} ${h.location}`.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 4),
    [hostels, search, category]
  );

  const areaCount = (name) => hostels.filter((h) => h.location.toLowerCase().includes(name.toLowerCase())).length;

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge"><span>●</span> Trusted student accommodation</div>
          <h1>Find a place you’ll<span> love to stay.</span></h1>
          <p>Discover comfortable PGs and hostels near your college, workplace or preferred location.</p>
          <div className="hero-buttons">
            <Link to="/find-stays" className="btn btn-primary">Find a Stay <span>→</span></Link>
            <Link to="/owner" className="btn btn-outline">List Your Property</Link>
          </div>
          <div className="hero-trust">
            <div><strong>{hostels.length || "—"}</strong><span>Properties</span></div>
            <div><strong>{hostels.filter((h) => h.availableRooms > 0).length || "—"}</strong><span>Available now</span></div>
            <div><strong>25+</strong><span>Locations</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-main">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85"
              alt="Comfortable accommodation"
            />
          </div>
          <div className="floating-card rating-card">
            <span className="floating-icon">★</span>
            <div><strong>4.8/5</strong><small>Student rating</small></div>
          </div>
          <div className="floating-card location-card">
            <span className="floating-icon">⌖</span>
            <div><strong>25+ Areas</strong><small>Across Mumbai</small></div>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="search-box">
          <div className="search-title">
            <span className="search-icon">⌕</span>
            <div><strong>Where do you want to stay?</strong><small>Search by area or property name</small></div>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/find-stays?q=${encodeURIComponent(search)}`)}
            placeholder="e.g. Andheri, Powai, Thane..."
          />
          <Link to={`/find-stays?q=${encodeURIComponent(search)}`} className="btn btn-primary search-button">Search</Link>
        </div>
        <div className="category-tabs">
          {["All", "PG", "Hostel"].map((c) => (
            <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-top">
          <div>
            <span className="section-label">EXPLORE AREAS</span>
            <h2>Popular locations</h2>
            <p>Find stays close to where you need to be.</p>
          </div>
          <Link to="/find-stays" className="view-link">View all locations →</Link>
        </div>
        <div className="location-grid">
          {AREAS.map(([code, name]) => (
            <Link key={code} to={`/find-stays?q=${encodeURIComponent(name)}`} className="location-box">
              <div className="location-symbol">{code}</div>
              <div><h3>{name}</h3><p>{areaCount(name)} propert{areaCount(name) === 1 ? "y" : "ies"}</p></div>
              <span>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section featured-section">
        <div className="section-top">
          <div>
            <span className="section-label">TOP PICKS</span>
            <h2>Featured stays</h2>
            <p>Comfortable places selected for students.</p>
          </div>
          <Link to="/find-stays" className="view-link">View all stays →</Link>
        </div>

        {loading ? (
          <div className="state-box">Loading properties...</div>
        ) : error ? (
          <div className="state-box error">{error}</div>
        ) : featured.length === 0 ? (
          <div className="state-box">No matching stays yet.</div>
        ) : (
          <div className="property-grid">
            {featured.map((s) => <PropertyCard key={s.id} stay={s} />)}
          </div>
        )}
      </section>

      <section className="why-section">
        <div className="section-top centered">
          <div>
            <span className="section-label">WHY STAYNEST</span>
            <h2>Everything you need in one place</h2>
            <p>Finding accommodation should be simple, transparent and stress-free.</p>
          </div>
        </div>
        <div className="why-grid">
          {[
            ["⌕", "Easy Search", "Search properties by location, type and monthly rent."],
            ["₹", "Compare Rent", "Compare different stays and choose what fits your budget."],
            ["✓", "Student Friendly", "Discover facilities and locations suitable for students."],
            ["☎", "Connect With Owners", "Get useful property and owner information before deciding."]
          ].map(([icon, title, text]) => (
            <div className="why-card" key={title}>
              <div className="why-icon">{icon}</div><h3>{title}</h3><p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="section-label">READY TO START?</span>
          <h2>Your next stay is closer than you think.</h2>
          <p>Explore PGs and hostels or list your property with StayNest.</p>
        </div>
        <div className="cta-buttons">
          <Link to="/find-stays" className="btn btn-white">Find a Stay</Link>
          <Link to="/owner" className="btn btn-ghost">List Property</Link>
        </div>
      </section>
    </div>
  );
}
