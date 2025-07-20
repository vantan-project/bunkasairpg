import {
  MantineTextInput,
  MantineTextInputProps,
} from "@/components/shared/mantine/mantine-text-input";

export function AdminTextInput(props: MantineTextInputProps) {
  return (
    <MantineTextInput
      {...props}
      classNames={{
        input: "!bg-transparent caret-white !text-white",
      }}
    />
  );
}
