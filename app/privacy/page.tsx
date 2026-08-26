import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_CONFIG.name}. Learn how we handle your data and protect your privacy.`,
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="container-ytvidsave">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Last updated: August 25, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Introduction
              </h2>
              <p>
                {SITE_CONFIG.name} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the{" "}
                {SITE_CONFIG.url} website. This Privacy Policy informs you of our policies
                regarding the collection, use, and disclosure of personal information when
                you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Information Collection
              </h2>
              <p>
                {SITE_CONFIG.name} is designed to minimize data collection. We do not
                require user accounts, and we do not intentionally collect personally
                identifiable information. URLs you paste into our tool are processed to
                provide media information and are not stored beyond the duration of your
                session.
              </p>
              <p className="mt-3">
                We may automatically collect non-personal information such as browser type,
                operating system, and general usage patterns to improve our service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Cookies and Tracking
              </h2>
              <p>
                We use essential cookies to maintain your theme preference and improve
                your experience. We do not use tracking cookies for advertising or
                analytics purposes without your consent. Third-party advertising partners
                may use cookies if advertising is enabled on the site.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Third-Party Services
              </h2>
              <p>
                {SITE_CONFIG.name} may display advertisements served by third-party ad
                networks. These third parties may use cookies and other tracking
                technologies to serve ads based on your visits to our site and other sites
                on the internet. You may opt out of personalized advertising through your
                browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Data Security
              </h2>
              <p>
                We implement reasonable security measures to protect the information we
                collect. However, no method of transmission over the Internet is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you
                of any changes by posting the new Privacy Policy on this page and updating
                the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
