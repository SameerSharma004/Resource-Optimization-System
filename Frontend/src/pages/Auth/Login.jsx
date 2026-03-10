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
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
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
            Don't have an account?
          </span>
          <Link
            to="/signup"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg-lg pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-glow pointer-events-none"></div>

        <div className="w-full max-w-[440px] z-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-white dark:text-slate-900">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-slate-300 dark:text-slate-700"
                htmlFor="email"
              >
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">
                    mail
                  </span>
                </div>
                <input
                  className="w-full h-12 pl-11 pr-4 bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-300 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none"
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
              <div className="flex justify-between items-center">
                <label
                  className="text-sm font-semibold text-slate-300 dark:text-slate-700"
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">
                    lock
                  </span>
                </div>
                <input
                  className="w-full h-12 pl-11 pr-11 bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-300 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none"
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

            <div className="flex items-center gap-2 py-2">
              <input
                className="mt-1 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary focus:ring-primary/30"
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label
                className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
                htmlFor="remember"
              >
                Remember for 30 days
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
                  <span>Sign In</span>
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

export default Login;
