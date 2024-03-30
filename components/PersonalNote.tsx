import React from "react";
import { cn } from "@/lib/utils";

const colors = [
  // "bg-accent-blue",
  "bg-accent-red/40",
  "bg-accent-orange/40",
  "bg-accent-green/40",
];

const getRainbowColorFromString = (initials: string) => {
  return colors[initials.charCodeAt(0) % colors.length];
};

export default function PersonalNote({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  if (!text) return null;
  return (
    <div
      className={cn(
        "relative w-max rounded-3xl p-3 px-4 pt-4 align-text-top font-heading text-2.5xl font-semibold leading-none text-neutral-2",
        getRainbowColorFromString(text),
        className
      )}
    >
      <div className="absolute -left-2 top-3 font-heading text-5xl font-normal text-primary">
        &ldquo;
      </div>
      {text}
    </div>
  );
}
