import ListCard from "./ListCard";
import ListCardAdd from "./ListCardAdd";

export default function ListCardGrid({ events }: { events: any[] }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-500">Featured Lists</h2>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
      >
        <ListCardAdd />
        {events.map((event) => (
          <ListCard
            key={event.name}
            name={event.name}
            count={event.count}
            id={event.id}
          />
        ))}
      </ul>
    </div>
  );
}
