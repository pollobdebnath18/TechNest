"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/lib/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const accountLinks = [
  { href: "/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { href: "/wishlist", label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { href: "/cart", label: "Cart", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
  { href: "/orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { count } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const profileRef = useRef(null);
  const hoverTimeout = useRef(null);
  const isLoggedIn = !!session;

  const handleProfileEnter = () => {
    clearTimeout(hoverTimeout.current);
    setProfileOpen(true);
  };
  const handleProfileLeave = () => {
    hoverTimeout.current = setTimeout(() => setProfileOpen(false), 150);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">TN</div>
          <span className="text-lg font-bold tracking-tight text-primary">TechNest</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-muted hover:bg-surface hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-primary"
            aria-label="Cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div
              ref={profileRef}
              className="relative"
              onMouseEnter={handleProfileEnter}
              onMouseLeave={handleProfileLeave}
            >
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-primary cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-hover text-[11px] font-bold text-white shadow-sm">
                  {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="max-w-24 truncate hidden xl:inline">{session.user?.name?.split(" ")[0]}</span>
                <svg className={`h-4 w-4 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-white py-2 shadow-xl animate-fade-in">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-primary truncate">{session.user?.name || "User"}</p>
                    <p className="text-xs text-muted truncate">{session.user?.email}</p>
                  </div>
                  <div className="py-1">
                    {accountLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isActive(pathname, link.href)
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-muted hover:bg-surface hover:text-primary"
                        }`}
                      >
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                        </svg>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
                    >
                      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-surface">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/cart" className="relative rounded-lg p-2 text-muted" aria-label="Cart">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted hover:bg-surface cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 pb-4 pt-2 lg:hidden animate-fade-in">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(pathname, link.href)
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted hover:bg-surface hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {isLoggedIn && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Account</p>
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(pathname, link.href)
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:bg-surface hover:text-primary"
                  }`}
                >
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-3 flex gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-primary">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
