"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Heart,
} from "lucide-react";

const navLinks = [
  { href: "/therapists", label: "Find Therapists" },
  { href: "/clinics", label: "Clinics" },
  { href: "/consultation", label: "Consultation" },
  { href: "/physio-dance", label: "Physio Dance" },
  { href: "/shop", label: "Shop" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="PhysioJoy Logo"
              width={40}
              height={40}
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Physio</span>
              <span className="text-foreground">Joy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              href="/shop/cart"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full hover:bg-secondary transition-colors"
                >
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user.name.split(" ")[0]}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <span className="badge badge-primary mt-1 text-[10px]">{user.role}</span>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border/50 pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="flex gap-2 mt-3 px-3">
                  <Link
                    href="/login"
                    className="btn btn-outline btn-sm flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary btn-sm flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
