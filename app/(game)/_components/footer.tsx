import Link from "next/link";

const Footer = () => {
  return (
    <div className="p-4 h-full flex items-center justify-center bg-white shadow-[3px_-3px_3px_rgba(0,0,0,0.1)] text-xs">
      <div className="text-slate-400 ">Copyright © 2025 Funny Games.</div>
      <div className="hidden md:flex items-center justify-between gap-4 ml-auto">
        <Link href="/about" className="text-blue-500">
          About Us
        </Link>
        <Link href="/contact" className="text-blue-500">
          Contact
        </Link>
        <Link href="/terms" className="text-blue-500">
          Terms
        </Link>
        <Link href="/privacy" className="text-blue-500">
          Privacy
        </Link>
      </div>
    </div>
  );
};

export default Footer;
