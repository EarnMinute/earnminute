import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 sm:mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
            EarnMinute
          </h2>

          <p className="text-sm text-gray-400 leading-relaxed">
            A trusted platform for small online tasks and freelance work.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4">Quick Links</h3>

          <ul className="space-y-2 sm:space-y-3 text-sm">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/tasks">Browse Tasks</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/feedback">Feedback</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4">Contact</h3>

          <div className="space-y-1 sm:space-y-2 text-sm">
            <p>Email: support@earnminute.com</p>
            <p>Phone: 01784251020</p>
            <p>Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm">
        © {new Date().getFullYear()} EarnMinute
      </div>
    </footer>
  );
}

export default Footer;
