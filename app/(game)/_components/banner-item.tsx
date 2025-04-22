"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BannerItemProps {
  id: string;
  bannerImage: string;
}

const BannerItem = ({ id, bannerImage }: BannerItemProps) => {
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/${id}`);
  };
  return (
    <AspectRatio
      ratio={128 / 55}
      className="bg-muted rounded-md"
      onClick={() => handleClick(id)}
    >
      <Image
        src={bannerImage}
        alt={id}
        width={640}
        height={275}
        className="h-full w-full rounded-md object-contain shadow-sm"
      />
    </AspectRatio>
  );
};

export default BannerItem;
