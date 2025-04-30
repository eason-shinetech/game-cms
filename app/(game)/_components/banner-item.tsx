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
      ratio={512 / 384}
      className="bg-muted rounded-md shadow-sm"
      onClick={() => handleClick(id)}
    >
      <Image
        src={bannerImage}
        alt={id}
        width={512}
        height={384}
        className="h-full w-full rounded-md object-contain shadow-sm"
      />
    </AspectRatio>
  );
};

export default BannerItem;
