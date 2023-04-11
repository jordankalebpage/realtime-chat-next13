"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ProviderProps {
  children: ReactNode;
}

export default function Providers({ children }: ProviderProps): JSX.Element {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
}
