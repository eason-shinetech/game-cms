import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Logo({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <Link href={"/"} className={cn("", className)} {...props}>
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
