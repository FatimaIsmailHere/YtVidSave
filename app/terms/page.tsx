import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${SITE_CONFIG.name}. Read the terms and conditions for using our service.`,
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="container-ytvidsave">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Last updated: August 25, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using {SITE_CONFIG.name} ({SITE_CONFIG.url}), you agree to
                be bound by these Terms of Service. If you do not agree to these terms,
                please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Description of Service
              </h2>
              <p>
                {SITE_CONFIG.name} is a free online tool that helps users analyze media
                URLs and explore available download options. We do not host, store, or
                distribute any media content. We do not bypass DRM, access controls, or
                platform restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Acceptable Use
              </h2>
              <p>You agree to use {SITE_CONFIG.name} only for lawful purposes. You must:</p>
              <ul className="mt-2 ml-5 list-disc space-y-1">
                <li>Only download content you own or have permission to use</li>
                <li>Respect copyright laws and intellectual property rights</li>
                <li>Not attempt to bypass platform restrictions or access controls</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
                <li>Not attempt to overload, disrupt, or compromise the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Intellectual Property
              </h2>
              <p>
                The {SITE_CONFIG.name} service, including its design, code, and content, is
                owned by {SITE_CONFIG.name} and protected by applicable intellectual property
                laws. You may not copy, modify, or distribute any part of our service
                without permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Disclaimer of Warranties
              </h2>
              <p>
                {SITE_CONFIG.name} is provided &quot;as is&quot; and &quot;as available&quot;
                without warranties of any kind. We do not guarantee that the service will
                be uninterrupted, error-free, or compatible with all media sources. We are
                not responsible for any content accessed through URLs you submit.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Limitation of Liability
              </h2>
              <p>
                {SITE_CONFIG.name} shall not be liable for any indirect, incidental,
                special, or consequential damages arising from your use of the service. Our
                total liability shall not exceed the amount you paid to use the service
                (which is zero, as the service is free).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be
                effective immediately upon posting. Your continued use of the service after
                changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Contact
              </h2>
              <p>
                Questions about these terms? Contact us at{" "}
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
