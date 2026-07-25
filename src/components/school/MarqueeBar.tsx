"use client";

const messages = [
  "Admissions Open for 2025-26!",
  "GSEB Affiliated | Nursery to Class 8",
  "Safe & Nurturing Campus Environment",
  "Experienced & Dedicated Faculty",
  "Enroll Now - Limited Seats Available!",
  "Contact Us: saintmaryrajula@gmail.com",
];

export default function MarqueeBar() {
  return (
    <div className="bg-gold text-white overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-flex">
        {[...messages, ...messages].map((msg, i) => (
          <span
            key={i}
            className="inline-block px-8 py-2 text-sm font-semibold tracking-wide"
          >
            {msg}
            <span className="mx-4 opacity-60">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
