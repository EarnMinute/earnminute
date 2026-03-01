function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">TaskForce BD</h2>
          <p className="text-sm text-gray-400">
            A trusted platform for one-time tasks and freelance services.
            Connecting employers and freelancers across Bangladesh.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/tasks" className="hover:text-white transition">
                Browse Tasks
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">
            Email: support@taskforcebd.com
          </p>
          <p className="text-sm text-gray-400">Contact: 01784251020</p>
          <p className="text-sm text-gray-400">Dhaka, Bangladesh</p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} TaskForce BD. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
