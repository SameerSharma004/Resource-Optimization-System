import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
const API = import.meta.env.VITE_API_URL;
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up");
      }
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background-dark min-h-screen p-4 md:p-6 selection:bg-primary/30 selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 relative pt-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square bg-[radial-gradient(circle_at_center,rgba(216,119,57,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="w-full max-w-xl z-10">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-black/5 p-10 md:p-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-primary px-4 py-1.5 mb-6 text-xs font-black tracking-widest uppercase bg-primary/5 rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                Get Started
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-background-dark leading-tight tracking-tight">
                Create <span className="text-primary italic font-serif">Account</span>
              </h1>
              <p className="text-gray-500 mt-4 font-medium">
                Join the future of system optimization.
              </p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 text-background-dark">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1" htmlFor="full-name">
                  Full Name
                </label>
                <input
                  className="w-full h-14 px-6 bg-gray-50 border border-black/5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-background-dark font-bold placeholder:text-gray-400 outline-none transition-all"
                  id="full-name"
                  placeholder="Enter Full name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1" htmlFor="email">
                  Work Email
                </label>
                <input
                  className="w-full h-14 px-6 bg-gray-50 border border-black/5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-background-dark font-bold placeholder:text-gray-400 outline-none transition-all"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group/password">
                  <input
                    className="w-full h-14 px-6 pr-14 bg-gray-50 border border-black/5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-background-dark font-bold placeholder:text-gray-400 outline-none transition-all"
                    id="password"
                    placeholder="Min. 8 characters"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-xl"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2 ml-1">
                <input
                  className="size-5 mt-0.5 rounded-lg border-black/10 text-primary focus:ring-primary/30 cursor-pointer"
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label className="text-sm text-gray-500 font-bold cursor-pointer leading-tight" htmlFor="terms">
                  I agree to the <Link className="text-primary hover:underline" to="#">Terms</Link> and <Link className="text-primary hover:underline" to="#">Privacy Policy</Link>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-background-dark hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <>
                    <span>Create My Account</span>
                    <div className="bg-primary size-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
                    </div>
                  </>
                )}
              </button>
            </form>
            <div className="mt-10 text-center">
              <p className="text-gray-500 font-bold text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-10 text-center">
        <p className="text-xs text-gray-600 font-black uppercase tracking-widest opacity-40">
          © 2026 AI Optimizer. Join the elite.
        </p>
      </footer>
    </div>
  );
};
export default Signup;
