import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton = memo(function Skeleton({ className = "", children }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      {children}
    </div>
  );
});

interface SkeletonCardProps {
  lines?: number;
}

export const SkeletonCard = memo(function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </div>
    </div>
  );
});

export const MatchesSkeleton = memo(function MatchesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} lines={3} />
      ))}
    </div>
  );
});
