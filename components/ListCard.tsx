import { clsx } from "clsx";
import { FileStack, SquareStack } from "lucide-react";
import Link from "next/link";

const colors = [
  "bg-accent-blue",
  "bg-accent-red",
  "bg-accent-orange",
  "bg-accent-green",
];

const getInitialsFromString = (str: string) => {
  // limit to 2 initials
  const initials = str.match(/\b\w/g) || [];
  return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

const getRainbowColorFromString = (initials: string) => {
  return colors[initials.charCodeAt(0) % colors.length];
};

export default function ListCard(props: {
  name: string;
  id: string;
  count: number;
  username: string;
}) {
  return (
    <li>
      <Link
        href={`/list/${props.id}`}
        className="item-center flex overflow-hidden rounded-xl border-[5px] border-accent-yellow bg-interactive-2"
      >
        <div
          className={clsx(
            getRainbowColorFromString(props.name),
            "size-[5.375rem] flex-shrink-0 items-center justify-center rounded-l-md text-4xl font-bold font-heading leading-none text-white flex pt-1"
          )}
        >
          {getInitialsFromString(props.name)}
        </div>
        <div className="flex shrink-0 flex-col gap-1 p-5">
          <div className="space-between flex w-full">
            <div className="truncate text-xl font-bold leading-6 tracking-wide text-interactive-1">
              {props.name}
            </div>
            <SquareStack className="ml-4 size-6 text-interactive-1" />
          </div>
          <div className="truncate text-lg font-medium leading-none text-neutral-2">
            by{" "}
            <Link
              className="font-semibold text-interactive-1"
              href={`/${props.username}/events`}
            >
              @{props.username}
            </Link>
          </div>
        </div>
      </Link>
    </li>
  );
}
