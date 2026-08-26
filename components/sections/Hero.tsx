export default function Hero() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 dark:bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-ytvidsave relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" />
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              Free YouTube Downloader
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-surface-900 dark:text-white animate-fade-in-up">
            Download YouTube Videos & Shorts
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-fade-in-up leading-relaxed">
            Download your favorite YouTube videos and Shorts quickly and easily.
            Choose from multiple formats and quality options.
          </p>

          <p className="mt-3 text-sm text-surface-400 dark:text-surface-500 animate-fade-in-up">
            For YouTube videos, Shorts, and public content only
          </p>
        </div>
      </div>
    </section>
  );
}
