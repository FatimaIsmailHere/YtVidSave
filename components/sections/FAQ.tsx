"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "What is YtVidSave?",
    answer:
      "YtVidSave is a free online YouTube video downloader that helps you download YouTube videos in multiple formats and qualities. It is designed for users who own or have permission to use the content they download.",
  },
  {
    question: "How does YtVidSave work?",
    answer:
      "Simply paste a YouTube URL into the input field and click Download. YtVidSave will check the URL, retrieve the video information, and show you the available formats and qualities for download.",
  },
  {
    question: "Is YtVidSave free?",
    answer:
      "Yes, YtVidSave is completely free to use. There are no hidden costs, subscriptions, or required accounts.",
  },
  {
    question: "What YouTube URLs are supported?",
    answer:
      "YtVidSave supports standard YouTube watch URLs (youtube.com/watch?v=...), short links (youtu.be/...), YouTube Shorts, and embed URLs. The video must be publicly accessible.",
  },
  {
    question: "What video formats are available?",
    answer:
      "YtVidSave supports MP4 and WebM for video, and MP3 and M4A for audio extraction. Quality options range from 360p up to 4K, depending on what the original upload provides.",
  },
  {
    question: "Can I use YtVidSave on mobile?",
    answer:
      "Yes, YtVidSave is fully responsive and works great on smartphones, tablets, and desktops. No app installation is required.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. YtVidSave does not require accounts, registration, or personal information. Simply paste a YouTube URL and start downloading.",
  },
  {
    question: "Is downloading copyrighted content allowed?",
    answer:
      "You should only download content that you own or have explicit permission to download. YtVidSave is not responsible for how downloaded content is used. Always respect copyright laws and YouTube's terms of service.",
  },
  {
    question: "What should I do if a URL doesn't work?",
    answer:
      "Make sure the URL is a valid public YouTube URL. Some videos may be private, restricted, or region-locked. Try a different video or check back later.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqItems)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-surface-200 dark:border-surface-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-surface-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors pr-4">
          {item.question}
        </span>
        <svg
          className={`w-5 h-5 text-surface-400 dark:text-surface-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="container-ytvidsave">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="section-heading">Frequently asked questions</h2>
            <p className="section-subheading mx-auto">
              Quick answers to common questions about YtVidSave.
            </p>
          </div>

          <div className="mt-12 card p-1">
            {faqItems.map((item, index) => (
              <FAQItem
                key={item.question}
                item={item}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
