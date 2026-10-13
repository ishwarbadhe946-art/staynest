import { useEffect } from "react";
import { Link } from "react-router-dom";

function About() {

  useEffect(() => {
    document.title = "StayNest | About";
  }, []);

  return (
    <div className="about-page">

      <section className="about-hero">

        <span className="section-label">ABOUT STAYNEST</span>

        <h1>
          Making student accommodation
          <span> easier to find.</span>
        </h1>

        <p>
          StayNest is a PG and Hostel Finder and Management System
          designed to connect students with suitable accommodation
          and help property owners showcase their properties.
        </p>

      </section>

      <section className="about-content">

        <div className="about-story">

          <span className="section-label">OUR PURPOSE</span>

          <h2>One simple place to find your next stay.</h2>

          <p>
            Searching for a PG or hostel can be difficult when students
            have to compare different locations, rent prices and facilities.
          </p>

          <p>
            StayNest brings important property information together so
            students can explore available options and make a better choice.
          </p>

          <Link to="/find-stays" className="btn btn-primary">
            Explore Stays →
          </Link>

        </div>

        <div className="about-values">

          <div className="value-card">
            <span>01</span>
            <h3>Simple Discovery</h3>
            <p>
              Find properties by location, type and budget.
            </p>
          </div>

          <div className="value-card">
            <span>02</span>
            <h3>Useful Information</h3>
            <p>
              View rent, facilities, ratings and property details.
            </p>
          </div>

          <div className="value-card">
            <span>03</span>
            <h3>For Students & Owners</h3>
            <p>
              A platform designed for both sides of accommodation search.
            </p>
          </div>

        </div>

      </section>

      <section className="about-features">

        <div className="section-top centered">

          <div>
            <span className="section-label">WHAT STAYNEST OFFERS</span>
            <h2>Built around your accommodation search</h2>
          </div>

        </div>

        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon">⌕</div>
            <h3>Search</h3>
            <p>
              Explore PGs and hostels using useful search filters.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">₹</div>
            <h3>Budget</h3>
            <p>
              Compare monthly rent and choose a suitable option.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">⌖</div>
            <h3>Location</h3>
            <p>
              Discover stays around popular student locations.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">☎</div>
            <h3>Connect</h3>
            <p>
              Access useful property and owner contact information.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default About;