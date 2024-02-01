import ListCard from "./ListCard";
import EventList from "@/components/EventList";
import { api } from "@/trpc/server";

export default async function SampleList({ listId }: { listId: string }) {
  const list = await api.list.get.query({ listId });

  if (!list) {
    return <> </>;
  }
  // limit to 3 events
  const events = list.eventToLists.slice(-3).map((item) => item.event);

  return (
    <div>
      <ListCard name={list.name} username={list.user.username} id={listId} />
      <div className="p-2"></div>
      <EventList
        currentEvents={[]}
        futureEvents={events}
        pastEvents={[]}
        showPrivateEvents={false}
        variant="future-minimal"
      />
    </div>
  );
}
