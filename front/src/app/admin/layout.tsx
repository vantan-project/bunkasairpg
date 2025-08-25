"use client";

import { AdminLayout } from "@/components/layout/admin-layout";

type Props = {
  children: React.ReactNode;
};

export default function ({ children }: Props) {
  return <AdminLayout>{children}</AdminLayout>;
}
