"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  zipcode: z.string().min(5, {
    message: "Zipcode must be at least 5 characters.",
  }),
  // why: z
  //   .string()
  //   .max(1000, {
  //     message: "Why must be less than 1000 characters.",
  //   })
  //   .optional(),
});

export function WaitlistSignup() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      zipcode: "",
      // why: "",
    },
  });

  const waitlistSignup = api.waitlist.create.useMutation({
    onError: () => {
      toast.error("Your weren't added to the waitlist. Please try again.");
    },
    onSuccess: () => {
      form.reset();
      toast.success("You've been added to the waitlist.");
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    waitlistSignup.mutate(values);
  }

  return (
    <>
      <div className="text-center font-heading text-4xl font-bold leading-[1.0833] tracking-tight text-gray-900 sm:text-5xl">
        Get early access
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-2xl leading-9 text-gray-400">
        Soonlist is currently in preview. Be one of the first to know when we
        launch in your area, and get free early supporter perks! 🎉
      </p>
      <div className="py-4"></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-4 md:flex-row md:gap-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-96 sm:w-[36rem]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Your email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Your area</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <FormField
            control={form.control}
            name="why"
            render={({ field }) => (
              <FormItem
                className={cn("transition-all duration-150", {
                  "w-full h-44 opacity-100": form.formState.isDirty,
                  "w-0 h-0 md:h-44 opacity-0": !form.formState.isDirty,
                })}
              >
                <FormLabel>Why (optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} rows={2} />
                </FormControl>
                <FormDescription>
                  Tell us what excites you about SoonList (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button className="max-w-min md:mt-8" type="submit">
            Join the waitlist
          </Button>
        </form>
      </Form>
    </>
  );
}
