import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { FollowUserButton } from "./FollowButtons";
import { api } from "@/trpc/server";

type UserInfoProps = {
  userId?: string;
  userName?: string;
  variant?: "default" | "icon" | "description";
};

export async function UserInfo(props: UserInfoProps) {
  const activeUser = await currentUser();
  if (!props.userId && !props.userName) {
    return null;
  }

  let user;
  if (props.userId) {
    user = await api.user.getById.query({ id: props.userId });
  } else if (props.userName) {
    user = await api.user.getByUsername.query({ userName: props.userName });
  }

  if (!user) {
    return null;
  }

  const self = activeUser?.id === user.id;

  const following =
    activeUser?.id &&
    (await api.user.getIfFollowing.query({
      followerId: activeUser.id,
      followingId: user.id,
    }));

  if (props.variant === "icon") {
    return (
      <Link href={`/${user.username}/events`} className="group">
        <Image
          className="size-[2.625rem] rounded-full border-8 border-accent-yellow"
          src={user.userImage}
          alt=""
          width={375}
          height={375}
        />
      </Link>
    );
  }

  if (props.variant === "description") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-6">
          <Link href={`/${user.username}/events`}>
            <Image
              className="content-box size-20 rounded-full border-8 border-accent-yellow"
              src={user.userImage}
              alt=""
              width={375}
              height={375}
            />
          </Link>
          <div className="flex flex-col">
            <Link href={`/${user.username}/events`}>
              <p className="font-heading text-5xl font-bold leading-[3.5rem] tracking-tight text-neutral-1">
                {user.displayName}
              </p>
              <p className="text-2xl font-bold leading-normal tracking-wide">
                @{user.username}
              </p>
            </Link>
          </div>
        </div>
        <div className="text-2xl text-neutral-2">
          {/* {user.description} */}A short bio will go here. Something like:
          I&apos;m a Taurus, I like coffee and staying up late. Also links to
          whatever contact methods people want to provide.
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link href={`/${user.username}/events`}>
          <Image
            className="inline-block size-9 rounded-full"
            src={user.userImage}
            alt=""
            width={375}
            height={375}
          />
        </Link>
        <Link href={`/${user.username}/events`} className="group">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {user.displayName}
          </p>
          <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
            @{user.username}
          </p>
        </Link>
      </div>
      {!self && (
        <div>
          <FollowUserButton userId={user.id} following={!!following} />
        </div>
      )}
    </div>
  );
}
