import React from "react";
import RainbowText from "@/components/RainbowText";
import { ContactUs } from "@/components/ContactUs";

export const metadata = {
  title: "Contact | Soonlist",
  openGraph: {
    title: "Contact | Soonlist",
  },
};

export default function Page() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <RainbowText className="text-base font-semibold leading-7">
          Contact
        </RainbowText>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Get in touch
        </h1>
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
          Support
        </h2>
        <p className="mt-6 max-w-xl text-xl leading-8">
          Soonlist is new, and we hope you will reach out with questions. For
          support or questions, please <ContactUs>send us an email</ContactUs>.
        </p>
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
          Collaborate
        </h2>
        <p className="mt-6 max-w-xl text-xl leading-8">
          To inquire about collaborating with us, please{" "}
          <ContactUs>send us an email</ContactUs>.
        </p>
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
          Fund
        </h2>
        <p className="mt-6 max-w-xl text-xl leading-8">
          To inquire about supporting Soonlist financially in our goal to exit
          to community, please <ContactUs>send us an email</ContactUs>.
        </p>
      </div>
    </div>
  );
}
