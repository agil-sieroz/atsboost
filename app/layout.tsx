import './globals.css';
import { Poppins } from 'next/font/google';
import ParticlesBackground from '../components/ParticlesBackground';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

export const metadata = {
  title: 'ATSBoost',
  description: 'Buat CV Siap ATS dalam Hitungan Menit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${poppins.className} bg-black text-white relative overflow-x-hidden`}>
        <ParticlesBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}