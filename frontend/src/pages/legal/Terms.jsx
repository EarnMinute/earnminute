import React from "react";

function Terms() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1>Terms & Conditions</h1>
          <p className="text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong>Earn Minute</strong>, you accept
              and agree to be bound by these Terms & Conditions, our Privacy
              Policy, and any other policies posted on our platform.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3">2. User Eligibility</h2>
            <p>
              To use <strong>Earn Minute</strong>, you must be at least 18 years
              old and capable of forming legally binding contracts.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3">3. User Accounts & Security</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of your
                account information and password.
              </li>
              <li>
                You agree to notify us immediately of any unauthorized use of
                your account.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3">4. Posting Tasks & Payments</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Employers can post tasks by providing necessary details
                including job descriptions, required skills, budget, and
                deadlines.
              </li>
              <li>
                Employers agree to pay the agreed amount to freelancers upon
                satisfactory completion of tasks.
              </li>
              <li>Payments are processed securely through our platform.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3">5. Freelancer Responsibilities</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Freelancers agree to complete tasks in a timely and professional
                manner.
              </li>
              <li>
                Freelancers must adhere to the task requirements as outlined by
                the employer.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3">6. Prohibited Activities</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                You agree not to violate any laws, regulations, or these Terms &
                Conditions.
              </li>
              <li>
                Prohibited activities include spamming, harassment, fraud, and
                posting inappropriate content.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3">7. Limitation of Liability</h2>
            <p>
              <strong>Earn Minute</strong> is not liable for any damages or
              losses resulting from the use of our platform. We do not guarantee
              the quality or completion of tasks posted by employers.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3">8. Changes to Terms</h2>
            <p>
              We may update these Terms & Conditions at any time. Continued use
              of the platform after changes signifies your acceptance of the
              updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;
