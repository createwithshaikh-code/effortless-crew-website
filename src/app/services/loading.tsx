export default function ServicesLoading() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-6 w-28 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-64 bg-muted rounded-xl mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-96 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-8 p-8 rounded-2xl border border-border bg-card animate-pulse">
              <div className="lg:w-64 flex-shrink-0 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="h-6 w-40 bg-muted rounded-lg" />
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-9 w-28 bg-muted rounded-lg" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-5 bg-muted rounded" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
