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
    <div className="bg-gold text-white overflow-hidden whitespace-nowrap w-full">
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: inline-block;
          animation: marquee-scroll 20s linear infinite;
        }
      `}</style>
      <div className="marquee-inner">
        {[...messages, ...messages, ...messages, ...messages].map((msg, i) => (
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
