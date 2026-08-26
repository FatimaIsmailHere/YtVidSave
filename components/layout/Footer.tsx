import Link from "next/link";
import { SITE_CONFIG } from "@/lib/utils";

const footerNav = {
  product: [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#supported-sources", label: "Supported Sources" },
    { href: "/#faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/dmca", label: "DMCA" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
      <div className="container-ytvidsave py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerNav.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-500 dark:text-surface-400
                               hover:text-surface-900 dark:hover:text-white
                               transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerNav.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-500 dark:text-surface-400
                               hover:text-surface-900 dark:hover:text-white
                               transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-surface-500 dark:text-surface-400
                             hover:text-surface-900 dark:hover:text-white
                             transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-surface-500 dark:text-surface-400
                             hover:text-surface-900 dark:hover:text-white
                             transition-colors duration-200"
                >
                  Get Support
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-surface-500 dark:text-surface-400
                             hover:text-surface-900 dark:hover:text-white
                             transition-colors duration-200"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-surface-200 dark:border-surface-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-400 dark:text-surface-500">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
              reserved.
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500 text-center sm:text-right">
              {SITE_CONFIG.name} is not affiliated with any third-party media
              platforms.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
