import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/utils";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_CONFIG.name}. Send us your questions, feedback, or support requests.`,
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="container-ytvidsave">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900 dark:text-white">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-surface-500 dark:text-surface-400">
              Have a question or feedback? We would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact methods */}
            <div className="md:col-span-1 space-y-4">
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      Email
                    </p>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      Response Time
                    </p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
