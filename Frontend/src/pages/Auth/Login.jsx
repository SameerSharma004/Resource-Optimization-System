import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      // Login successful
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>

      <nav className="relative z-10 w-full px-6 py-6 lg:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-2xl">
              insights
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            AI Optimizer
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a
            className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
            href="#"
          >
            Documentation
          </a>
          <a
            className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px]">
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-primary/10 rounded-xl p-8 md:p-10 glow-effect">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">
                  terminal
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1"
                  htmlFor="email"
                >
                  Work Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
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
                <div className="flex justify-between items-center ml-1">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="text-xs font-semibold text-primary hover:underline"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input
                  className="rounded border-slate-300 dark:border-primary/20 text-primary focus:ring-primary bg-transparent"
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label
                  className="text-sm text-slate-500 dark:text-slate-400"
                  htmlFor="remember"
                >
                  Remember for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-sm">
                    refresh
                  </span>
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-primary/10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?
                <Link
                  className="text-primary font-bold hover:underline ml-1"
                  to="/signup"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6">
            <a
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              href="#"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            </a>
            <a
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              href="#"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-600 tracking-widest uppercase">
          © 2024 AI Optimizer System • Privacy • Terms
        </p>
      </footer>

      <div className="fixed bottom-0 left-0 p-8 pointer-events-none opacity-20 hidden xl:block">
        <div className="flex flex-col gap-2">
          <div className="h-1 w-24 bg-primary rounded-full"></div>
          <div className="h-1 w-16 bg-primary/60 rounded-full"></div>
          <div className="h-1 w-32 bg-primary/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
