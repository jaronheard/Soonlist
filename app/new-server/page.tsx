import { Suspense } from "react";
import Events from "./Events";
import Loading from "./Loading";

type Props = {
  params: {};
  searchParams: { rawText: string };
};

export default function Page({ params, searchParams }: Props) {
  return (
    <>
      <Suspense fallback={<Loading rawText={searchParams.rawText} />}>
        <Events rawText={searchParams.rawText} />
      </Suspense>
    </>
  );
}
