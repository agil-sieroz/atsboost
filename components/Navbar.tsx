import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-90 text-white p-4 flex justify-between items-center shadow-lg z-20 animate-slide-down navbar">
      <div className="text-3xl font-bold animate-glow">ATSBoost</div>
      <div className="flex space-x-6 items-center navbar-links">
        <Link href="/" className="hover:text-cyan-400 transition-colors">Beranda</Link>
        <Link href="/cv-form" className="hover:text-cyan-400 transition-colors">Buat CV</Link>
        
      </div>
    </nav>
  );
}