import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { errorMessage, registerUser } from "../api";

// ---- Practical 02 (ES6): arrow-function validators ----
const isEmpty = (v) => v.trim() === "";
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidMobile = (v) => /^[6-9][0-9]{9}$/.test(v);
const isValidPassword = (v) => v.length >= 8 && /[A-Za-z]/.test(v) && /[0-9]/.test(v);
const accountTypes = ["student", "owner"];

const INITIAL = { username: "", fullName: "", email: "", mobile: "", dob: "", accountType: "", password: "", confirmPassword: "", terms: false };

const validate = (f) => ({
  username: f.username.trim().length < 3,
  fullName: isEmpty(f.fullName),
  email: !isValidEmail(f.email.trim()),
  mobile: !isValidMobile(f.mobile),
  dob: isEmpty(f.dob),
  accountType: !accountTypes.includes(f.accountType),
  password: !isValidPassword(f.password),
  confirmPassword: isEmpty(f.confirmPassword) || f.confirmPassword !== f.password,
  terms: !f.terms
});

export default function Register({ onRegistered }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "StayNest | Create Account";
  }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    let v = type === "checkbox" ? checked : value;
    if (name === "mobile") v = value.replace(/\D/g, "").slice(0, 10); // numbers only, max 10
    setForm((f) => ({ ...f, [name]: v }));
    setErrors((er) => ({ ...er, [name]: false }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    const result = validate(form);
    setErrors(result);
    if (Object.values(result).some(Boolean)) return;

    setBusy(true);
    try {
      const { confirmPassword, terms, ...payload } = form;
      const res = await registerUser(payload);
      localStorage.setItem("staynest_token", res.token);
      onRegistered?.(res.user);
      setSuccess(true);
      setForm(INITIAL);
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      setServerError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const cls = (name) => (errors[name] ? "is-invalid" : "");
  const msg = (name, text) => errors[name] && <div className="invalid-feedback">{text}</div>;
  const pwType = showPw ? "text" : "password";

  return (
    <div className="register-page">
      <div className="registration-wrapper">
        <div className="registration-card">
          <div className="brand-section">
            <div>
              <div className="reg-brand-logo">S</div>
              <div className="brand-name">StayNest</div>
              <div className="brand-subtitle">PG & HOSTEL FINDER</div>
              <div className="brand-content">
                <span className="small-heading">FIND YOUR PERFECT STAY</span>
                <h1>Find a place<br />that feels like <span>home.</span></h1>
                <p>Discover comfortable PGs and hostels that match your location, budget and lifestyle.</p>
              </div>
              <div className="features">
                {["Easy registration process", "Student & professional friendly", "Find suitable accommodation"].map((t) => (
                  <div className="feature-item" key={t}><div className="feature-icon">✓</div><span>{t}</span></div>
                ))}
              </div>
            </div>
            <div className="brand-footer">PG & Hostel Finder Management System</div>
          </div>

          <div className="form-section">
            <div className="main-brand-heading">
              <div className="main-logo">S</div>
              <div className="main-brand-text"><h2>StayNest</h2><p>Create your account</p></div>
            </div>

            <form onSubmit={submit} noValidate>
              <div className="reg-grid">
                <div className="reg-field">
                  <label className="form-label" htmlFor="username">Username</label>
                  <input id="username" name="username" className={`form-control ${cls("username")}`} value={form.username} onChange={change} placeholder="Enter username" />
                  {msg("username", "Username must contain at least 3 characters.")}
                </div>
                <div className="reg-field">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input id="fullName" name="fullName" className={`form-control ${cls("fullName")}`} value={form.fullName} onChange={change} placeholder="Enter your full name" />
                  {msg("fullName", "Please enter your full name.")}
                </div>
                <div className="reg-field">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" className={`form-control ${cls("email")}`} value={form.email} onChange={change} placeholder="example@email.com" />
                  {msg("email", "Please enter a valid email address.")}
                </div>
                <div className="reg-field">
                  <label className="form-label" htmlFor="mobile">Mobile Number</label>
                  <div className="input-group">
                    <span className="input-group-text">+91</span>
                    <input id="mobile" name="mobile" type="tel" className={`form-control ${cls("mobile")}`} value={form.mobile} onChange={change} maxLength={10} placeholder="10-digit mobile number" />
                  </div>
                  {msg("mobile", "Enter a valid 10-digit mobile number.")}
                </div>
                <div className="reg-field">
                  <label className="form-label" htmlFor="dob">Date of Birth</label>
                  <input id="dob" name="dob" type="date" className={`form-control ${cls("dob")}`} value={form.dob} onChange={change} />
                  {msg("dob", "Please enter your date of birth.")}
                </div>
                <div className="reg-field">
                  <label className="form-label" htmlFor="accountType">Account Type</label>
                  <select id="accountType" name="accountType" className={`form-select ${cls("accountType")}`} value={form.accountType} onChange={change}>
                    <option value="" disabled>Select account type</option>
                    <option value="student">Student</option>
                    <option value="owner">Hostel Owner</option>
                  </select>
                  {msg("accountType", "Please select an account type.")}
                </div>
                <div className="reg-field">
                  <label className="form-label" htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input id="password" name="password" type={pwType} className={`form-control ${cls("password")}`} value={form.password} onChange={change} placeholder="Minimum 8 characters" />
                    <button type="button" className="show-button" onClick={() => setShowPw(!showPw)}>{showPw ? "Hide" : "Show"}</button>
                  </div>
                  {msg("password", "Use 8+ characters with letters and numbers.")}
                </div>
                <div className="reg-field">
                  <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                  <input id="confirmPassword" name="confirmPassword" type={pwType} className={`form-control ${cls("confirmPassword")}`} value={form.confirmPassword} onChange={change} placeholder="Re-enter password" />
                  {msg("confirmPassword", "Passwords do not match.")}
                </div>
                <div className="reg-field full">
                  <div className="form-check">
                    <input id="terms" name="terms" type="checkbox" checked={form.terms} onChange={change} />
                    <label htmlFor="terms" className="form-check-label">I agree to the <strong>Terms & Conditions</strong></label>
                  </div>
                  {msg("terms", "You must accept the terms to continue.")}
                </div>
                <div className="full">
                  <button type="submit" className="register-button" disabled={busy}>
                    <span>{busy ? "Creating account..." : "Create Account"}</span><span className="arrow">→</span>
                  </button>
                </div>
              </div>

              {serverError && <div className="server-error">✕ {serverError}</div>}

              <div className="google-area">
                <div className="google-divider"><span /><small>OR</small><span /></div>
                <button type="button" className="google-button" onClick={() => alert("Google sign-in can be added later with OAuth.")}>
                  <svg className="google-icon" viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
                    <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.39-.18-2.04H12v3.86h5.22a4.46 4.46 0 0 1-1.94 2.92v2.42h3.14c1.84-1.69 2.93-4.18 2.93-7.16z" />
                    <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.42c-.87.58-1.98.92-3.31.92-2.55 0-4.71-1.72-5.49-4.03H3.26v2.5A9.75 9.75 0 0 0 12 21.5z" />
                    <path fill="#FBBC05" d="M6.51 13.62A5.86 5.86 0 0 1 6.2 12c0-.56.1-1.11.31-1.62v-2.5H3.26A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.01 4.38l3.25-2.76z" />
                    <path fill="#EA4335" d="M12 6.35c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.46 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.74 5.38l3.25 2.5C7.29 8.07 9.45 6.35 12 6.35z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {success && (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <div>
                    <strong>Registration Successful</strong>
                    <small>Welcome to StayNest! <Link to="/find-stays">Find a stay →</Link></small>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
