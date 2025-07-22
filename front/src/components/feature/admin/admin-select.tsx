import {
  MantineSelect,
  MantineSelectProps,
} from "@/components/shared/mantine/mantine-select";

export function AdminSelect(props: MantineSelectProps) {
  return (
    <MantineSelect
      {...props}
      classNames={{
        root: "[&_svg]:!text-white",
        input: "!bg-transparent caret-white !text-white ",
      }}
      allowDeselect={false}
    />
  );
}
