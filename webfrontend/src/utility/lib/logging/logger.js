"use client"
import pino from "pino";

const logger = pino({
  level: "debug",
  browser: {
    asObject: true,
    transmit: {
      send: async (level, logEvent) => {
        const logPayload = {
          level,
          time: logEvent.ts,
          ...logEvent.bindings?.[0],
          messages: logEvent.messages,
        };

        try {
          await fetch("/api/logging", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logPayload),
          });
        } catch (err) {
          console.error("Log send failed:", err);
        }
      },
    },
  },
});

export default logger;
