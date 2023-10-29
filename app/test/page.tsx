import ListCardGrid from "@/components/ListCardGrid";

const events = [
  {
    name: "Graph API",
    id: "#",
    count: 16,
  },
  {
    name: "Component Design",
    id: "#",
    count: 12,
  },
  {
    name: "Templates",
    id: "#",
    count: 16,
  },
  {
    name: "React Components",
    id: "#",
    count: 8,
  },
];

export default function Page() {
  return <ListCardGrid events={events} />;
}
