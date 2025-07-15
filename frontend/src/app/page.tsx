import HeroSection from '@/components/home/HeroSection';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cyber-black">
      <Navbar />
      <HeroSection />
      {/* Add more sections here */}
    </main>
  );
}