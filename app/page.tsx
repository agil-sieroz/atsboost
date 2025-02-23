import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center pt-20">
      <Navbar />
      <main className="container px-4 text-center">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4 animate-glow">
          CV ATS Gratis!
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto text-center">
          Bikin CV ATS gratis, biar lamaran lo gampang dilirik sistem ATS. Buatnya cepet, tinggal isi langsung jadi.
        </p>
        <a href="/cv-form" className="bg-cyan-500 text-black px-6 py-3 rounded-full hover:bg-cyan-600 transition-colors">
          Gass Cobain
        </a>
        <p className="mt-4 text-gray-400">
          Follow Instagram: <a href="https://instagram.com/agilsieroz" className="text-cyan-400 hover:underline" target="_blank">agilsieroz</a>
        </p>
      </main>
    </div>
  );
}