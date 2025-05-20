import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor, WebTracerProvider} from '@opentelemetry/sdk-trace-web';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

export function initializeTracing(){
    if(process.env.NODE_ENV === "development") return 
    const apiKey = ""
    const username = ""
    const provider = new WebTracerProvider()
    const exporter = new OTLPTraceExporter({
      url: "https://tempo-prod-10-prod-eu-west-2.grafana.net/tempo", 
      headers: {
        Authorization: `Basic ${btoa(`${username}:${apiKey}`)}`,
      },
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter))
    provider.register()

    registerInstrumentations({
        instrumentations: [
          new FetchInstrumentation(),
          new UserInteractionInstrumentation({
            eventNames: ["click", "submit"]
          })
        ],
      });
      return provider 
}

