import { Skeleton } from "@/components/ui/skeleton";

const GameItemSkeleton = () => {
  return (
    <div>
      <div className="flex items-center space-x-4">
        <Skeleton className="w-[100px] h-[100px] rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default GameItemSkeleton;
