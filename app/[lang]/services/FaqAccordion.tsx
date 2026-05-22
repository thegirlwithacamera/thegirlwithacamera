"use client";

import { useState, useRef, useEffect } from "react";

interface FaqItem {
  readonly q: string;
  readonly a: string;
}

export default function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
      {items.map((item, i) => (
        <FaqItem
          key={item.q}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          isLast={i === items.length - 1}
        />
      ))}
    </div>
  );
}

function FaqItem({
  item,
  isOpen,
  onToggle,
  isLast,
}: {
  item: { readonly q: string; readonly a: string };
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        borderBottom: isLast ? "none" : "1px solid #ebebeb",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 4px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "16px",
        }}
        aria-expanded={isOpen}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "18px",
            fontWeight: 700,
            color: "#0a0a0a",
            lineHeight: 1.3,
          }}
        >
          {item.q}
        </h3>
        <span
          style={{
            flexShrink: 0,
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ebebeb",
            borderRadius: "50%",
            fontSize: "14px",
            color: "#9a9a9a",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
          aria-hidden
        >
          +
        </span>
      </button>

      <div
        style={{
          height: `${height}px`,
          overflow: "hidden",
          transition: "height 0.35s ease",
        }}
      >
        <div ref={bodyRef}>
          <p
            style={{
              padding: "0 4px 22px",
              fontSize: "14px",
              color: "#6a6a6a",
              lineHeight: 1.7,
              maxWidth: "640px",
            }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}
