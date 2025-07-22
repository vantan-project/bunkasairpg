import { Select, SelectProps } from "@mantine/core";

export type MantineSelectProps = SelectProps;

export function MantineSelect(props: SelectProps) {
  return <Select {...props} />;
}
