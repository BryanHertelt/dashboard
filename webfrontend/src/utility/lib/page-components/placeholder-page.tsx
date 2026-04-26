import Link from "next/link";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <h1 className="text-2xl font-semibold text-gray-500">{title}</h1>
      <p className="text-sm text-gray-400">This page is coming soon.</p>
      <Link
        href="/tracker/asset-distribution"
        className="px-4 py-2 bg-flyzerblue text-white text-sm rounded-md"
      >
        Go to Asset Distribution
      </Link>
    </div>
  );
}
