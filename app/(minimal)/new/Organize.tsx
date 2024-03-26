"use client";

import * as React from "react";
import { type useForm } from "react-hook-form";
import { SignedIn } from "@clerk/nextjs";
import { ListIcon } from "lucide-react";
import { type z } from "zod";
import { type organizeFormSchema } from "@/components/YourDetails";
import { type List } from "@/server/db/types";
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
import { MultiSelect } from "@/components/ui/multiselect";

export function Organize({
  form,
  lists,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof organizeFormSchema>>>;
  lists?: List[];
}) {
  const listOptions = lists?.map((list) => ({
    label: list.name,
    value: list.id,
  }));

  return (
    <SignedIn>
      <Card className="max-w-screen w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListIcon className="mr-2 size-6" />
            Save to List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
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
              <div className="space-y-4">
                {listOptions?.length && listOptions.length > 0 ? (
                  <FormField
                    control={form.control}
                    name="lists"
                    render={({ field: { ...field } }) => (
                      <FormItem>
                        <FormLabel>Choose a list</FormLabel>
                        <MultiSelect
                          selected={field.value}
                          options={listOptions}
                          placeholder="All Events"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Example: My friend Sarah hosts this dance party every year and its so fun!"
                          defaultValue={field.value}
                          onChange={field.onChange}
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Write something personal about this event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SignedIn>
  );
}
