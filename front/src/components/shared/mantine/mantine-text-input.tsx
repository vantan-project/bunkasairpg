import { TextInput, TextInputProps } from "@mantine/core";

export type MantineTextInputProps = TextInputProps

export function MantineTextInput(props: MantineTextInputProps) {
  return <TextInput {...props} />;
}
