import { CroppedImageProvider } from "./CroppedImageContext";
import { NewEventProvider } from "./NewEventContext";
import { ModeProvider } from "./ModeContext";
import { TimezoneProvider } from "./TimezoneContext";

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModeProvider>
      <TimezoneProvider>
        <NewEventProvider>
          <CroppedImageProvider>{children} </CroppedImageProvider>
        </NewEventProvider>
      </TimezoneProvider>
    </ModeProvider>
  );
}
