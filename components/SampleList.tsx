import { UserInfo } from "@/components/UserInfo";
import EventList from "@/components/EventList";
import { api } from "@/trpc/server";

export default async function SampleList({ listId }: { listId: string }) {
  const list = await api.list.get.query({ listId });

  if (!list) {
    return <> </>;
  }
  // limit to 3 events
  const events = list.events.slice(-3);

  return (
    <div>
      <div className="flex flex-col items-start gap-4 px-4 sm:flex-row">
        <div className="align-center flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col">
            <div className="text-xl font-medium">{list.name}</div>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              {list.description}
            </p>
          </div>
          <UserInfo userId={list.userId} />
        </div>
      </div>
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
