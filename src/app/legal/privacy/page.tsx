import { LandingNavbar } from "@/app/landing/components/navbar"
import React from "react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <LandingNavbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Privacy Policy – Worked<span className="text-primary">In</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: 1st October 2025
        </p>

        <div className="space-y-8 text-sm text-foreground leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              Collection of personal information
            </h2>
            <p className="mb-3">
              Here is the personal information we collect through the Workedin
              platform and during other interactions:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Name, surname</li>
              <li>Email Address</li>
              <li>Phone number</li>
              <li>Curriculum vitae or professional profile (experts)</li>
              <li>
                Connection and usage data for the platform (IP address, browser,
                etc.)
              </li>
              <li>
                Information related to missions (mandates, services, exchanges)
              </li>
            </ul>
            <p className="mb-3">This personal information is collected:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>When you register on the platform</li>
              <li>When you use our services</li>
              <li>During your communications with our team</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold mb-3">2. Use of Information</h2>
            <p className="mb-3">
              Your personal information is used for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create and manage your account</li>
              <li>Connecting clients and experts</li>
              <li>
                To provide our services and ensure their proper functioning
              </li>
              <li>
                Evaluate the quality of our services and improve the user
                experience
              </li>
              <li>Ensuring the security of operations on the platform</li>
              <li>Comply with our legal obligations</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              3. Communication to third parties
            </h2>
            <p className="mb-3">
              Unless it has the consent of the individuals concerned, Workedin
              does not engage in the disclosure, rental, sale or transfer of
              personal information outside the provisions of this policy.
            </p>
            <p className="mb-3">
              We only share your personal information with:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>
                Our technology partners (e.g., secure hosting, analytics tools)
              </li>
              <li>
                Our service providers, to the extent necessary for the
                performance of our services
              </li>
              <li>The competent authorities if required by law</li>
            </ul>
            <p>
              No data is sold or exchanged for commercial purposes. Some of our
              technology service providers may be located outside of Quebec. In
              this case, before any transfer of personal information, we conduct
              an assessment to ensure that this information will receive
              adequate protection, in accordance with the{" "}
              <em>
                Act respecting the protection of personal information in the
                private sector
              </em>{" "}
              —{" "}
              <em>
                Loi sur la protection des renseignements personnels dans le
                secteur privé
              </em>
              .
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              4. Conservation and security
            </h2>
            <p>
              We retain your information for as long as necessary for the
              purposes for which it was collected, unless otherwise required by
              law. The data is stored on secure servers, with protection
              measures in line with best practices (access control, encryption,
              logging, etc.).
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold mb-3">5. Your rights</h2>
            <p className="mb-3">
              In accordance with Law 25, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Right of access to your personal information</li>
              <li>Right of rectification</li>
              <li>Right to withdraw consent</li>
              <li>
                Droit à la suppression (dans les limites permises par la loi)
              </li>
              <li>
                Right to information on automated use or automated
                decision-making, if applicable
              </li>
            </ul>
            <p>To exercise your rights, please contact our Privacy Officer.</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              6. Technologies de profilage, de localisation ou biométriques
            </h2>
            <p>
              We do not use profiling, location tracking, or biometric
              recognition technology. Should we consider using such technology
              in the future, we will clearly inform you and obtain your explicit
              consent beforehand.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              Person responsible for the protection of personal information
            </h2>
            <div className="space-y-1">
              <p>Name: Martin Lessard</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:management@workedin.ca"
                  className="text-primary hover:underline"
                >
                  management@workedin.ca
                </a>
              </p>
              <p>Address: 1012, des Grives, Victoriaville Qc, G6T 1E8</p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold mb-3">Modifications</h2>
            <p>
              This policy may be modified at any time. In the event of a major
              change, a notice will be posted on our website or sent by email.
              This policy has been in effect since 1st October 2025 and may be
              updated. Any changes will be posted on this page, along with the
              date of the update.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
