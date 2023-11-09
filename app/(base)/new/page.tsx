import { Suspense } from "react";
import EventsFromRawText from "./EventsFromRawText";
import Loading from "./Loading";
import ImageUpload from "./ImageUpload";

export const maxDuration = 60;

type Props = {
  params: {};
  searchParams: { rawText?: string };
};

export default function Page({ params, searchParams }: Props) {
  return (
    <>
      <ImageUpload />
      <div className="p-4"></div>
      {searchParams.rawText && (
        <Suspense fallback={<Loading rawText={searchParams.rawText} />}>
          <EventsFromRawText rawText={searchParams.rawText} />
        </Suspense>
      )}
    </>
  );
}