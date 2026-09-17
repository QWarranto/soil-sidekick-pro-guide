import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
}

export const ListItemSkeleton = ({ showAvatar = false }: { showAvatar?: boolean }) => (
  <div className="flex items-center gap-4 p-4">
    {showAvatar && <Skeleton className="h-12 w-12 rounded-full" />}
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

export const ListSkeleton = ({ items = 5, showAvatar = false }: ListSkeletonProps) => (
  <Card>
    <CardContent className="p-0 divide-y">
      {Array.from({ length: items }).map((_, i) => (
        <ListItemSkeleton key={i} showAvatar={showAvatar} />
      ))}
    </CardContent>
  </Card>
);
