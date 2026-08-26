const steps = [
  {
    number: "01",
    title: "Paste URL",
    description:
      "Copy a YouTube video URL and paste it into the input field.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Download",
    description:
      "Click Download and YtVidSave will retrieve the video information and available formats.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Save File",
    description:
      "Your YouTube video will be saved to your device in the chosen format and quality.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-surface-50 dark:bg-surface-900/30">
      <div className="container-ytvidsave">
        <div className="text-center">
          <h2 className="section-heading">How it works</h2>
          <p className="section-subheading mx-auto">
            Three simple steps to download YouTube videos.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-surface-200 dark:bg-surface-700" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-soft flex items-center justify-center relative z-10">
                    <div className="text-red-600 dark:text-red-400 w-8 h-8">
                      {step.icon}
                    </div>
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-red-600 text-white text-sm font-bold flex items-center justify-center shadow-sm z-20">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
