
const username = 1216256

export async function POST(req) {
  const lokiUrl = "https://logs-prod-012.grafana.net/loki/api/v1/push";
    try {
      const body = await req.json();
      console.log("Body", body)
  
      const logLine = {
        streams: [
          {
            stream: {
              app: "flyzer_web_frontend", 
              level: body.level || "info",
            },
            values: [
              [`${BigInt(Date.now()) * 1_000_000n}`, JSON.stringify(body)],
            ],
          },
        ],
      };
 
  
      const res = await fetch(lokiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${username}:${process.env.API_KEY_LOKI}`).toString("base64")}`,
        },
        body: JSON.stringify(logLine),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Loki push failed:", errorText); 
        return new Response("Failed to send to Loki", { status: 500 });
      }
      return new Response("Log sent to Loki", { status: 200 });
    } catch (err) {
      console.error("Logging route error:", err); 
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  
  
