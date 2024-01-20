import { UserInfo } from "@/components/UserInfo";
import { api } from "@/trpc/server";

type Props = { params: { userName: string } };

export default async function Page({ params }: Props) {
  const users = await api.user.getFollowing.query({
    userName: params.userName,
  });

  console.log(users);

  return (
    <>
      <div className="flex place-items-center gap-2">
        <div className="font-medium">Users followed by</div>
        <div className="font-bold">@{params.userName}</div>
      </div>
      <div className="p-4"></div>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <UserInfo key={user.username} userName={user.username} />
        ))}
      </div>
      <div className="p-4"></div>
    </>
  );
}
