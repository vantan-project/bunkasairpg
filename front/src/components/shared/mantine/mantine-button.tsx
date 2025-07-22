import { Button, ButtonProps, PolymorphicComponentProps } from "@mantine/core";

type Props =
  | PolymorphicComponentProps<"button", ButtonProps>
  | (PolymorphicComponentProps<"link", ButtonProps> & { type: "link" });

export function MantineButton(props: Props) {
  return <Button {...props} />;
}
