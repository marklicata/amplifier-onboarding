import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2025 Amplifier by Microsoft</p>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Home
            </Link>
            <Link href="/overview" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Overview
            </Link>
            <Link href="/examples" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Examples
            </Link>
            <Link href="/system-overview" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              How It Works
            </Link>
            <Link href="/playground" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Playground
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

