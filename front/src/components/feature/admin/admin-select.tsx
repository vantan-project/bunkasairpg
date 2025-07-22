import {
  MantineSelect,
  MantineSelectProps,
} from "@/components/shared/mantine/mantine-select";

export function AdminSelect(props: MantineSelectProps) {
  return <MantineSelect {...props} allowDeselect={false} />;
}
