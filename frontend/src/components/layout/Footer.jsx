"use client";

import Link from "next/link";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/shop?sort=deals", label: "Best Deals" },
  { href: "/shop?sort=new", label: "New Arrivals" },
  { href: "/shop?sort=popular", label: "Best Sellers" },
];

const supportLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping Info" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/warranty", label: "Warranty" },
];

const companyLinks = [
  { href: "/about", label: "About TechNest" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
  { href: "/blog", label: "Blog" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { href: "https://twitter.com", label: "Twitter", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
  { href: "https://instagram.com", label: "Instagram", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
  { href: "https://youtube.com", label: "YouTube", icon: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
                TN
              </div>
              <span className="text-lg font-bold tracking-tight">TechNest</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Your trusted destination for premium tech products. Quality guaranteed, delivered fast.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gray-400 transition-colors hover:bg-accent hover:text-white"
                  aria-label={social.label}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Shop</h4>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h4>
            <ul className="mt-4 space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Stay Updated</h4>
            <p className="mt-4 text-sm text-gray-400">
              Subscribe for exclusive deals and tech news.
            </p>
            <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none border border-white/10 focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="w-full shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer sm:w-auto"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} TechNest. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-gray-500 transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 transition-colors hover:text-white">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
