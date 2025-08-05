import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-center py-2 bg-purple-950 text-white">
            <Link href="/">
                <h1 className="ml-2 text-4xl font-bold">
                    Ja<span className=" text-purple-500">mmm</span>ing
                </h1>
            </Link>
        </nav>
    );
}