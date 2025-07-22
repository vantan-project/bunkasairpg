import {
  NavLink,
  NavLinkProps,
  PolymorphicComponentProps,
} from "@mantine/core";

export type MantineNavLinkProps = PolymorphicComponentProps<
  "button",
  NavLinkProps
>;

export function MantineNavLink(props: MantineNavLinkProps) {
  return <NavLink {...props} />;
}
