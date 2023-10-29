import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx";

const colors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
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
}) {
  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={clsx(
          getRainbowColorFromString(props.name),
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
        )}
      >
        {getInitialsFromString(props.name)}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a
            href={props.id}
            className="font-medium text-gray-900 hover:text-gray-600"
          >
            {props.name}
          </a>
          <p className="text-gray-500">{props.count} events</p>
        </div>
        <div className="shrink-0 pr-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
