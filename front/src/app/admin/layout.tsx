"use client";

import { useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";

type Props = {
  children: React.ReactNode;
};

export default function ({ children }: Props) {
  useEffect(() => {
    document.documentElement.classList.add("admin");
  }, []);

  return <AdminLayout>{children}</AdminLayout>;
}
