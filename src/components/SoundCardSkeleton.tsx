import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SoundCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Waveform */}
        <Skeleton className="h-10 w-full rounded" />
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-3 w-10 rounded-full" />
          <Skeleton className="h-3 w-14 rounded-full" />
          <Skeleton className="h-3 w-12 rounded-full" />
        </div>
        {/* Meta */}
        <div className="flex gap-2 items-center">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-4 w-10 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        {/* Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
