import type { ReactNode } from "react";

export type PmsFormAction = (formData: FormData) => void | Promise<void>;

export type PmsShellProps = {
  children: ReactNode;
  sessionEmail: string;
};

export type PmsPageState = {
  status?: string;
  error?: string;
};
