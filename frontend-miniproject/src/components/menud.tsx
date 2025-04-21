import Link from "next/link";

export default function MenuDesktop() {
  return (
    <div className="flex gap-3">
      <Link
        href="/register"
        className="text-gray-800 border-2 px-4 py-2 rounded-lg font-bold transition duration-300 shadow-md hover:text-orange-500 hover:bg-gray-800 hover:border-gray-300"
      >
        Register
      </Link>
      <Link
        href="/login"
        className="text-orange-500 bg-black px-4 py-2 rounded-lg font-bold transition duration-300 border-2 shadow-md text-shadow-sm hover:bg-gray-800 hover:border-gray-300"
      >
        Login
      </Link>
    </div>
  );
}
