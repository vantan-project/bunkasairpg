import { Drawer, DrawerProps } from "@mantine/core";
import clsx from "clsx";

export function MantineDrawer(props: DrawerProps) {
  return (
    <Drawer
      {...props}
      classNames={{
        ...props.classNames,
        content: clsx(
          props.classNames?.content,
          "[&::-webkit-scrollbar]:hidden"
        ),
      }}
    />
  );
}
