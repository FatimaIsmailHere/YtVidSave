"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // In a real implementation, this would send to an API endpoint
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
          Message sent!
        </h3>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
          }}
          className="mt-4 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="input-field text-sm"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="input-field text-sm"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
        >
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          required
          className="input-field text-sm"
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
          rows={5}
          className="input-field text-sm resize-none"
          placeholder="Tell us more..."
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send Message
      </button>
    </form>
  );
}
