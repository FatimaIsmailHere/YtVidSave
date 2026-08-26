const videoFormats = [
  { name: "MP4", desc: "Universal format, works everywhere" },
  { name: "WebM", desc: "Open format, smaller files" },
];

const audioFormats = [
  { name: "MP3", desc: "Standard audio format" },
  { name: "M4A", desc: "High-quality audio" },
];

const qualities = [
  "2160p (4K)",
  "1440p (2K)",
  "1080p (Full HD)",
  "720p (HD)",
  "480p (SD)",
  "360p",
];

export default function SupportedSources() {
  return (
    <section id="supported-sources" className="py-16 sm:py-20 bg-surface-50 dark:bg-surface-900/30">
      <div className="container-ytvidsave">
        <div className="text-center">
          <h2 className="section-heading">YouTube Videos & Shorts</h2>
          <p className="section-subheading mx-auto max-w-2xl">
            Download YouTube videos and Shorts in multiple formats and qualities.
            Paste any YouTube URL and choose your preferred format.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="card-hover p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                  YouTube Videos & Shorts
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Videos, Shorts, live streams, and public content
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 uppercase tracking-wider">
                  Video Formats
                </h4>
                <div className="space-y-2">
                  {videoFormats.map((fmt) => (
                    <div key={fmt.name} className="flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                      <span className="text-sm font-mono font-medium text-red-600 dark:text-red-400 w-12">
                        {fmt.name}
                      </span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {fmt.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 uppercase tracking-wider">
                  Audio Formats
                </h4>
                <div className="space-y-2">
                  {audioFormats.map((fmt) => (
                    <div key={fmt.name} className="flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                      <span className="text-sm font-mono font-medium text-red-600 dark:text-red-400 w-12">
                        {fmt.name}
                      </span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {fmt.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 uppercase tracking-wider">
                Available Qualities
              </h4>
              <div className="flex flex-wrap gap-2">
                {qualities.map((q) => (
                  <span
                    key={q}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 text-center uppercase tracking-wider">
            Supported YouTube URLs
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "youtube.com/watch?v=...",
              "youtu.be/...",
              "youtube.com/shorts/...",
              "youtube.com/embed/...",
            ].map((example) => (
              <div
                key={example}
                className="px-4 py-2.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-sm font-mono text-surface-600 dark:text-surface-400 text-center"
              >
                {example}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-surface-400 dark:text-surface-500 max-w-lg mx-auto">
          Only public YouTube videos are supported. Content must be accessible without login.
          You are responsible for having the necessary rights or permission to download.
        </p>
      </div>
    </section>
  );
}
