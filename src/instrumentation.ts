import { BatchLogRecordProcessor, LogRecordProcessor } from '@opentelemetry/sdk-logs';
import { MetricReader, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { registerOTel } from '@vercel/otel';
import config from 'aw.config.client';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

// Prevent registering the SDK multiple times
let started = false;

export async function register() {
  if (!started) {
    started = true;
    let traceExporter: SpanExporter | undefined;
    const logRecordProcessors: LogRecordProcessor[] = [];
    const metricReaders: MetricReader[] = [];

    // Register Application Insights exporter if connection string is provided
    if (
      process.env.NEXT_RUNTIME == 'nodejs' &&
      !isNullOrWhitespace(config.applicationInsights.connectionString)
    ) {
      console.log(
        'Registering OpenTelemetry with Application Insights',
        config.applicationInsights
      );
      const { AzureMonitorTraceExporter, AzureMonitorMetricExporter, AzureMonitorLogExporter } =
        await import('@azure/monitor-opentelemetry-exporter');

      const params = {
        connectionString: config.applicationInsights.connectionString,
      };

      traceExporter = new AzureMonitorTraceExporter(params);

      metricReaders.push(
        new PeriodicExportingMetricReader({
          exporter: new AzureMonitorMetricExporter(params),
          exportIntervalMillis: 3000,
        })
      );

      logRecordProcessors.push(
        new BatchLogRecordProcessor(new AzureMonitorLogExporter(params), {
          maxExportBatchSize: 100,
        })
      );
    }

    registerOTel({
      serviceName: 'vercel',
      attributes: {
        'app.name': config.app.application,
        'app.environment': config.app.environment,
        'app.role': config.app.role,
      },
      traceExporter,
      //logRecordProcessors,
      metricReaders,
    });
  }
}
