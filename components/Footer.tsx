import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2025 Amplifier Onboarding</p>
          <div className="flex gap-6">
            <a
              href="https://github.com/microsoft/amplifier"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              GitHub
            </a>
            <Link href="/elevator-pitch" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Elevator Pitch
            </Link>
            <Link href="/system-overview" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              System Overview
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
