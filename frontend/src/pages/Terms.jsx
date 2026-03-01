import React from "react";

function Terms() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">
        Terms & Conditions
      </h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        {/* 1 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using <strong>Task Force BD</strong>, you accept
            and agree to be bound by these Terms & Conditions, our Privacy
            Policy, and any other policies posted on our platform.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            2. User Eligibility
          </h2>
          <p>
            To use Task Force BD, you must be at least 18 years old and capable
            of forming legally binding contracts.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            3. User Accounts & Security
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              You are responsible for maintaining the confidentiality of your
              account information and password.
            </li>
            <li>
              You agree to notify us immediately of any unauthorized use of your
              account.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            4. Posting Tasks & Payments
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Employers can post tasks by providing necessary details including
              job descriptions, required skills, budget, and deadlines.
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            5. Freelancer Responsibilities
          </h2>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            6. Prohibited Activities
          </h2>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            7. Limitation of Liability
          </h2>
          <p>
            Task Force BD is not liable for any damages or losses resulting from
            the use of our platform. We do not guarantee the quality or
            completion of tasks posted by employers.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            8. Changes to Terms
          </h2>
          <p>
            We may update these Terms & Conditions at any time. Continued use of
            the platform after changes signifies your acceptance of the updated
            terms.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Terms;
