"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SignedIn } from "@clerk/nextjs";
import { List } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormLabel,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/context/FormContext";

export const formSchema = z.object({
  notes: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  lists: z.array(z.string()).optional(),
});

export function YourDetails({ lists }: { lists?: List[] }) {
  const listOptions = lists?.map((list) => ({
    label: list.name,
    value: list.id,
  }));

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
      visibility: "public",
      lists: [""],
    },
  });

  const { setFormData } = useFormContext(); // Use the context

  // Watch for changes in the form
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name) {
        setFormData(form.getValues());
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  return (
    <Card className="max-w-screen w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Publishing Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. My friend Jaron has been working on timetime.cc for months and this is his launch party celebration..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add your context about this event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Public" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SignedIn>
              {listOptions?.length && listOptions.length > 0 && (
                <FormField
                  control={form.control}
                  name="lists"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lists</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select list(s)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {listOptions?.map((option) => (
                            <SelectItem value={option.value} key={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </SignedIn>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
