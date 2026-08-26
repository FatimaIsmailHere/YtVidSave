import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DMCA Policy",
  description: `DMCA and copyright policy for ${SITE_CONFIG.name}. How to report copyright infringement.`,
};

export default function DmcaPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="container-ytvidsave">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900 dark:text-white">
            DMCA Policy
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Last updated: August 25, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Copyright Policy
              </h2>
              <p>
                {SITE_CONFIG.name} respects the intellectual property rights of others and
                expects our users to do the same. We comply with the Digital Millennium
                Copyright Act (DMCA) and will respond promptly to notices of alleged
                copyright infringement.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Filing a DMCA Notice
              </h2>
              <p>
                If you believe that content accessible through {SITE_CONFIG.name} infringes
                your copyright, please send a written DMCA notice to our designated
                copyright agent including the following information:
              </p>
              <ol className="mt-3 ml-5 list-decimal space-y-2">
                <li>
                  <strong className="text-surface-700 dark:text-surface-300">
                    Identification of the copyrighted work
                  </strong>{" "}
                  claimed to have been infringed
                </li>
                <li>
                  <strong className="text-surface-700 dark:text-surface-300">
                    Identification of the infringing material
                  </strong>{" "}
                  and its location on our service (URL)
                </li>
                <li>
                  <strong className="text-surface-700 dark:text-surface-300">
                    Your contact information
                  </strong>{" "}
                  (name, address, telephone number, and email)
                </li>
                <li>
                  <strong className="text-surface-700 dark:text-surface-300">
                    A statement of good faith belief
                  </strong>{" "}
                  that the use of the material is not authorized by the copyright owner,
                  its agent, or the law
                </li>
                <li>
                  <strong className="text-surface-700 dark:text-surface-300">
                    A statement under penalty of perjury
                  </strong>{" "}
                  that the information in the notice is accurate and that you are the
                  copyright owner or authorized to act on behalf of the copyright owner
                </li>
                <li>
                  <strong className="text-surface-700 dark:text-surface-300">
                    Your physical or electronic signature
                  </strong>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                How to Submit a Notice
              </h2>
              <p>
                Send your DMCA notice by email to our designated copyright agent:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                <p className="text-surface-700 dark:text-surface-300">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:dmca@ytvidsave.com"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    dmca@ytvidsave.com
                  </a>
                </p>
                <p className="mt-2 text-surface-700 dark:text-surface-300">
                  <strong>Subject Line:</strong> DMCA Takedown Request
                </p>
                <p className="mt-2 text-surface-500 dark:text-surface-400 text-xs">
                  Please include &quot;DMCA Takedown Request&quot; in the subject line for
                  faster processing.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Counter-Notification
              </h2>
              <p>
                If you believe your content was removed or disabled by mistake or
                misidentification, you may file a counter-notification with our copyright
                agent. Your counter-notification must include:
              </p>
              <ul className="mt-2 ml-5 list-disc space-y-1">
                <li>Your name, address, and telephone number</li>
                <li>Identification of the removed material and its former location</li>
                <li>
                  A statement under penalty of perjury that the material was removed by
                  mistake or misidentification
                </li>
                <li>Your consent to the jurisdiction of the federal court in your district</li>
                <li>Your physical or electronic signature</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Repeat Infringers
              </h2>
              <p>
                {SITE_CONFIG.name} may terminate the access of users who are found to be
                repeat infringers of copyrighted material, in accordance with the DMCA and
                applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                Important Note
              </h2>
              <p>
                {SITE_CONFIG.name} does not host any media content. We provide a tool to
                analyze URLs and display available media information. We are not responsible
                for the content that users choose to download. We encourage all users to
                respect copyright laws and only download content they own or have permission
                to use.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
