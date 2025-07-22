import {
  MantineButton,
  MantineButtonProps,
} from "@/components/shared/mantine/mantine-button";

export function AdminButton(props: MantineButtonProps) {
  return (
    <MantineButton
      {...props}
      classNames={{
        ...props.classNames,
        root: "!py-4 !h-fit",
      }}
      color="var(--color-black)"
      fullWidth
    />
  );
}
