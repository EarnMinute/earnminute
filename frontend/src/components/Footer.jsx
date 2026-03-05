import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* BRAND */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">EarnMinute</h2>

          <p className="text-sm text-gray-400 leading-relaxed">
            A trusted platform for small online tasks and freelance work.
            Connecting employers and freelancers across Bangladesh.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/tasks" className="hover:text-white transition">
                Browse Tasks
              </Link>
            </li>

            <li>
              <Link to="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link to="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="hover:text-white transition">
                Product Feedback
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>

          <div className="space-y-2 text-sm text-gray-400">
            <p>Email: support@earnminute.com</p>
            <p>Phone: 01784251020</p>
            <p>Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 text-center py-5 text-sm text-gray-500">
        © {new Date().getFullYear()} EarnMinute. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
