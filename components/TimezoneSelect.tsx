"use client";

import { useContext, useState } from "react";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import { Check, ChevronsUpDown } from "lucide-react";
import { TimezoneContext } from "@/context/TimezoneContext";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const labelStyle = "abbrev";
const timezones = {
  ...allTimezones,
};

export function TimezoneSelect() {
  const [open, setOpen] = useState(false);
  const { timezone, setTimezone } = useContext(TimezoneContext);
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const currentTimezone = options?.find((tz) => tz.value === timezone)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="truncate">{currentTimezone}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search timezone..." />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandGroup className="max-h-48 overflow-y-scroll">
            {options.map((tz) => (
              <CommandItem
                key={tz.value}
                value={tz.value}
                onSelect={(currentValue) => {
                  setTimezone(parseTimezone(currentValue));
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    timezone === tz.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {tz.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
