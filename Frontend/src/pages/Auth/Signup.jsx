import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);

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

      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-dark dark:bg-background-light font-display text-slate-100 dark:text-slate-900 min-h-screen flex flex-col relative overflow-hidden">
      <header className="flex items-center justify-between px-6 lg:px-20 py-6 border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-white dark:text-slate-900">
            AI Optimizer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg-lg pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-glow pointer-events-none"></div>

        <div className="w-full max-w-[440px] z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-white dark:text-slate-900">
              Create your account
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Join 10,000+ developers optimizing their models.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 w-full h-12 rounded-lg border border-slate-800 dark:border-slate-200 bg-slate-900/50 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-50 transition-all font-medium">
              <img
                alt="Google Logo"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqyfiEAroLA_AWWBUrX3PZZs5TUl6mFzAlVs-QkBJR2YFeaU2TPJNhuO3yKufdRHlnxgFV0APhZyfwPlFbqKb9Cdgu2RmXtmMC9JQjcqX_ME9CTLY3-3bYR9e2_ZXItRAhdpRw1IfGmc5aoKBzH6NmoOKZ4UH_ew4qo8XSJp3G54sYVAd0jHYjafz-iPufOtG9qM-MlBPii-iBFZZJIpTp8aabDdJ8p3d6MEOIH_zM_zQtZyFc4_SGbQAH6XwFrI92TT0M-kAPCXM"
              />
              <span>Sign up with Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 w-full h-12 rounded-lg border border-slate-800 dark:border-slate-200 bg-slate-900/50 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-50 transition-all font-medium">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
              <span>Sign up with GitHub</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800 dark:border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background-dark dark:bg-background-light px-4 rounded-full text-slate-500 font-semibold tracking-wider">
                Or continue with email
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-slate-300 dark:text-slate-700"
                htmlFor="full-name"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">
                    person
                  </span>
                </div>
                <input
                  className="w-full h-12 pl-11 bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-300 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none"
                  id="full-name"
                  placeholder="John Doe"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-slate-300 dark:text-slate-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">
                    mail
                  </span>
                </div>
                <input
                  className="w-full h-12 pl-11 bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-300 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-semibold text-slate-300 dark:text-slate-700"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">
                    lock
                  </span>
                </div>
                <input
                  className="w-full h-12 pl-11 pr-11 bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-300 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none"
                  id="password"
                  placeholder="Min. 8 characters"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">
                    visibility
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input
                className="mt-1 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary focus:ring-primary/30"
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <label
                className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
                htmlFor="terms"
              >
                By creating an account, you agree to our{" "}
                <a className="text-primary hover:underline" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-primary hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-xl">
                  refresh
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-xl">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
          © 2024 AI Optimizer Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Signup;
