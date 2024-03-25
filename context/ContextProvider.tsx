import { CroppedImageProvider } from "./CroppedImageContext";
import { FormProvider } from "./FormContext";
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
        <FormProvider>
          <CroppedImageProvider>{children} </CroppedImageProvider>
        </FormProvider>
      </TimezoneProvider>
    </ModeProvider>
  );
}
