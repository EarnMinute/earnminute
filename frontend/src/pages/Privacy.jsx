import React from "react";

function Privacy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">Privacy Policy</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        {/* 1 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            1. Introduction
          </h2>
          <p>
            Your privacy is important to us. This Privacy Policy explains how
            <strong> Task Force BD </strong> collects, uses, and protects your
            information when you visit or use our platform.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            2. Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email, phone number,
              WhatsApp number (used as login ID).
            </li>
            <li>
              <strong>Task Information:</strong> Details of tasks posted,
              applied for, assigned, or completed.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            3. Use of Information
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To provide and improve our platform services.</li>
            <li>To communicate with you regarding tasks and updates.</li>
            <li>To ensure security and prevent fraud.</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            4. Data Sharing and Disclosure
          </h2>
          <p className="mb-2">
            We do not sell or rent your personal information to third parties.
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              We may share necessary information between employers and
              freelancers to facilitate task completion.
            </li>
            <li>
              We may disclose information if required by law or legal process.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            5. Data Security
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              We employ industry-standard security measures to protect your
              information.
            </li>
            <li>
              Access to personal information is restricted to authorized
              personnel only.
            </li>
            <li>
              We take reasonable steps to ensure the security of your data.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            6. Cookies
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              We use cookies to enhance user experience. Cookies are small files
              stored on your device that help us understand how our platform is
              being used.
            </li>
            <li>You can disable cookies through your browser settings.</li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            7. Your Rights
          </h2>
          <p className="mb-2">
            You have the right to access, update, or delete your personal
            information.
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              You may opt out of receiving marketing communications at any time.
            </li>
            <li>
              Contact us if you have any questions or requests regarding your
              data.
            </li>
          </ul>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically. Continued use of the
            platform after updates indicates acceptance of the revised policy.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
