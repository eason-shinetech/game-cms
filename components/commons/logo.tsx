import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={'/'}>
      <Image
        src="/logo.svg"
        priority={true}
        width={130}
        height={130}
        alt="Logo"
      />
    </Link>
  );
}
