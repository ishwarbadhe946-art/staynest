import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import FindStays from "./pages/FindStays.jsx";
import StayDetails from "./pages/StayDetails.jsx";
import Owner from "./pages/Owner.jsx";
import Manage from "./pages/Manage.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";

// Practical 04: useLocation + useEffect lifecycle handler (+ scroll to top)
function LifecycleHandler() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(`StayNest route changed to: ${pathname}`);
    return () => console.log(`Leaving route: ${pathname}`);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <section className="not-found">
      <span className="section-label">PAGE NOT FOUND</span>
      <h1>We couldn't find that page.</h1>
      <p>The page you are looking for does not exist.</p>
      <NavLink to="/" className="btn btn-primary">Back to Home</NavLink>
    </section>
  );
}

const readUser = () => {
  try { return JSON.parse(localStorage.getItem("staynest_user") || "null"); } catch { return null; }
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(readUser);
  const close = () => setMenuOpen(false);

  const handleRegistered = (u) => {
    setUser(u);
    try { localStorage.setItem("staynest_user", JSON.stringify(u)); } catch { /* ignore */ }
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem("staynest_user"); localStorage.removeItem("staynest_token"); } catch { /* ignore */ }
    close();
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <NavLink to="/" className="brand" onClick={close}>
          <div className="brand-logo">S</div>
          <div className="brand-text"><strong>StayNest</strong><span>PG & HOSTEL FINDER</span></div>
        </NavLink>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/find-stays" onClick={close}>Find Stays</NavLink>
          <NavLink to="/owner" onClick={close}>For Owners</NavLink>
          <NavLink to="/manage" onClick={close}>Manage</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
          {user ? (
            <>
              <span className="user-chip">Hi, {user.fullName.split(" ")[0]}</span>
              <a href="#logout" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
            </>
          ) : (
            <NavLink to="/register" className="nav-cta" onClick={close}>Sign Up</NavLink>
          )}
        </nav>
      </header>

      <LifecycleHandler />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-stays" element={<FindStays />} />
          <Route path="/stays/:id" element={<StayDetails />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/register" element={<Register onRegistered={handleRegistered} />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="brand-logo">S</div>
            <div><strong>StayNest</strong><span>PG & HOSTEL FINDER</span></div>
          </div>
          <p>Find comfortable PGs and hostels with ease.</p>
          <span className="copyright">© 2026 StayNest. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
