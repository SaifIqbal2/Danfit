"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ExternalLink,
  ShieldCheck,
  Database,
  Lock,
  LogOut,
  Sparkles,
  Inbox,
} from "lucide-react";
import { getAdminSession, signInAdmin, signOutAdmin, isSupabaseConfigured } from "@/lib/supabase";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  useEffect(() => {
    getAdminSession().then((authenticated) => {
      setIsAuthenticated(authenticated);
      setIsCheckingSession(false);
    });
    setIsLiveSupabase(isSupabaseConfigured());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    const result = await signInAdmin(emailInput.trim(), passwordInput);
    if (result.success) {
      setIsAuthenticated(true);
    } else {
      setLoginError(result.error || "Invalid email or password");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setIsAuthenticated(false);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#f4f4f6] grid place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-red-600" />
      </div>
    );
  }

  // Email and password login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f4f6] text-[#08080a] flex items-center justify-center p-4 font-['DM_Sans',sans-serif]">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          {/* Subtle Red Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />

          {/* DF Monogram */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
            <svg width="40" height="25" viewBox="0 0 120 76" fill="none">
              <path
                d="M4 6H48C60 6 66 13 62 25L50 56C47 63 42 66 36 62L8 34H26L39 47L46 26C48 21 45 18 39 18H16L4 6Z"
                fill="#08080a"
              />
              <path
                d="M46 68L68 16C71 9 77 6 85 6H118L106 18H84C80 18 78 20 76 24L73 31H104L93 43H68L58 66C55 72 50 74 46 68Z"
                fill="#ff0000"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase text-slate-950 font-['Bricolage_Grotesque',sans-serif] tracking-wide">
              DanFit Admin Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Sign in to manage inventory and website content
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                required
                placeholder="Email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 transition"
                autoFocus
              />
            </div>
            <div>
              <input
                type="password"
                required
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 transition"
              />
            </div>
            {loginError && (
              <p className="text-xs text-red-600 font-mono">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-red-600/30 font-mono"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <Link
            href="/"
            className="inline-block text-xs text-slate-500 hover:text-slate-900 transition font-mono"
          >
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products CRUD", href: "/admin/products", icon: Package },
    { name: "Categories CRUD", href: "/admin/categories", icon: FolderTree },
    { name: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#08080a] flex flex-col md:flex-row font-['DM_Sans',sans-serif]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <svg width="32" height="20" viewBox="0 0 120 76" fill="none">
                <path
                  d="M4 6H48C60 6 66 13 62 25L50 56C47 63 42 66 36 62L8 34H26L39 47L46 26C48 21 45 18 39 18H16L4 6Z"
                  fill="#08080a"
                />
                <path
                  d="M46 68L68 16C71 9 77 6 85 6H118L106 18H84C80 18 78 20 76 24L73 31H104L93 43H68L58 66C55 72 50 74 46 68Z"
                  fill="#ff0000"
                />
              </svg>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-slate-950 block font-['Bricolage_Grotesque',sans-serif]">
                  DANFIT <span className="text-red-600">ADMIN</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                  Management Console
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition ${
                    isActive
                      ? "bg-red-600 text-white font-bold shadow-md shadow-red-600/30"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status / Logout */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <Database className="w-3.5 h-3.5 text-red-600" />
            <div className="flex-1 truncate">
              <span className="text-[10px] text-slate-500 block">Database</span>
              <span className={`text-[11px] font-bold ${isLiveSupabase ? "text-emerald-600" : "text-amber-600"}`}>
                {isLiveSupabase ? "Database Connected" : "Database Disconnected"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-mono transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-mono transition font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f4f6]">
        {children}
      </main>
    </div>
  );
};
