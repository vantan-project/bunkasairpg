import { Button, ButtonProps, PolymorphicComponentProps } from "@mantine/core";

export type MantineButtonProps =
  | PolymorphicComponentProps<"button", ButtonProps>
  | (PolymorphicComponentProps<"link", ButtonProps> & { type: "link" });

export function MantineButton(props: MantineButtonProps) {
  return <Button {...props} />;
}
