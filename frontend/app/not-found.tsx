import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fd]">
      <div className="text-center">
        <h1 className="text-6xl font-black text-[#13184f] mb-4">404</h1>
        <p className="text-slate-500 mb-8">Page not found.</p>
        <Link href="/" className="bg-[#13184f] text-white px-6 py-3 rounded-lg font-bold">
          Go Home
        </Link>
      </div>
    </div>
  );
}
