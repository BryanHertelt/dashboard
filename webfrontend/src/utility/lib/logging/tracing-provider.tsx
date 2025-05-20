"use client";

import { useEffect } from "react";

export default function TracingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Import tracing only on client at runtime
    import("../logging/tracing").then((mod) => {
      mod.initializeTracing();
    });
  }, []);

  return <>{children}</>;
}
