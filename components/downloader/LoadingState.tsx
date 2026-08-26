export default function LoadingState() {
  return (
    <div className="card p-6 animate-fade-in" role="status" aria-label="Analyzing URL">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Thumbnail skeleton */}
        <div className="sm:w-48 sm:h-28 w-full h-40 sm:flex-shrink-0">
          <div className="skeleton-image w-full h-full" />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="skeleton-title" />
          <div className="skeleton-text w-1/2" />
          <div className="flex gap-3 mt-2">
            <div className="skeleton-text w-20 h-6" />
            <div className="skeleton-text w-16 h-6" />
          </div>
        </div>
      </div>

      {/* Bottom skeleton */}
      <div className="mt-5 pt-5 border-t border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="skeleton-text w-24 h-10" />
          <div className="skeleton-text w-24 h-10" />
        </div>
        <div className="skeleton-text w-32 h-10 !rounded-xl" />
      </div>

      <span className="sr-only">Analyzing URL, please wait...</span>
    </div>
  );
}
