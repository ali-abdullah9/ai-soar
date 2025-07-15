import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cyber-black">
      <Sidebar />
      <main className="flex-1 ml-16 lg:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}