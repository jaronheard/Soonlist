import { currentUser } from "@clerk/nextjs";
import ListCard from "./ListCard";
import ListCardAdd from "./ListCardAdd";
import { api } from "@/trpc/server";

type ListCardsForUserProps = {
  userName: string;
  limit: number;
};

export default async function ListCardsForUser({
  userName,
}: // TODO: implement limit
ListCardsForUserProps) {
  const lists = await api.list.getAllForUser.query({
    userName,
  });

  const user = await currentUser();
  const isOwner = user && user.username === userName;
  const hideAll = !isOwner && lists.length === 0;
  const listsToShow = lists.filter((list) => list.eventToLists.length > 0);
  const listsToUse = isOwner ? lists : listsToShow;

  if (!lists || hideAll) {
    return <> </>;
  }

  return (
    <>
      <ul role="list" className="flex flex-wrap gap-5">
        {isOwner && <ListCardAdd />}
        {listsToUse.map((list) => (
          <ListCard
            key={list.name}
            name={list.name}
            // count={list.eventToLists.length}
            id={list.id}
            username={list.user.username}
          />
        ))}
      </ul>
    </>
  );
}
