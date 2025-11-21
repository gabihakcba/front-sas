import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-950 text-white">
                <header className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    {/* Logout button could go here, but it's in AuthContext */}
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
